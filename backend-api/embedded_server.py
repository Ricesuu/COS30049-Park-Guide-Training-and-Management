#npm install concurrently --save-dev
#pip install fastapi uvicorn sentence-transformers

from sentence_transformers import SentenceTransformer
from fastapi import FastAPI, Request
import uvicorn

app = FastAPI()
model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")

@app.post("/embed")
async def embed(request: Request):
    body = await request.json()
    text = body.get("inputs")
    if not text:
        return {"error": "No inputs provided"}
    
    embeddings = model.encode(text, normalize_embeddings=True).tolist()
    return embeddings

# uvicorn.run(app, host="0.0.0.0", port=8000)