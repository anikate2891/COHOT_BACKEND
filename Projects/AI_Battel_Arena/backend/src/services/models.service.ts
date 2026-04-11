import {ChatGoogle} from "@langchain/google";
import {ChatMistralAI} from "@langchain/mistralai";
import {ChatCohere} from "@langchain/cohere";
import configs from "../config/config.js";

// Judge model
export const geminiModel = new ChatGoogle({
    model: "gemini-2.0-flash",
    apiKey: configs.GOOGLE_API_KEY,
    streaming: false,
});

export const mistralModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: configs.MISTRAL_API_KEY,
    streaming: true,
});

export const cohereModel = new ChatCohere({
    model: "command-a-03-2025",
    apiKey: configs.COHERE_API_KEY,
    streaming: true,
}); 