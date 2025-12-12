'use client';

import { useState } from 'react';
import Modal, { ConfirmModal } from '../Modal';

export default function TrainingPage() {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [selectedTraining, setSelectedTraining] = useState<any>(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [trainingToCancel, setTrainingToCancel] = useState<any>(null);

    const upcomingTrainings = [
        {
            id: 1,
            title: 'Teaching Excellence Workshop',
            description: 'Interactive workshop on modern teaching methodologies',
            date: '2025-11-08',
            time: '9:00 AM - 4:00 PM',
            location: 'Room 301',
            facilitator: 'Dr. Sarah Williams',
            slots: { available: 15, total: 30 },
            registered: false
        },
        {
            id: 2,
            title: 'AI in Education Seminar',
            description: 'Exploring AI applications in educational settings',
            date: '2025-11-20',
            time: '2:00 PM - 5:00 PM',
            location: 'Auditorium',
            facilitator: 'Prof. Michael Chen',
            slots: { available: 30, total: 50 },
            registered: false
        }
    ];

    const registeredTrainings = [
        {
            id: 3,
            title: 'Data Analytics Workshop',
            description: 'Hands-on session on data analysis techniques',
            date: '2025-11-25',
            time: '10:00 AM - 3:00 PM',
            location: 'Computer Lab 2',
            facilitator: 'Dr. Jennifer Lopez',
            status: 'confirmed'
        }
    ];

    const completedTrainings = [
        {
            id: 4,
            title: 'Research Methodology Seminar',
            description: 'Comprehensive research methods training',
            date: '2024-10-15',
            time: '9:00 AM - 12:00 PM',
            location: 'Conference Room A',
            facilitator: 'Prof. David Smith',
            certificate: true,
            attendance: 'Present'
        },
        {
            id: 5,
            title: 'Digital Tools for Teaching',
            description: 'Introduction to educational technology tools',
            date: '2024-09-20',
            time: '1:00 PM - 4:00 PM',
            location: 'Room 205',
            facilitator: 'Ms. Emily Brown',
            certificate: true,
            attendance: 'Present'
        }
    ];

    const handleRegister = (training: any) => {
        console.log('Registering for:', training.title);
        setSelectedTraining(null);
    };

    const handleCancelRegistration = (training: any) => {
        setTrainingToCancel(training);
        setShowCancelConfirm(true);
    };

    const confirmCancel = () => {
        console.log('Cancelled registration for:', trainingToCancel?.title);
        setTrainingToCancel(null);
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Upcoming Trainings</span>
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">2</div>
                    <div className="text-sm text-gray-600">Available to Register</div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Registered</span>
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
                    <div className="text-sm text-gray-600">Trainings Scheduled</div>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Completed</span>
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">2</div>
                    <div className="text-sm text-gray-600">Trainings Attended</div>
                </div>
            </div>

            {/* Tabs and Content */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="border-b border-gray-200 p-4">
                    <div className="flex gap-2">
                        {[
                            { id: 'upcoming', label: 'Upcoming Trainings' },
                            { id: 'registered', label: 'My Registered Trainings' },
                            { id: 'completed', label: 'My Completed Trainings' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${activeTab === tab.id
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
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search trainings..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    {activeTab === 'upcoming' && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Training Programs</h3>
                            <div className="space-y-4">
                                {upcomingTrainings.map((training) => (
                                    <div key={training.id} className="border border-gray-200 rounded-lg p-5 hover:border-indigo-300 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 mb-2">{training.title}</h4>
                                                <p className="text-sm text-gray-600 mb-4">{training.description}</p>

                                                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>{training.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>{training.time}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        </svg>
                                                        <span>{training.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        <span>{training.facilitator}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className={`text-sm font-medium ${training.slots.available < 10 ? 'text-red-600' : 'text-green-600'
                                                        }`}>
                                                        {training.slots.available}/{training.slots.total} slots available
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setSelectedTraining(training)}
                                                className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium whitespace-nowrap"
                                            >
                                                Register
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'registered' && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Registered Trainings</h3>
                            {registeredTrainings.length > 0 ? (
                                <div className="space-y-4">
                                    {registeredTrainings.map((training) => (
                                        <div key={training.id} className="border border-gray-200 rounded-lg p-5">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="font-semibold text-gray-900">{training.title}</h4>
                                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                            {training.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-4">{training.description}</p>

                                                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <span>{training.date}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span>{training.time}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            </svg>
                                                            <span>{training.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            <span>{training.facilitator}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleCancelRegistration(training)}
                                                    className="ml-4 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                                                >
                                                    Cancel Request
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-600">You haven't registered for any training yet.</p>
                                    <button
                                        onClick={() => setActiveTab('upcoming')}
                                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Browse Available Trainings
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'completed' && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed Trainings</h3>
                            <div className="space-y-4">
                                {completedTrainings.map((training) => (
                                    <div key={training.id} className="border border-gray-200 rounded-lg p-5">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 mb-2">{training.title}</h4>
                                                <p className="text-sm text-gray-600 mb-4">{training.description}</p>

                                                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>{training.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        </svg>
                                                        <span>{training.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        <span>{training.facilitator}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="text-green-600 font-medium">{training.attendance}</span>
                                                    </div>
                                                </div>

                                                {training.certificate && (
                                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                        </svg>
                                                        <span className="font-medium">Certificate Available</span>
                                                    </div>
                                                )}
                                            </div>

                                            {training.certificate && (
                                                <button className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    Download
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Registration Modal */}
            {selectedTraining && (
                <Modal
                    isOpen={!!selectedTraining}
                    onClose={() => setSelectedTraining(null)}
                    title="Register for Training" 
                    size="md"
                >
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{selectedTraining.title}</h4>
                            <p className="text-sm text-gray-600">{selectedTraining.description}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Date</span>
                                <span className="font-medium text-gray-900">{selectedTraining.date}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Time</span>
                                <span className="font-medium text-gray-900">{selectedTraining.time}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Location</span>
                                <span className="font-medium text-gray-900">{selectedTraining.location}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Facilitator</span>
                                <span className="font-medium text-gray-900">{selectedTraining.facilitator}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Available Slots</span>
                                <span className={`font-medium ${selectedTraining.slots.available < 10 ? 'text-red-600' : 'text-green-600'}`}>
                                    {selectedTraining.slots.available}/{selectedTraining.slots.total}
                                </span>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                            <p>By registering, you commit to attending this training session. Please ensure you're available on the scheduled date and time.</p>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => setSelectedTraining(null)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleRegister(selectedTraining)}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Confirm Registration
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Cancel Confirmation Modal */}
            <ConfirmModal
                isOpen={showCancelConfirm}
                onClose={() => {
                    setShowCancelConfirm(false);
                    setTrainingToCancel(null);
                }}
                onConfirm={confirmCancel}
                title="Cancel Registration"
                message={`Are you sure you want to cancel your registration for "${trainingToCancel?.title}"? This action cannot be undone.`}
                confirmText="Yes, Cancel Registration"
                cancelText="Keep Registration"
                type="danger"
            />
        </div>
    );
}