import { NextResponse } from 'next/server';
import * as ort from 'onnxruntime-node';
import sharp from 'sharp';
import path from 'path';
import { getConnection } from '@/lib/db';
import fs from 'fs';
const sessionCache = {};
//please download the vit model manually from drive and place it under models folder
//https://drive.google.com/file/d/1BgdLURYhet_IFlQ54JO5caTxJDRo8PP_/view?usp=drive_link
const CLASS_NAMES = [
  'Angraecum', 'Arundina graminifolia','Brassavola', 'Brassia', 'Cattleya', 'Coelogyne asperata','Cymbidium',
  'Dendrobium', 'Encyclia', 'Epidendrum', 'Lycaste', 'Masdevallia',
  'Maxillaria', 'Miltonia', 'Miltoniopsis', 'Odontoglossum', 'Oncidium',
  'Paphiopedilum', 'Phalaenopsis', 'Paphiopedilum stonei','Spathoglottis plicata','Vanda', 'Vanilla', 'Zygopetalum'
];

const connection = await getConnection();
const models = {
  mbn: path.join(process.cwd(), 'models/plant_model_mbn2.onnx'),
  rn: path.join(process.cwd(), 'models/plant_model_rn2.onnx'),
  vit: path.join(process.cwd(), 'models/plant_model_vit2.onnx')
};

async function loadSession(modelKey) {
  if (!models[modelKey]) throw new Error("Invalid model type");

  if (!sessionCache[modelKey]) {
    sessionCache[modelKey] = await ort.InferenceSession.create(models[modelKey]);
    console.log(`Model ${modelKey} loaded`);
  }

  return sessionCache[modelKey];
}
async function preprocessImage(base64Data) {
  const buffer = Buffer.from(base64Data, 'base64');
  const rawBuffer = await sharp(buffer)
    .resize(224, 224)
    .removeAlpha()
    .raw()
    .toBuffer();

  const floatArray = new Float32Array(rawBuffer.length);
  for (let i = 0; i < rawBuffer.length; i++) {
    floatArray[i] = rawBuffer[i] / 255.0;
  }

  const chwData = new Float32Array(3 * 224 * 224);
  for (let i = 0; i < 224 * 224; i++) {
    chwData[i] = floatArray[i * 3];
    chwData[224 * 224 + i] = floatArray[i * 3 + 1];
    chwData[2 * 224 * 224 + i] = floatArray[i * 3 + 2];
  }

  return new ort.Tensor('float32', chwData, [1, 3, 224, 224]);
}

function softmax(arr) {
  const max = Math.max(...arr);
  const exps = arr.map(x => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b);
  return exps.map(x => x / sum);
}

function getCorsHeaders() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return headers;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders()
  });
}

export async function GET(request) {
  const headers = getCorsHeaders();

  try {
    const { searchParams } = new URL(request.url);
    const scientificName = searchParams.get('scientific_name');

    if (!scientificName) {
      return new NextResponse(
        JSON.stringify({ error: "No scientific name provided" }),
        { status: 400, headers }
      );
    }

    const [rows] = await connection.query(
      'SELECT * FROM plants WHERE scientific_name = ? LIMIT 1', [scientificName]
    );

    return new NextResponse(
      JSON.stringify({
        plantInfo: rows.length > 0 ? rows[0] : null
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error("GET request error:", error);
    return new NextResponse(
      JSON.stringify({
        error: "GET request failed",
        details: error.message
      }),
      { status: 500, headers }
    );
  }
}

export async function POST(request) {
  const headers = getCorsHeaders();

  try {
    const body = await request.json();
    const { image, model } = body;

    if (!image) {
      return new NextResponse(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers }
      );
    }

    const modelKey = model || 'mbn';
    const session = await loadSession(modelKey);
    const tensor = await preprocessImage(image);

    const results = await session.run({ input: tensor });
    const output = results.output || results.output_0;

    const rawPredictions = Array.from(output.data);
    const probs = softmax(rawPredictions);

    const top_predictions = probs
      .map((prob, idx) => ({ label: CLASS_NAMES[idx], probability: prob }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3);


    const detailedPredictions = await Promise.all(

      top_predictions.map(async (item) => {
        const [rows] = await connection.query(
          'SELECT * FROM plants WHERE scientific_name = ? LIMIT 1', [item.label]
        );
        return {
          ...item,
          info: rows.length > 0 ? rows[0] : null
        };
      })
    );

    return new NextResponse(
      JSON.stringify({
        predictions: detailedPredictions
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error("Prediction error:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Prediction failed",
        details: error.message
      }),
      { status: 500, headers }
    );
  }
}

