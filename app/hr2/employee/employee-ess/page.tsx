'use client';

import { useState } from 'react';
import Modal, { FormModal } from '../Modal';

export default function ESSPage() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requestType, setRequestType] = useState('');

  const requests = [
    {
      id: 1,
      type: 'Certificate of Employment',
      description: 'Needed for bank loan application',
      requestedOn: '2024-12-01',
      status: 'approved',
      completedOn: '2024-12-02'
    },
    {
      id: 2,
      type: 'Training Certificate',
      description: 'Certificate for Digital Learning Tools Workshop',
      requestedOn: '2024-11-15',
      status: 'pending',
      completedOn: null
    }
  ];

  const handleSubmitRequest = async (e: React.FormEvent) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsNewRequestOpen(false);
    console.log('Request submitted');
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
      pending: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Pending' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' }
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
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Total Requests</span>
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">2</div>
          <div className="text-sm text-gray-600">All Time</div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Pending</span>
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">1</div>
          <div className="text-sm text-gray-600">Awaiting Review</div>
        </div>

        <div className="bg-green-50 rounded-lg p-6 border border-green-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Approved</span>
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">1</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { 
              id: 'new-request', 
              label: 'New Request', 
              icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
              action: () => setIsNewRequestOpen(true)
            },
            { 
              id: 'certificate', 
              label: 'Certificate', 
              icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
              action: () => { setRequestType('certificate'); setIsNewRequestOpen(true); }
            },
            { 
              id: 'leave', 
              label: 'Leave Request', 
              icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
              action: () => { setRequestType('leave'); setIsNewRequestOpen(true); }
            },
            { 
              id: 'other', 
              label: 'Other Documents', 
              icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
              action: () => { setRequestType('other'); setIsNewRequestOpen(true); }
            }
          ].map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-all text-center group"
            >
              <svg className="w-10 h-10 mx-auto mb-3 text-indigo-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
              </svg>
              <div className="font-medium text-gray-900">{action.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Request Status */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Request Status</h3>
            <p className="text-sm text-gray-600">Track your document requests</p>
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search requests..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="border border-gray-200 rounded-lg p-5 hover:border-indigo-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{request.type}</h4>
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{request.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Requested: {request.requestedOn}</span>
                    </div>
                    {request.completedOn && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-green-600">Completed: {request.completedOn}</span>
                      </div>
                    )}
                  </div>
                </div>

                {request.status === 'approved' && (
                  <button className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                )}

                {request.status === 'pending' && (
                  <button className="ml-4 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                    Cancel Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {requests.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 mb-4">No requests yet.</p>
            <button
              onClick={() => setIsNewRequestOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Your First Request
            </button>
          </div>
        )}
      </div>

      {/* New Request Modal */}
      <FormModal
        isOpen={isNewRequestOpen}
        onClose={() => {
          setIsNewRequestOpen(false);
          setRequestType('');
        }}
        onSubmit={handleSubmitRequest}
        title="Create New Request"
        submitText="Submit Request"
        isLoading={isLoading}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Type <span className="text-red-500">*</span>
            </label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
            >
              <option value="">Select request type</option>
              <option value="certificate">Certificate of Employment</option>
              <option value="training">Training Certificate</option>
              <option value="leave">Leave Request</option>
              <option value="clearance">Clearance</option>
              <option value="other">Other Documents</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose/Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              rows={4}
              placeholder="Please provide details about why you need this document..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600">
              <option>Normal (3-5 business days)</option>
              <option>Urgent (1-2 business days)</option>
              <option>Emergency (Same day if possible)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              rows={3}
              placeholder="Any additional information..."
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <p>Your request will be reviewed by HR. You'll be notified once it's processed.</p>
          </div>
        </div>
      </FormModal>
    </div>
  );
}