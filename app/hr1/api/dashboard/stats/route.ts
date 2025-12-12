import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Application } from '@/models/hr1/Applications';
import Job from '@/models/hr1/Job';
import Task from '@/models/hr2/admin/Task';

interface Stats {
    totalApplications: number;
    applicationChange: number;
    approvalRate: number;
    approvalChange: number;
    openPositions: number;
    openPositionsChange: number;
    avgResponseTime: number;
    responseTimeChange: number;
    activeJobs: number;
    interviewsScheduled: number;
    pendingReview: number;
    candidatesHired: number;
    overallCompletion: number;
    onboarded: number;
    avgTimeToHire: number;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Stats | { message: string }>
) {
    await connectDB();

    if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

    try {
        // Mock calculation, you can replace with real DB aggregation
        const totalApplications = await Task.countDocuments({});
        const completed = await Task.countDocuments({ status: 'completed' });
        const inProgress = await Task.countDocuments({ status: 'inProgress' });

        const stats: Stats = {
            totalApplications,
            applicationChange: 12,
            approvalRate: Math.floor((completed / totalApplications) * 100) || 0,
            approvalChange: 2,
            openPositions: 22,
            openPositionsChange: 3,
            avgResponseTime: 31.5,
            responseTimeChange: 5,
            activeJobs: 15,
            interviewsScheduled: 28,
            pendingReview: 14,
            candidatesHired: Math.floor((completed / totalApplications) * 100) || 0,
            overallCompletion: Math.floor((completed / totalApplications) * 100) || 0,
            onboarded: 92,
            avgTimeToHire: 28,
        };

        res.status(200).json(stats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}
