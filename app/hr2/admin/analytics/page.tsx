"use client";

import React, { useEffect, useState } from "react";
import { Award, BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Types
interface Stats {
  avgCompetency: number;
  learningHours: number;
  trainingsCompleted: number;
  skillGrowth: number;
}

interface Competency {
  skill: string;
  percentage: number;
}

interface LearningProgress {
  month: string;
  completed: number;
  inProgress: number;
}

interface TrainingDistribution {
  type: string;
  percentage: number;
}

// Colors
const COLORS = ["#6366f1", "#8b5cf6", "#14b8a6"];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [learningProgress, setLearningProgress] = useState<LearningProgress[]>([]);
  const [trainingDistribution, setTrainingDistribution] = useState<TrainingDistribution[]>([]);
  const [departmentCompetency, setDepartmentCompetency] = useState<{ dept: string; avg: number }[]>([]);

  // Fetch all analytics data
  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, compRes, progressRes, distRes, deptRes] = await Promise.all([
          fetch("/hr2/api/admin/stats", { credentials: "include" }),
          fetch("/hr2/api/admin/competencies", { credentials: "include" }),
          fetch("/hr2/api/admin/learning-progress", { credentials: "include" }),
          fetch("/hr2/api/admin/training-distribution", { credentials: "include" }),
          fetch("/hr2/api/admin/department-competency", { credentials: "include" }),
        ]);

        setStats(await statsRes.json());
        setCompetencies(await compRes.json());
        setLearningProgress(await progressRes.json());
        setTrainingDistribution(await distRes.json());
        setDepartmentCompetency(await deptRes.json());
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
      }
    }

    fetchData();
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-scroll">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Comprehensive performance and competency analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card color="purple" label="Avg Competency" value={`${stats.avgCompetency}%`} Icon={Award} />
        <Card color="blue" label="Learning Hours" value={stats.learningHours} Icon={BookOpen} />
        <Card color="green" label="Trainings Completed" value={stats.trainingsCompleted} Icon={GraduationCap} />
        <Card color="amber" label="Skill Growth" value={`${stats.skillGrowth}%`} Icon={TrendingUp} />
      </div>

      {/* Competency & Learning Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competency Levels */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Competency Levels by Skill</h3>
          <div className="space-y-4">
            {competencies.map((c) => (
              <div key={c.skill} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 font-medium">{c.skill}</span>
                  <span className="text-gray-600">{c.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-8 rounded-full flex items-center justify-end pr-3"
                    style={{ width: `${c.percentage}%` }}
                  >
                    <span className="text-white text-xs font-semibold">{c.percentage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Progress Over Time */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Learning Progress Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={learningProgress}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="#10b981" />
              <Line type="monotone" dataKey="inProgress" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Training Distribution & Department Competency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Training Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Training Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={trainingDistribution}
                dataKey="percentage"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {trainingDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department Competency Comparison */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Department Competency Comparison</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={departmentCompetency}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="dept" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Reusable Card Component
function Card({ color, label, value, Icon }: { color: string; label: string; value: string | number; Icon: any }) {
  const fromColor = `from-${color}-50`;
  const toColor = `to-${color}-100`;
  const borderColor = `border-${color}-200`;
  const textColor = `text-${color}-900`;
  const labelColor = `text-${color}-700`;
  const iconColor = `text-${color}-600`;

  return (
    <div className={`bg-gradient-to-br ${fromColor} ${toColor} p-6 rounded-xl border ${borderColor}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className={`text-sm font-medium ${labelColor}`}>{label}</p>
          <p className={`text-3xl font-bold mt-1 ${textColor}`}>{value}</p>
        </div>
        <Icon className={iconColor} size={24} />
      </div>
    </div>
  );
}
