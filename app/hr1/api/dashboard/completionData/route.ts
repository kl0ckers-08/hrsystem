import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import Task from '@/models/hr2/admin/Task';

interface TaskCompletion {
  name: string;
  value: number;
  fill: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TaskCompletion[] | { message: string }>
) {
  await connectDB();

  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const totalTasks = await Task.countDocuments({});
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    const inProgressTasks = await Task.countDocuments({ status: 'inProgress' });
    const pendingTasks = await Task.countDocuments({ status: 'pending' });

    const data: TaskCompletion[] = [
      { name: 'Completed', value: completedTasks / totalTasks * 100 || 0, fill: '#10b981' },
      { name: 'In Progress', value: inProgressTasks / totalTasks * 100 || 0, fill: '#f59e0b' },
      { name: 'Pending', value: pendingTasks / totalTasks * 100 || 0, fill: '#ef4444' },
    ];

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
