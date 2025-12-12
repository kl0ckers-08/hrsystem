import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Activity from '@/models/hr2/admin/Activity';

interface ActivityResponse {
  type: 'application' | 'interview' | 'review';
  title: string;
  description: string;
  timeAgo: string;
}

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const departments = await Department.find({});
    const data: DepartmentData[] = departments.map(d => ({
      dept: d.name,
      completed: d.completionRate, // assuming your Department model has completionRate
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
