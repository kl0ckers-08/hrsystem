import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Request as RequestModel } from "@/models/hr2/admin/ess/request";
import { authMiddleware } from "@/lib/auth";

export async function GET(req: Request) {
  await connectDB();

  // Verify user authentication
  const authResult = await authMiddleware(req as any);
  if (!authResult.authenticated) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    // Fetch all requests from DB
    const requests = await RequestModel.find({}).sort({ submitted: -1 }).lean();
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}
