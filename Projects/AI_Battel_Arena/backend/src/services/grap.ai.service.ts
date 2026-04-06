import { StateGraph, StateSchema, type GraphNode, START, END } from "@langchain/langgraph";
import z from "zod";
import { geminiModel, mistralModel, cohereModel } from "./models.service.js";
import { createAgent, toolStrategy, providerStrategy, HumanMessage } from "langchain";

const state = new StateSchema({
    problem: z.string().default(''),
    solution_1: z.string().default(''),
    solution_2: z.string().default(''),
    judge:z.object({
        solution_1_score: z.number().default(0),
        solution_2_score: z.number().default(0),
        solution_1_feedback: z.string().default(''),
        solution_2_feedback: z.string().default('')
    })
})

const SolutionNode: GraphNode<typeof state> = async (state) => {
    const [mistralResponse, cohereResponse] = await Promise.all([
        mistralModel.invoke(state.problem),
        cohereModel.invoke(state.problem)
    ]);

    return {
        solution_1: mistralResponse.text,
        solution_2: cohereResponse.text
    };
}

const JudgeNode: GraphNode<typeof state> = async (state) => {
    const {problem, solution_1, solution_2} = state;

    const judgeAgent = createAgent({
        model: geminiModel,
        responseFormat:providerStrategy(z.object({
            solution_1_score: z.number().min(0).max(10),
            solution_2_score: z.number().min(0).max(10),
            solution_1_feedback: z.string(),
            solution_2_feedback: z.string()
        })),
            systemPrompt:`You are an expert judge tasked with evaluating two solutions to a given problem. Please provide a score between 0 and 10 for each solution, along with detailed feedback explaining the reasoning behind the scores. Consider factors such as correctness, efficiency, creativity, and clarity in your evaluation.`
        })

    const judgeResponse = await judgeAgent.invoke({
        messages:[
            new HumanMessage(
                `
                Problem: ${problem}
                Solution 1: ${solution_1}
                Solution 2: ${solution_2}
                Please evaluate the two solutions and provide your scores and feedback.
                `
            )
        ]
    })

    const {
        solution_1_score, 
        solution_2_score, 
        solution_1_feedback, 
        solution_2_feedback
        } = judgeResponse.structuredResponse;

    return {
        judge: { solution_1_score, solution_2_score, solution_1_feedback, solution_2_feedback }
    };
}   

// Graph definition
const graph = new StateGraph(state)
    .addNode("solution", SolutionNode)
    .addNode("judge_node", JudgeNode)

    .addEdge(START, "solution")
    .addEdge("solution", "judge_node")
    .addEdge("judge_node", END)
    .compile();

//runGraph function.
export default async function (problem: string) {
    const result = await graph.invoke({ problem: problem });
    return result;
}