import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { Application } from "@/models/hr1/Applications";
import { verifyToken } from "@/lib/auth";

interface ApplicantTrend {
  month: string;
  applications: number;
  hired: number;
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApplicantTrend[] | { message: string }>
) {
  // Auth check
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const payload = verifyToken(token);
  if (!payload || (payload.role !== 'admin' && payload.role !== 'hr')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await connectDB();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get data for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const data = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          applications: { $sum: 1 },
          hired: { 
            $sum: { 
              $cond: [{ $eq: ['$status', 'hired'] }, 1, 0] 
            } 
          },
        },
      },
      { 
        $sort: { 
          '_id.year': 1, 
          '_id.month': 1 
        } 
      },
    ]);

    const formatted: ApplicantTrend[] = data.map(d => ({
      month: MONTH_NAMES[d._id.month - 1],
      applications: d.applications,
      hired: d.hired,
    }));

    // Fill in missing months with zero data
    const result: ApplicantTrend[] = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = MONTH_NAMES[date.getMonth()];
      
      const existing = formatted.find(f => f.month === monthName);
      
      result.push(existing || {
        month: monthName,
        applications: 0,
        hired: 0
      });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching applicants trend:', err);
    res.status(500).json({ message: 'Server error' });
  }
}