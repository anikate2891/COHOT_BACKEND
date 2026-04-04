import { StateSchema, MessagesValue, ReducedValue, StateGraph, START, END } from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import {string, z} from "zod";
import { createAgent, providerStrategy } from "langchain";
import { geminiModel, cohereModel, mistralModel } from "./models.service.js";

// Data ek jaga se dusri jaga transfer karne ke liye use hota hai
const State = new StateSchema({
    messages: MessagesValue, //Default
    solution_1:new ReducedValue(z.string().default(""),{
        reducer: (current, next) => {
            return next; // Always take the latest value
        },
    }),
    solution_2:new ReducedValue(z.string().default(""),{
        reducer: (current, next) => {
            return next; // Always take the latest value
        }
    }),
    jusdge_recommendation: new ReducedValue(z.object().default({
        solution_1_score: 0,
        solution_2_score: 0,
    }),
    {
        reducer: (current, next) => {
            return next; // Always take the latest value
        }
    }),
});

const solutionNode: GraphNode<typeof State> = async (state:typeof State)=>{

        console.log(state);
        

    const [mistral_solution, cohere_solution] = await Promise.all([
        mistralModel.invoke(state.messages[0].text),
        cohereModel.invoke(state.messages[0].text)
    ]) // For parallel execution of multiple tasks if needed

    return {
        solution_1: mistral_solution.text, // Default
        solution_2: cohere_solution.text // Default
    }
}

const judgeNode: GraphNode<typeof State> = async (state:typeof State)=>{

    const { solution_1, solution_2 } = state;
    const judge = createAgent({
        model:geminiModel,
        tools:[],
        responseFormat: providerStrategy(z.object({
            solution_1_score: z.number().min(0).max(10),
            solution_2_score: z.number().min(0).max(10),
        }))
    })

    const judge_recommendation = await judge.invoke({
        messages:[
            new HumanMessage(
            `You are a judge tasked with evaluating two solutions to a problem.The problem is ${state.messages[0].text},This is 1st solution: ${solution_1}. This is 2nd solution: ${solution_2}. Please provide a score for each solution on a scale of 0 to 10, where 0 indicates a poor solution and 10 indicates an excellent solution.`
            )
        ]
    });

    const result = judge_recommendation.structuredResponse;

    return {
        jusdge_recommendation: result
    }
}

const graph = new StateGraph(State)
    .addNode('solution', solutionNode)
    .addNode('judge', judgeNode)
    .addEdge(START, 'solution')
    .addEdge('solution', 'judge')
    .addEdge('solution', END)
    .compile();

export default async function (Usermessages:string){
    const result = await graph.invoke({
        messages:[
            new HumanMessage(Usermessages)
        ]
    })
    console.log(result);
    
    return result.messages;
}