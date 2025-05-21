import { NextResponse } from 'next/server';
import { getAllPlants } from '@/controllers/plantController';

export async function GET() {
  return getAllPlants();
}
