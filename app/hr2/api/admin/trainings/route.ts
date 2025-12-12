import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Training } from "@/models/hr2/admin/Training";
import { authMiddleware } from "@/lib/auth";

// GET all trainings
export async function GET(req: Request) {
  await connectDB();
  const authResult = await authMiddleware(req as any);
  if (!authResult.authenticated) return NextResponse.json({ error: authResult.error }, { status: 401 });

  const trainings = await Training.find({}).sort({ date: 1 }).lean();
  return NextResponse.json(trainings);
}

// POST create new training
export async function POST(req: Request) {
  await connectDB();
  const authResult = await authMiddleware(req as any);
  if (!authResult.authenticated) return NextResponse.json({ error: authResult.error }, { status: 401 });

  const body = await req.json();
  const newTraining = await Training.create(body);
  return NextResponse.json(newTraining);
}

// PUT update a training
export async function PUT(req: Request) {
  await connectDB();
  const authResult = await authMiddleware(req as any);
  if (!authResult.authenticated) return NextResponse.json({ error: authResult.error }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
  const updated = await Training.findByIdAndUpdate(id, data, { new: true }).lean();
  return NextResponse.json(updated);
}

// DELETE training
export async function DELETE(req: Request) {
  await connectDB();
  const authResult = await authMiddleware(req as any);
  if (!authResult.authenticated) return NextResponse.json({ error: authResult.error }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await Training.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
