import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Employee } from "@/models/hr2/admin/Employee";
import { authMiddleware } from "@/lib/auth";

export async function GET(req: Request) {
  await connectDB();

  // Use your auth utility
  const authResult = await authMiddleware(req as any);
  if (!authResult.authenticated) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  const employees = await Employee.find({}).lean();
  return NextResponse.json({ employees });
}
