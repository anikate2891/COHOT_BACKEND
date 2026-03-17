import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages"
import { ChatMistralAI } from "@langchain/mistralai"


const Geminimodel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GOOGLE_API_KEY
});

const Mistralmodel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
});

export async function generateResponse(messages) {
    const response = await Geminimodel.invoke(messages.map(msg => {
        if(msg.role === 'user') {
            return new HumanMessage(msg.content);
        } else {
            return new AIMessage(msg.content);
        }
    }));
    return response.text;
}

export async function generateChatTitle(message) {
    const response = await Mistralmodel.invoke([
        new SystemMessage(`Generate a concise title for the following conversation.`),
        new HumanMessage(`Generate a concise title for the following conversation: ${message}`)
    ]);
    return response.text;
}   