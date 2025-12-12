"use client";

import React, { useState, useEffect } from 'react';
import { X, Users, Award, AlertTriangle, TrendingUp, Calendar, Loader2 } from 'lucide-react';

interface Employee {
  _id: string;
  name: string;
  department: string;
  role: string;
  competencyScore: number;
  skillProgress: number;
  overallProgress: number;
  lastAssessed: string | null;
  status: 'Competent' | 'Needs Improvement' | 'Not Yet Assessed' | 'Pending Assessment';
  skills?: { name: string; score: number }[];
  trainings?: { name: string; completedDate: string; score: number }[];
}

interface Standard {
  _id: string;
  role: string;
  minimumLevel: string;
  skills: string[];
}

interface Stats {
  totalEmployees: number;
  competent: number;
  needsImprovement: number;
  averageScore: number;
  needsEvaluation: number;
}

const CompetencyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showStandardModal, setShowStandardModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showCreateStandardModal, setShowCreateStandardModal] = useState(false);

  const [newStandard, setNewStandard] = useState({
    role: '',
    minimumLevel: 'Intermediate',
    skills: [] as string[]
  });

  const [skillInput, setSkillInput] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalEmployees: 0,
    competent: 0,
    needsImprovement: 0,
    averageScore: 0,
    needsEvaluation: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  setLoading(true);
  setError(null);
  const token = getAuthToken();

  if (!token) {
    setError('Not authenticated. Please login.');
    setLoading(false);
    return;
  }

  try {
    const [employeesRes, standardsRes, statsRes] = await Promise.all([
      fetch("/hr2/api/admin/employees", { credentials: 'include' }),
      fetch("/hr2/api/admin/standards", { credentials: 'include' }),
      fetch("/hr2/api/admin/stats", { credentials: 'include' })
    ]);

    if (!employeesRes.ok || !standardsRes.ok || !statsRes.ok) {
      throw new Error('Failed to fetch data');
    }

    const employeesData = await employeesRes.json();
    const standardsData = await standardsRes.json();
    const statsData = await statsRes.json();

    // THIS IS THE ONLY LINE THAT MATTERS
    setStandards(standardsData.standards ?? []); // ← NULLISH COALESCING FIX

    setEmployees(employeesData.employees ?? []);
    setStats(statsData.stats ?? {
      totalEmployees: 0,
      competent: 0,
      needsImprovement: 0,
      averageScore: 0,
      needsEvaluation: 0
    });
  } catch (err) {
    console.error('Fetch error:', err);
    setError(err instanceof Error ? err.message : 'An error occurred');
    // Make sure standards is always an array even on error
    setStandards([]);
  } finally {
    setLoading(false);
  }
};

  const topPerformers = [...employees]
    .filter(e => e.competencyScore > 0)
    .sort((a, b) => b.competencyScore - a.competencyScore)
    .slice(0, 3);

  const needsAttention = employees.filter(e => e.status === 'Needs Improvement');

  const calculateDepartmentSummary = () => {
    const depts = ['Computer Science', 'Information Technology', 'Information System'];
    return depts.map(dept => {
      const deptEmployees = employees.filter(e => e.department === dept);
      if (deptEmployees.length === 0) {
        return { name: dept, avg: 0, pending: true };
      }
      const avg = Math.round(
        deptEmployees.reduce((acc, e) => acc + e.competencyScore, 0) / deptEmployees.length
      );
      return { name: dept, avg, pending: avg === 0 };
    });
  };

  const departmentSummary = calculateDepartmentSummary();

  const openEmployeeModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
  };

  const openStandardModal = (standard: Standard) => {
    setSelectedStandard(standard);
    setShowStandardModal(true);
  };

  const openAssessmentModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowAssessmentModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Competency Management (Admin)</h1>
        <p className="text-gray-600 mt-1">Manage employee competencies and standards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-purple-600">Total Employees</span>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-purple-900">{stats.totalEmployees}</div>
          <div className="text-xs text-purple-600 mt-1">in system</div>
        </div>

        <div className="bg-green-50 rounded-lg p-6 border border-green-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-600">Competent</span>
            <Award className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-900">{stats.competent}</div>
          <div className="text-xs text-green-600 mt-1">meet standards</div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-yellow-600">Needs Improvement</span>
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-yellow-900">{stats.needsImprovement}</div>
          <div className="text-xs text-yellow-600 mt-1">require training</div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-600">Average Score</span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-blue-900">{stats.averageScore}%</div>
          <div className="text-xs text-blue-600 mt-1">organization-wide</div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-orange-600">Competency Evaluation</span>
            <Calendar className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-orange-900">{stats.needsEvaluation}</div>
          <div className="text-xs text-orange-600 mt-1">need evaluation</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b overflow-x-auto">
          {['overview', 'employees assessment', 'competency standards', 'pending assessments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium capitalize transition-colors whitespace-nowrap ${activeTab === tab
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {tab.replace(/([A-Z])/g, ' $1')}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-4">Top Performers</h3>
                <div className="space-y-3">
                  {topPerformers.length > 0 ? (
                    topPerformers.map((emp) => (
                      <div
                        key={emp._id}
                        className="bg-white rounded-lg p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => openEmployeeModal(emp)}
                      >
                        <div>
                          <div className="font-medium text-gray-900">{emp.name}</div>
                          <div className="text-sm text-gray-600">{emp.role}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{emp.competencyScore}%</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No top performers yet</p>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4">Needs Attention</h3>
                <div className="space-y-3">
                  {needsAttention.length > 0 ? (
                    needsAttention.map((emp) => (
                      <div
                        key={emp._id}
                        className="bg-white rounded-lg p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => openEmployeeModal(emp)}
                      >
                        <div>
                          <div className="font-medium text-gray-900">{emp.name}</div>
                          <div className="text-sm text-gray-600">{emp.role}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-yellow-600">{emp.competencyScore}%</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No employees need attention</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Not Yet Assessed</h3>
                <div className="space-y-3">
                  {employees.filter(e => e.status === 'Not Yet Assessed').length > 0 ? (
                    employees.filter(e => e.status === 'Not Yet Assessed').map((emp) => (
                      <div
                        key={emp._id}
                        className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => openEmployeeModal(emp)}
                      >
                        <div className="font-medium text-gray-900">{emp.name}</div>
                        <div className="text-sm text-gray-600">{emp.role} • {emp.department}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">All employees assessed</p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Department Summary</h3>
                <div className="space-y-4">
                  {departmentSummary.map((dept, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                        <span className="text-sm font-bold text-blue-600">
                          {dept.pending ? 'N/A' : `Avg: ${dept.avg}%`}
                        </span>
                      </div>
                      {!dept.pending && (
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${dept.avg}%` }}></div>
                        </div>
                      )}
                      {dept.pending && <div className="text-xs text-gray-500">0% (Pending)</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'employees assessment' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="w-full sm:w-80 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />

                <div className="flex gap-3 flex-wrap">
                  <select className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>All Departments</option>
                    <option>Computer Science</option>
                    <option>Information Technology</option>
                    <option>Information System</option>
                  </select>

                  <select className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>All Statuses</option>
                    <option>Competent</option>
                    <option>Needs Improvement</option>
                    <option>Not Yet Assessed</option>
                  </select>

                  <select className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>All Roles</option>
                    <option>Lecturer</option>
                    <option>Instructor</option>
                    <option>Laboratory Facilitator</option>
                  </select>
                </div>
              </div>

              {/* Employee Cards - Exact Match to Your Image */}
              <div className="space-y-4">
                {employees.length > 0 ? (
                  employees.map((emp) => (
                    <div
                      key={emp._id}
                      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => openEmployeeModal(emp)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-900">{emp.name}</h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${emp.status === 'Competent'
                                ? 'bg-green-100 text-green-700'
                                : emp.status === 'Needs Improvement'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                                }`}
                            >
                              {emp.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {emp.role} • {emp.department}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openAssessmentModal(emp);
                          }}
                          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                          View Training
                        </button>
                      </div>

                      {/* Metrics Row */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        <div>
                          <p className="text-gray-500 mb-1">Competency Score</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-600 h-2 rounded-full transition-all"
                                style={{ width: `${emp.competencyScore}%` }}
                              />
                            </div>
                            <span className="font-medium text-gray-900 w-12 text-right">
                              {emp.competencyScore}%
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-500 mb-1">Skill Progress</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${emp.skillProgress}%` }}
                              />
                            </div>
                            <span className="font-medium text-gray-900 w-12 text-right">
                              {emp.skillProgress}%
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-500 mb-1">Last Assessed</p>
                          <p className="font-medium text-gray-900">
                            {emp.lastAssessed
                              ? new Date(emp.lastAssessed).toLocaleDateString('en-GB', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }).replace(/ /g, '-')
                              : 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Overall Progress Bar - Full Width */}
                      <div className="mt-5">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500">Overall Progress</span>
                          <span className="font-semibold text-gray-900">{emp.overallProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-purple-600 h-3 rounded-full transition-all duration-700"
                            style={{ width: `${emp.overallProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No employees found matching the current filters.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'competency standards' && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowCreateStandardModal(true)}
                  className="px-5 py-3 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-all shadow-md flex items-center gap-2"
                >
                  + Create Standard
                </button>
              </div>
              <div className="space-y-4">
  {Array.isArray(standards) && standards.length > 0 ? (
    standards.map((standard) => (
      <div
        key={standard._id}
        className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => openStandardModal(standard)}
      >
        {/* your card content */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{standard.role}</h3>
            <p className="text-sm text-gray-600 mt-1">Minimum Level: {standard.minimumLevel}</p>
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Required Skills:</div>
              <div className="flex flex-wrap gap-2">
                {(standard.skills || []).map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-gray-500 text-center py-8">No standards found</p>
  )}
</div>
            </div>
          )}

          {activeTab === 'pending assessments' && (
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Assessments</h3>
              <div className="space-y-3">
                {employees.filter(e => e.status === 'Not Yet Assessed').length > 0 ? (
                  employees.filter(e => e.status === 'Not Yet Assessed').map((emp) => (
                    <div
                      key={emp._id}
                      className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{emp.name}</div>
                        <div className="text-sm text-gray-600">{emp.role} • {emp.department}</div>
                      </div>
                      <button
                        onClick={() => openAssessmentModal(emp)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                      >
                        Initiate Assessment
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No pending assessments</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'evaluation' && (
            <div>
              <div className="space-y-4">
                {employees.length > 0 ? (
                  employees.map((emp) => (
                    <div
                      key={emp._id}
                      className="bg-white rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{emp.name}</div>
                          <div className="text-sm text-gray-600">{emp.role} • {emp.department}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {emp.status === 'Not Yet Assessed' ? 'N/A' : emp.lastAssessed ? new Date(emp.lastAssessed).toLocaleDateString() : 'N/A'}
                          </span>
                          <button
                            onClick={() => openEmployeeModal(emp)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No employees found</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showEmployeeModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Employee Details</h2>
              <button
                onClick={() => setShowEmployeeModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-6 text-white mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedEmployee.name}</h3>
                    <p className="text-purple-100 mt-1">{selectedEmployee.role}</p>
                    <p className="text-purple-100">{selectedEmployee.department}</p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${selectedEmployee.status === 'Competent'
                      ? 'bg-green-500 text-white'
                      : selectedEmployee.status === 'Needs Improvement'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-500 text-white'
                      }`}
                  >
                    {selectedEmployee.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-sm text-purple-600 mb-1">Competency Score</div>
                  <div className="text-3xl font-bold text-purple-900">{selectedEmployee.competencyScore}%</div>
                  <div className="mt-2 bg-purple-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${selectedEmployee.competencyScore}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-blue-600 mb-1">Skill Progress</div>
                  <div className="text-3xl font-bold text-blue-900">{selectedEmployee.skillProgress}%</div>
                  <div className="mt-2 bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${selectedEmployee.skillProgress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-green-600 mb-1">Overall Progress</div>
                  <div className="text-3xl font-bold text-green-900">{selectedEmployee.overallProgress}%</div>
                  <div className="mt-2 bg-green-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${selectedEmployee.overallProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Last Assessed</div>
                  <div className="text-lg text-gray-900">
                    {selectedEmployee.lastAssessed ? new Date(selectedEmployee.lastAssessed).toLocaleDateString() : 'Never assessed'}
                  </div>
                </div>

                {selectedEmployee.skills && selectedEmployee.skills.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-700 mb-3">Skills Breakdown</div>
                    <div className="space-y-3">
                      {selectedEmployee.skills.map((skill, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700">{skill.name}</span>
                            <span className="font-medium text-gray-900">{skill.score}%</span>
                          </div>
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${skill.score}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedEmployee.trainings && selectedEmployee.trainings.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-700 mb-3">Recent Training</div>
                    <div className="space-y-2">
                      {selectedEmployee.trainings.map((training, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">{training.name}</span>
                          <span className="text-gray-500">
                            Completed: {new Date(training.completedDate).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 mt-6">
                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Schedule Assessment
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                  View Full History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showStandardModal && selectedStandard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Competency Standard</h2>
              <button
                onClick={() => setShowStandardModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-purple-50 rounded-lg p-6 mb-6">
                <h3 className="text-2xl font-bold text-purple-900 mb-2">{selectedStandard.role}</h3>
                <p className="text-purple-700">
                  Minimum Level: <span className="font-semibold">{selectedStandard.minimumLevel}</span>
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h4>
                  <div className="space-y-2">
                    {selectedStandard.skills.map((skill, idx) => (
                      <div key={idx} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                        <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </div>
                        <span className="text-gray-900">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Edit Standard
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                  View Employees
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* CREATE NEW COMPETENCY STANDARD MODAL */}
      {/* CREATE NEW COMPETENCY STANDARD MODAL - FULLY DYNAMIC */}
      {showCreateStandardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Create New Competency Standard</h2>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newStandard.role.trim()) return;

                try {
                  const response = await fetch('/hr2/api/admin/standards', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      role: newStandard.role.trim(),
                      minimumLevel: newStandard.minimumLevel,
                      skills: newStandard.skills,
                    }),
                  });

                  if (!response.ok) {
                    const error = await response.json().catch(() => ({}));
                    throw new Error(error.message || 'Failed to create standard');
                  }

                  await response.json();
                  setShowCreateStandardModal(false);
                  setNewStandard({ role: '', minimumLevel: 'Intermediate', skills: [] });
                  setSkillInput('');
                  fetchData(); // Refresh list
                } catch (err: any) {
                  console.error(err);
                  alert(err.message || 'Failed to create standard');
                }
              }}
              className="p-6 space-y-6"
            >
              {/* Role Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newStandard.role}
                  onChange={(e) => setNewStandard({ ...newStandard, role: e.target.value })}
                  placeholder="e.g. Senior Lecturer"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Minimum Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Competency Level
                </label>
                <select
                  value={newStandard.minimumLevel}
                  onChange={(e) => setNewStandard({ ...newStandard, minimumLevel: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Expert</option>
                </select>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (skillInput.trim() && !newStandard.skills.includes(skillInput.trim())) {
                          setNewStandard({
                            ...newStandard,
                            skills: [...newStandard.skills, skillInput.trim()],
                          });
                          setSkillInput('');
                        }
                      }
                    }}
                    placeholder="Type skill and press Enter"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button" // ← FIXED: Prevent form submit
                    onClick={() => {
                      if (skillInput.trim() && !newStandard.skills.includes(skillInput.trim())) {
                        setNewStandard({
                          ...newStandard,
                          skills: [...newStandard.skills, skillInput.trim()],
                        });
                        setSkillInput('');
                      }
                    }}
                    className="px-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                {/* Skill Tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {newStandard.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium"
                    >
                      {skill}
                      <button
                        type="button" // ← CRITICAL FIX: Was type="submit" before!
                        onClick={() =>
                          setNewStandard({
                            ...newStandard,
                            skills: newStandard.skills.filter((_, i) => i !== index),
                          })
                        }
                        className="hover:text-purple-900 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {newStandard.skills.length === 0 && (
                    <p className="text-sm text-gray-400 mt-2">No skills added yet</p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button" // ← Also fixed
                  onClick={() => {
                    setShowCreateStandardModal(false);
                    setNewStandard({ role: '', minimumLevel: 'Intermediate', skills: [] });
                    setSkillInput('');
                  }}
                  className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newStandard.role.trim()}
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed font-medium shadow-md"
                >
                  Create Standard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssessmentModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Training & Assessment</h2>
              <button
                onClick={() => setShowAssessmentModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-blue-900 mb-1">{selectedEmployee.name}</h3>
                <p className="text-blue-700">{selectedEmployee.role} • {selectedEmployee.department}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Assessment Status</h4>
                  {selectedEmployee.status === 'Not Yet Assessed' ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                      <p className="text-yellow-800">No assessments scheduled yet</p>
                      <button className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors">
                        Schedule First Assessment
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-green-900">Latest Assessment</div>
                            <div className="text-sm text-green-700 mt-1">
                              Completed on {selectedEmployee.lastAssessed ? new Date(selectedEmployee.lastAssessed).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                            Completed
                          </span>
                        </div>
                        <div className="mt-3 text-sm text-green-800">
                          Overall Score: {selectedEmployee.competencyScore}%
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Training History</h4>
                  {selectedEmployee.trainings && selectedEmployee.trainings.length > 0 ? (
                    <div className="space-y-2">
                      {selectedEmployee.trainings.map((training, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gray-900">{training.name}</div>
                            <div className="text-sm text-gray-600">
                              Completed: {new Date(training.completedDate).toLocaleDateString()}
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">{training.score}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-600">
                      No training completed yet
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Add Training
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Initiate Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default CompetencyDashboard;

