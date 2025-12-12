import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import { Application } from "@/models/hr1/Applications";

interface ApplicantTrend {
  month: string;
  applications: number;
  hired: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApplicantTrend[] | { message: string }>
) {
  await connectDB();

  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  try {
    // Example aggregation: group tasks by month and count applications and hires
    const data = await Application.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          applications: { $sum: 1 },
          hired: { $sum: { $cond: [{ $eq: ['$status', 'hired'] }, 1, 0] } },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    const formatted: ApplicantTrend[] = data.map(d => ({
      month: `Month ${d._id}`,
      applications: d.applications,
      hired: d.hired,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}