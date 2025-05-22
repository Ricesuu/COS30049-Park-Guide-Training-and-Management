import { NextResponse } from 'next/server';
import { getPlantById, updatePlant, deletePlant } from '@/controllers/plantController';

// GET a specific plant by ID
export async function GET(req, { params }) {
  const id = params.id;
  return getPlantById(id);
}

// PUT/PATCH update a plant
export async function PUT(req, { params }) {
  const id = params.id;
  return updatePlant(req, id);
}

export async function PATCH(req, { params }) {
  const id = params.id;
  return updatePlant(req, id);
}

// DELETE a plant
export async function DELETE(req, { params }) {
  const id = params.id;
  return deletePlant(id);
}
