import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Application } from '@/models/hr1/Applications';
import Job from '@/models/hr1/Job';
import Task from '@/models/hr2/admin/Task';
import { verifyToken } from '@/lib/auth';

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

export async function GET(req: NextRequest) {
    try {
        // Auth check
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.slice(7)
            : req.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'No token provided' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload || (payload.role !== 'admin' && payload.role !== 'hr')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Get current month date range
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Application stats
        const totalApplications = await Application.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        const lastMonthApplications = await Application.countDocuments({
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
        });

        const applicationChange = lastMonthApplications
            ? Math.round(((totalApplications - lastMonthApplications) / lastMonthApplications) * 100)
            : 0;

        // Approval/Hired stats
        const hiredCount = await Application.countDocuments({
            status: 'hired',
            createdAt: { $gte: startOfMonth }
        });

        const approvalRate = totalApplications
            ? Math.round((hiredCount / totalApplications) * 100)
            : 0;

        const lastMonthHired = await Application.countDocuments({
            status: 'hired',
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
        });

        const lastMonthApprovalRate = lastMonthApplications
            ? Math.round((lastMonthHired / lastMonthApplications) * 100)
            : 0;

        const approvalChange = lastMonthApprovalRate
            ? approvalRate - lastMonthApprovalRate
            : 0;

        // Job stats
        const openPositions = await Job.countDocuments({
            status: 'open'
        });

        const activeJobs = await Job.countDocuments({
            status: { $in: ['open', 'active'] }
        });

        // Interview stats
        const interviewsScheduled = await Application.countDocuments({
            status: 'interview'
        });

        // Pending review
        const pendingReview = await Application.countDocuments({
            status: 'pending'
        });

        // Task completion stats
        const totalTasks = await Task.countDocuments({});
        const completedTasks = await Task.countDocuments({ status: 'completed' });
        const overallCompletion = totalTasks
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

        // Average time to hire (in days)
        const hiredApps = await Application.find({ status: 'hired' })
            .select('createdAt updatedAt')
            .lean();

        const avgTimeToHire = hiredApps.length
            ? Math.round(
                hiredApps.reduce((sum, app) => {
                    const days = Math.floor(
                        (new Date(app.updatedAt).getTime() - new Date(app.createdAt).getTime())
                        / (1000 * 60 * 60 * 24)
                    );
                    return sum + days;
                }, 0) / hiredApps.length
            )
            : 0;

        // Calculate average response time (mock for now)
        const avgResponseTime = 31.5;
        const responseTimeChange = 5;

        const stats: Stats = {
            totalApplications,
            applicationChange,
            approvalRate,
            approvalChange,
            openPositions,
            openPositionsChange: 3,
            avgResponseTime,
            responseTimeChange,
            activeJobs,
            interviewsScheduled,
            pendingReview,
            candidatesHired: hiredCount,
            overallCompletion,
            onboarded: 92,
            avgTimeToHire,
        };

        return NextResponse.json(stats);
    } catch (err) {
        console.error('Error calculating stats:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}