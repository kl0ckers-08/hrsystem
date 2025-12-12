import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Employee } from "@/models/hr2/admin/Employee";
import { authMiddleware } from "@/lib/auth";

export async function GET(req: Request) {
  await connectDB();

  const authResult = await authMiddleware(req as any);
  if (!authResult.authenticated) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  const employees = await Employee.find({}).lean();

  const totalEmployees = employees.length;
  const competent = employees.filter(e => e.status === 'Competent').length;
  const needsImprovement = employees.filter(e => e.status === 'Needs Improvement').length;
  const averageScore = totalEmployees
    ? Math.round(employees.reduce((acc, e) => acc + e.competencyScore, 0) / totalEmployees)
    : 0;
  const needsEvaluation = employees.filter(e => e.status === 'Not Yet Assessed').length;

  return NextResponse.json({
    stats: { totalEmployees, competent, needsImprovement, averageScore, needsEvaluation }
  });
}
