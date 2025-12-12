"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users, Briefcase, Clock, CheckCircle, AlertCircle } from "lucide-react";

// TYPES
interface ApplicantTrend {
    month: string;
    applications: number;
    hired: number;
}

interface DepartmentData {
    dept: string;
    completed: number;
}

interface TaskCompletion {
    name: string;
    value: number;
    fill: string;
}

interface Activity {
    type: "application" | "interview" | "review" | "onboarding";
    title: string;
    description: string;
    timeAgo: string;
}

// MAIN COMPONENT
export default function AdminDashboard() {
    const [applicantsTrend, setApplicantsTrend] = useState<ApplicantTrend[]>([]);
    const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);
    const [completionData, setCompletionData] = useState<TaskCompletion[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [stats, setStats] = useState<any>({
        totalApplications: 0,
        approvalRate: 0,
        openPositions: 0,
        avgResponseTime: 0,
        activeJobs: 0,
        interviewsScheduled: 0,
        pendingReview: 0,
        candidatesHired: 0,
        overallCompletion: 0,
        onboarded: 0,
        avgTimeToHire: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [trendRes, deptRes, completionRes, activitiesRes, statsRes] = await Promise.all([
                axios.get("/hr1/api/dashboard/applicantsTrend"),
                axios.get("/hr1/api/dashboard/departmentData"),
                axios.get("/hr1/api/dashboard/completionData"),
                axios.get("/hr1/api/dashboard/activities"),
                axios.get("/hr1/api/dashboard/stats"),
            ]);

            setApplicantsTrend(trendRes.data);
            setDepartmentData(deptRes.data);
            setCompletionData(completionRes.data);
            setActivities(activitiesRes.data);
            setStats(statsRes.data);

            setLoading(false);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setLoading(false);
        }
    };

    const StatCard = ({
        icon: Icon,
        label,
        value,
        change,
        bgColor,
    }: {
        icon: React.ComponentType<{ className: string }>;
        label: string;
        value: string;
        change: string;
        bgColor: string;
    }) => (
        <div className={`${bgColor} rounded-lg p-6 text-gray-900`}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm font-medium opacity-80">{label}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>
                <Icon className="w-6 h-6 opacity-60" />
            </div>
            <p className="text-xs opacity-70">{change}</p>
        </div>
    );

    if (loading)
        return <div className="p-10 text-center text-gray-500">Loading dashboard...</div>;

    const activityColor = (type: Activity["type"]) => {
        switch (type) {
            case "application":
                return { bg: "bg-blue-50", border: "border-blue-500", icon: "text-blue-600" };
            case "interview":
                return { bg: "bg-green-50", border: "border-green-500", icon: "text-green-600" };
            case "review":
            case "onboarding":
                return { bg: "bg-yellow-50", border: "border-yellow-500", icon: "text-yellow-600" };
            default:
                return { bg: "bg-gray-50", border: "border-gray-500", icon: "text-gray-600" };
        }
    };

    return (
        <div className="w-full bg-gray-50 p-8 max-h-screen overflow-y-scroll">
            <div className="w-full mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Track your recruitment and hiring metrics</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={Users}
                        label="Total Applications"
                        value={stats.totalApplications.toString()}
                        change={`↑ ${stats.applicationChange || 0}% from last month`}
                        bgColor="bg-purple-100"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Approval Rate"
                        value={`${stats.approvalRate}%`}
                        change={`↑ ${stats.approvalChange || 0}% from last month`}
                        bgColor="bg-blue-100"
                    />
                    <StatCard
                        icon={Briefcase}
                        label="Open Positions"
                        value={stats.openPositions.toString()}
                        change={`↓ ${stats.openPositionsChange || 0} positions filled`}
                        bgColor="bg-yellow-100"
                    />
                    <StatCard
                        icon={Clock}
                        label="Avg Response Time"
                        value={`${stats.avgResponseTime}h`}
                        change={`↓ ${stats.responseTimeChange || 0}h faster`}
                        bgColor="bg-pink-100"
                    />
                </div>

                {/* Second Row Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-green-100 rounded-lg p-6 text-gray-900">
                        <p className="text-sm font-medium opacity-80">Active Job Postings</p>
                        <p className="text-3xl font-bold mt-2">{stats.activeJobs}</p>
                        <p className="text-xs opacity-70 mt-3">See all jobs</p>
                    </div>
                    <div className="bg-purple-100 rounded-lg p-6 text-gray-900">
                        <p className="text-sm font-medium opacity-80">Interview Scheduled</p>
                        <p className="text-3xl font-bold mt-2">{stats.interviewsScheduled}</p>
                        <p className="text-xs opacity-70 mt-3">View list</p>
                    </div>
                    <div className="bg-red-100 rounded-lg p-6 text-gray-900">
                        <p className="text-sm font-medium opacity-80">Pending Review</p>
                        <p className="text-3xl font-bold mt-2">{stats.pendingReview}</p>
                        <p className="text-xs opacity-70 mt-3">Review now</p>
                    </div>
                    <div className="bg-green-100 rounded-lg p-6 text-gray-900">
                        <p className="text-sm font-medium opacity-80">Candidates Hired</p>
                        <p className="text-3xl font-bold mt-2">{stats.candidatesHired}%</p>
                        <p className="text-xs opacity-70 mt-3">View details</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications & Hiring Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={applicantsTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="applications" stroke="#8b5cf6" />
                                <Line type="monotone" dataKey="hired" stroke="#10b981" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Completion Rate</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={departmentData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="dept" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="completed" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm lg:col-span-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Completion Rate</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={completionData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}%`}
                                    outerRadius={80}
                                    dataKey="value"
                                >
                                    {completionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                        {activities.map((a, i) => {
                            const color = activityColor(a.type);
                            return (
                                <div key={i} className={`${color.bg} rounded-lg p-4 flex items-start gap-3 border-l-4 ${color.border}`}>
                                    {a.type === "review" || a.type === "onboarding" ? (
                                        <AlertCircle className={`w-5 h-5 ${color.icon} mt-1 flex-shrink-0`} />
                                    ) : (
                                        <CheckCircle className={`w-5 h-5 ${color.icon} mt-1 flex-shrink-0`} />
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-900">{a.title}</p>
                                        <p className="text-sm text-gray-600">{a.description}</p>
                                        <p className="text-xs text-gray-500 mt-1">{a.timeAgo}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-purple-100 rounded-lg p-6 text-gray-900">
                        <p className="text-sm font-medium opacity-80">Overall Completion</p>
                        <p className="text-4xl font-bold mt-4">{stats.overallCompletion}%</p>
                        <p className="text-xs opacity-70 mt-3">All recruitment processes</p>
                    </div>
                    <div className="bg-green-100 rounded-lg p-6 text-gray-900">
                        <p className="text-sm font-medium opacity-80">Candidates Onboarded</p>
                        <p className="text-4xl font-bold mt-4">{stats.onboarded}%</p>
                        <p className="text-xs opacity-70 mt-3">Successfully onboarded this quarter</p>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-6 text-gray-900">
                        <p className="text-sm font-medium opacity-80">Avg Time to Hire</p>
                        <p className="text-4xl font-bold mt-4">{stats.avgTimeToHire}d</p>
                        <p className="text-xs opacity-70 mt-3">Down from last quarter</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
