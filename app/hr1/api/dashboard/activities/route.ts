import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Activity from '@/models/hr2/admin/Activity';
import { NextRequest , NextResponse } from 'next/server';

interface ActivityData {
  type: 'application' | 'interview' | 'review';
  title: string;
  description: string;
  timeAgo: string;
}

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const activities = await Activity.find({})
      .sort({ createdAt: -1 })
      .limit(10);

    const data: ActivityData[] = activities.map(a => ({
      type: a.type,
      title: a.title,
      description: a.description,
      timeAgo: `${Math.floor((Date.now() - a.createdAt.getTime()) / (1000 * 60 * 60))}h ago`,
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
