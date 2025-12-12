'use client';

import { useState } from 'react';
import Modal from '../Modal';

export default function LearningPage() {
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const modules = [
    {
      id: 1,
      title: 'AI Fundamentals',
      description: 'Introduction to Artificial Intelligence and Machine Learning',
      topics: '6 topics',
      hours: '8 hours',
      category: 'Technical',
      status: 'completed',
      progress: 100,
      quizScore: 90
    },
    {
      id: 2,
      title: 'Advanced Data Analytics',
      description: 'Deep dive into data analysis techniques and visualization',
      topics: '8 topics',
      hours: '6 hours',
      category: 'Technical',
      status: 'in-progress',
      progress: 60
    },
    {
      id: 3,
      title: 'Teaching Excellence',
      description: 'Modern teaching methodologies and student engagement',
      topics: '8 topics',
      hours: '5 hours',
      category: 'Pedagogy',
      status: 'available',
      progress: 0
    },
    {
      id: 4,
      title: 'Research Methodology',
      description: 'Comprehensive guide to academic research and publication',
      topics: '5 topics',
      hours: '4 hours',
      category: 'Pedagogy',
      status: 'available',
      progress: 0
    }
  ];

  const filteredModules = filterStatus === 'all' 
    ? modules 
    : modules.filter(m => m.status === filterStatus);

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
      'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' },
      available: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Available' }
    };
    const badge = badges[status as keyof typeof badges];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Total Modules</span>
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">4</div>
          <div className="text-sm text-gray-600">Available Courses</div>
        </div>

        <div className="bg-green-50 rounded-lg p-6 border border-green-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Completed</span>
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">1</div>
          <div className="text-sm text-gray-600">Modules Finished</div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">In Progress</span>
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">1</div>
          <div className="text-sm text-gray-600">Currently Learning</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative flex-1 w-full">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search learning modules..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="flex gap-2">
            <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white">
              <option>All Modules</option>
              <option>Technical</option>
              <option>Pedagogy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 p-4">
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Modules' },
              { id: 'completed', label: 'Completed' },
              { id: 'in-progress', label: 'In Progress' },
              { id: 'available', label: 'Available' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Modules</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredModules.map((module) => (
              <div
                key={module.id}
                className="border border-gray-200 rounded-lg p-5 hover:border-indigo-300 transition-colors cursor-pointer"
                onClick={() => setSelectedModule(module)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{module.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{module.topics}</span>
                      <span>•</span>
                      <span>{module.hours}</span>
                      <span>•</span>
                      <span>{module.category}</span>
                    </div>
                  </div>
                  {getStatusBadge(module.status)}
                </div>

                {module.progress > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">{module.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          module.status === 'completed' ? 'bg-green-600' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {module.status === 'completed' && module.quizScore && (
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600">Quiz Score: <span className="font-semibold text-gray-900">{module.quizScore}%</span></span>
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedModule(module);
                  }}
                  className={`w-full mt-4 px-4 py-2 rounded-lg font-medium transition-colors ${
                    module.status === 'completed'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : module.status === 'in-progress'
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {module.status === 'completed' ? 'Retake Quiz' : module.status === 'in-progress' ? 'Continue Learning' : 'Start Module'}
                </button>
              </div>
            ))}
          </div>

          {filteredModules.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-gray-600">No modules found for this filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Module Detail Modal */}
      {selectedModule && (
        <Modal
          isOpen={!!selectedModule}
          onClose={() => setSelectedModule(null)}
          title={selectedModule.title}
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <p className="text-gray-600 mb-4">{selectedModule.description}</p>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>{selectedModule.topics}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{selectedModule.hours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>{selectedModule.category}</span>
                </div>
              </div>
            </div>

            {selectedModule.progress > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Your Progress</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedModule.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      selectedModule.status === 'completed' ? 'bg-green-600' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${selectedModule.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Course Contents</h4>
              <div className="space-y-2">
                {[
                  'Introduction and Overview',
                  'Core Concepts and Principles',
                  'Practical Applications',
                  'Advanced Topics',
                  'Case Studies',
                  'Final Assessment'
                ].map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        selectedModule.progress >= ((index + 1) * 100 / 6)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-900">{topic}</span>
                    </div>
                    {selectedModule.progress >= ((index + 1) * 100 / 6) && (
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedModule(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  console.log('Starting module:', selectedModule.title);
                  setSelectedModule(null);
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {selectedModule.status === 'completed' ? 'Review Module' : selectedModule.status === 'in-progress' ? 'Continue Learning' : 'Start Learning'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}