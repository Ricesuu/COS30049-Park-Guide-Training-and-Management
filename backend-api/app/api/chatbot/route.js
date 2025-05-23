import { NextResponse } from 'next/server';
import { QdrantClient } from '@qdrant/js-client-rest';
import { CohereClient } from 'cohere-ai';
//npm install cohere-ai
// Initialize Qdrant client
const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
  checkCompatibility: false,  
});

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export async function POST(request) {
  const body = await request.json();
  const { question } = body;

  if (!question) {
    return NextResponse.json({ error: 'No question provided' }, { status: 400 });
  }

  // 1. Get embedding
  const embedding = await getEmbeddingFromLocalServer(question);
  if (!embedding) {
    return NextResponse.json({ error: 'Embedding failed' }, { status: 500 });
  }

  // 2. Use embedding to search similar vectors in Qdrant
  try {
    const searchResult = await qdrant.search('customer_services', {
      vector: embedding,
      limit: 10,
    });

    console.log('Raw searchResult:', searchResult);

    const retrievedContexts = searchResult.map(item => item.payload?.text).join('\n\n');

    console.log('Retrieved contexts:', retrievedContexts);

    // 3. Generate an answer using Cohere
    const generatedResponse = await cohere.generate({
      model: 'command', // Or any other preferred model
      prompt: `You are an assistant. Use only the provided context to answer the question as best you can. If the customer only greet to you without further informations just greet with them as well no need to answer other stuff.
If the retrieved context is not relevant to the question, don't use that context, if does not contain enough information just says For more information, please contact us info@parkguide.com.
      
Context:
${retrievedContexts}

Question: ${question}

Answer:`,
      max_tokens: 300,
      temperature: 0.7,
    });

    const generatedAnswer = generatedResponse.generations[0].text.trim();

    return NextResponse.json({
      answer: generatedAnswer,
      retrieved_contexts: retrievedContexts,
      top_matches: searchResult.length,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}

async function getEmbeddingFromLocalServer(text) {
  try {
    const response = await fetch('http://127.0.0.1:8000/embed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
      console.error('Local embed server error:', await response.text());
      return null;
    }

    const embedding = await response.json();
    console.log('embedding from local server:', embedding);
    return embedding;
  } catch (error) {
    console.error('Failed to fetch embedding from local server:', error);
    return null;
  }
}
