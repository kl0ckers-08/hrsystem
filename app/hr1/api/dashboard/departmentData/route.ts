import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Department from '@/models/hr2/admin/Department';

interface DepartmentData {
  dept: string;
  completed: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DepartmentData[] | { message: string }>
) {
  await connectDB();

  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const departments = await Department.find({}).lean();
    const formatted: DepartmentData[] = departments.map(d => ({
      dept: d.name,
      completed: d.completionRate || 0,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}