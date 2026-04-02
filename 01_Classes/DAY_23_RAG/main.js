import dotenv from 'dotenv';
dotenv.config();

import { Pinecone } from '@pinecone-database/pinecone';
import { PDFParse } from 'pdf-parse';
import fs from 'fs';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings } from "@langchain/mistralai";

// Pinecone client init (vector DB connection)
const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
}); 

// Specific index connect (jaha vectors store honge)
const index = pc.Index(process.env.PINECONE_INDEX_NAME);


// ==================== 01 ====================
// PDF file read + text extract
let dataBuffer = fs.readFileSync('./REST-API notes.pdf'); // PDF file read
const parser = new PDFParse({ data: dataBuffer }); // parser create
const data = await parser.getText(); // pure text extract
// 👉 Output: data.text = pura PDF ka content


// ==================== 02 ====================
// Large text ko small chunks me todna
const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 3000, // ek chunk me max 3000 characters
    chunkOverlap: 0, // overlap nahi hai
});
const chunks = await textSplitter.splitText(data.text);
// 👉 Output: chunks = chhote chhote text parts


// ==================== 03 ====================
// Embedding model setup (text → vector conversion)
const embeddings = new MistralAIEmbeddings({
    apiKey: process.env.MISTRALAI_API_KEY,
    model: 'mistral-embed',
});


// ==================== 04 ====================
// Har chunk ko vector (embedding) me convert karna
const docs = await Promise.all(
    chunks.map(async (chunk) => {
        const embedding = await embeddings.embedQuery(chunk); // text → vector
        return {
            text: chunk,        // original text
            embedding: embedding, // vector form
        };
    })
);
// 👉 Output: array of {text + vector}


// ==================== 05 ====================
// Pinecone me vectors store karna
await index.upsert({
    records: docs.map((doc, i) => ({
        id: `doc-${i}`,         // unique id
        values: doc.embedding, // vector data
        metadata: {
            text: doc.text,    // original text save (important)
        },
    })),
});
// 👉 Ab saare chunks vector DB me store ho gaye


// ==================== 06 ====================
// User query ko bhi vector me convert karna
const queryEmbedding = await embeddings.embedQuery("What is REST API?");
// 👉 Query bhi same format me convert hua


// ==================== 07 ====================
// Vector similarity search (kaunsa chunk sabse close hai)
const queryResults = await index.query({
    topK: 2, // top 2 similar chunks chahiye
    vector: queryEmbedding,
    includeMetadata: true, // text bhi return karo
});
// 👉 Sabse relevant chunks milenge


// ==================== 08 ====================
// Final result print
console.log(queryResults);
// 👉 Yeh raw retrieved data hai (abhi LLM use nahi hua)