import type { Request, Response } from "express";
import { mistralModel, cohereModel, geminiModel } from "./models.service.js";
import { createAgent, providerStrategy, HumanMessage } from "langchain";
import chatModel from "../models/chatModel.js";
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

    await Promise.allSettled([
        streamToRes(mistralStream, "mistral", (t) => solution1 += t),
        streamToRes(cohereStream, "cohere", (t) => solution2 += t)
    ]);
console.log("BEFORE JUDGE");
   
    const judgeAgent = createAgent({
        model: geminiModel,
        // responseFormat: providerStrategy(z.object({
        //     solution_1_score: z.number(),
        //     solution_2_score: z.number(),
        //     solution_1_feedback: z.string(),
        //     solution_2_feedback: z.string()
        // }))
    });

   let judgeData = null;

try {
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
  console.log("FULL:", judgeResponse);
  judgeData = judgeResponse;
  console.log(judgeData);
  

  res.write(JSON.stringify({
    type: "judge",
    data: judgeData
  }) + "\n");

} catch (err) {
    console.log("JUDGE ERROR:", err);
  judgeData = {};
}
console.log("AFTER JUDGE");
    const userId = (req as any).user.userId;

    await chatModel.create({
    userId,
    problem,
    solution_1: solution1,
    solution_2: solution2,
    judge: judgeData,
    });
    res.end();
}