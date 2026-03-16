import 'dotenv/config';
import readline from "readline/promises";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, tool } from 'langchain';
import nodemailer from 'nodemailer';
import { sendEmail } from './mail.services.js';


const emailTool = tool({})

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const message = [] 

const model = new ChatMistralAI({
    model:'mistral-small-latest',
})

while (true){
    const userinput = await rl.question('You: ');
    message.push(new HumanMessage(userinput));

    const response = await model.invoke(message)
    message.push(response)
    console.log(response.text)
}