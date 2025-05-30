import { NextResponse } from 'next/server';
import { getAllPlants, createPlant } from '@/controllers/plantController';

// GET all plants
export async function GET() {
  return getAllPlants();
}

// POST create a new plant
export async function POST(req) {
  return createPlant(req);
}
