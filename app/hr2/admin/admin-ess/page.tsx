"use client";

import React, { useEffect, useState } from "react";
import { Clock, CheckCircle, FileText, Calendar } from "lucide-react";
import StatCard from "@/components/ui/statcard";

// Types
interface Request {
    _id: string;
    name: string;
    role: string;
    type: string;
    reason: string;
    status: "Approved" | "Pending" | "Rejected";
    submitted: string;
    processed?: string;
}

export default function ESSPage() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch requests from API
    useEffect(() => {
        async function fetchRequests() {
            try {
                const res = await fetch("/hr2/api/admin/requests", { credentials: "include" });
                const data = await res.json();
                setRequests(data);
            } catch (err) {
                console.error("Failed to fetch requests:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchRequests();
    }, []);

    // Stats calculation
    const totalRequests = requests.length;
    const pendingRequests = requests.filter((r) => r.status === "Pending").length;
    const approvedRequests = requests.filter((r) => r.status === "Approved").length;

    if (loading) return <p className="p-6">Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800">ESS - Employee Self-Service</h1>
                <p className="text-gray-600 mb-8">Track and manage employee HR2 requests</p>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Total Requests" value={totalRequests} subtitle="all time" icon={<FileText />} color="purple" />
                    <StatCard title="Pending Requests" value={pendingRequests} subtitle="awaiting review" icon={<Clock />} color="yellow" />
                    <StatCard title="Approved" value={approvedRequests} subtitle="completed requests" icon={<CheckCircle />} color="green" />
                </div>

                {/* Requests List */}
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <div className="flex justify-between items-center mb-6">
                        <input
                            type="text"
                            placeholder="Search requests..."
                            className="px-4 py-3 border rounded-xl w-80"
                            onChange={(e) => {
                                const search = e.target.value.toLowerCase();
                                setRequests((prev) =>
                                    prev.filter((r) => r.name.toLowerCase().includes(search) || r.type.toLowerCase().includes(search))
                                );
                            }}
                        />
                        <div className="flex gap-3">
                            <select
                                className="px-4 py-3 border rounded-xl"
                                onChange={(e) => {
                                    const status = e.target.value;
                                    setRequests((prev) =>
                                        status === "All" ? prev : prev.filter((r) => r.status === status)
                                    );
                                }}
                            >
                                <option value="All">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                            </select>
                            <select className="px-4 py-3 border rounded-xl">
                                <option>All Request Types</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {requests.map((req) => (
                            <div key={req._id} className="border rounded-2xl p-6 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg flex items-center gap-3">
                                            {req.name}
                                            <span
                                                className={`px-3 py-1 text-xs rounded-full ${req.status === "Approved"
                                                        ? "bg-green-100 text-green-700"
                                                        : req.status === "Pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {req.status}
                                            </span>
                                        </h3>
                                        <p className="text-gray-600">{req.role}</p>
                                        <p className="text-purple-600 text-sm font-medium mt-2">{req.type}</p>
                                        <p className="text-gray-600 text-sm mt-1">{req.reason}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>Submission Date: {req.submitted}</span>
                                    </div>
                                    {req.processed && (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <CheckCircle className="w-4 h-4" />
                                            Processed: {req.processed}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
