import { Request, Response } from "express";
import { mistralModel, cohereModel, geminiModel } from "./models.service.js";
import { createAgent, providerStrategy, HumanMessage } from "langchain";
import z from "zod";

export default async function (req: Request, res: Response) {
    const { problem } = req.body;

    res.setHeader("Content-Type", "text/plain");

    let solution1 = "";
    let solution2 = "";

    const streamToRes = async (stream: any, label: string, store: (t: string) => void) => {
        for await (const chunk of stream) {
            const text = chunk.content ?? "";

            store(text); // 👈 store for judge

            res.write(JSON.stringify({
                model: label,
                content: text
            }) + "\n");
        }
    };

    const mistralStream = await mistralModel.stream(problem);
    const cohereStream = await cohereModel.stream(problem);

    await Promise.all([
        streamToRes(mistralStream, "mistral", (t) => solution1 += t),
        streamToRes(cohereStream, "cohere", (t) => solution2 += t)
    ]);

    // 🔥 Judge (end me)
    const judgeAgent = createAgent({
        model: geminiModel,
        responseFormat: providerStrategy(z.object({
            solution_1_score: z.number(),
            solution_2_score: z.number(),
            solution_1_feedback: z.string(),
            solution_2_feedback: z.string()
        }))
    });

    const judgeResponse = await judgeAgent.invoke({
        messages: [
            new HumanMessage(`
Problem: ${problem}
Solution 1: ${solution1}
Solution 2: ${solution2}
Evaluate both.
`)
        ]
    });

    res.write(JSON.stringify({
        type: "judge",
        data: judgeResponse.structuredResponse
    }) + "\n");

    res.end();
}