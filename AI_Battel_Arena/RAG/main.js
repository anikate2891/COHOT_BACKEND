import dotenv from 'dotenv';
dotenv.config();
import { Pinecone } from '@pinecone-database/pinecone';
import {PDFParse} from 'pdf-parse';
import fs from 'fs';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings } from "@langchain/mistralai";

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

const index = pc.Index(process.env.PINECONE_INDEX_NAME);

let dataBuffer = fs.readFileSync('./REST-API notes.pdf');
const parser = new PDFParse({data: dataBuffer});
const data = await parser.getText();

const embeddings = new MistralAIEmbeddings({
    apiKey: process.env.MISTRALAI_API_KEY,
    model:'mistral-embed',
});

// console.log(data);
const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 3000,
    chunkOverlap: 0,
});

const chunks = await textSplitter.splitText(data.text);
// console.log(chunks, chunks.length);

const docs = await Promise.all(chunks.map(async (chunk) => {
    const embedding = await embeddings.embedQuery(chunk);
        return {
            text: chunk,
            embedding: embedding,
        }
}));

const results = await index.upsert({
    records: docs.map((doc, i) => ({
        id: `doc-${i}`,
        values: doc.embedding,
        metadata: {
            text: doc.text,
        },
    })),    
});

const queryEmbedding = await embeddings.embedQuery("What is REST API?");
const queryResults = await index.query({
    topK: 2,
    vector: queryEmbedding,
    includeMetadata: true,
});

console.log(queryResults);

