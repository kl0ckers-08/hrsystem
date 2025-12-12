import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import { authMiddleware } from "@/lib/auth";
import Competency from "@/models/hr2/admin/Competency";

// GET - Fetch all competency standards
export async function GET() {
  try {
    await connectDB();

    const standards = await Competency.find({})
      .select('role minimumLevel skills createdAt')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        standards: standards || [], // ← This line is critical
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('GET standards error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch standards',
        standards: [] // ← Always return array even on error
      },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { role, minimumLevel = 'Intermediate', skills } = body;

    // Validation
    if (!role?.trim()) {
      return NextResponse.json(
        { message: 'Role name is required' },
        { status: 400 }
      );
    }

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { message: 'At least one skill is required' },
        { status: 400 }
      );
    }

    // Check if role already exists
    const existing = await Competency.findOne({
      role: { $regex: new RegExp(`^${role.trim()}$`, 'i') }
    });
    if (existing) {
      return NextResponse.json(
        { message: 'A competency standard with this role already exists' },
        { status: 409 }
      );
    }

    // Create new standard
    const newStandard = await Competency.create({
      role: role.trim(),
      minimumLevel,
      skills: skills.map((s: string) => s.trim()),
    });

    return NextResponse.json(
      {
        message: 'Competency standard created successfully!',
        standard: newStandard
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Create standard error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}