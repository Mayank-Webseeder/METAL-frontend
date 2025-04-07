import React, { useState } from 'react';
import { Search, Clock, CheckCircle, XCircle } from 'lucide-react';

const WorkQueue = () => {
  const workItems = [
    {
      id: 1,
      orderId: 'ORD001',
      title: 'Banner Design',
      priority: 'High',
      status: 'InProgress',
      assignedTo: 'Sarah Designer',
      startedAt: '2024-03-15 09:00',
      deadline: '2024-03-16 17:00',
      progress: 75
    },
    {
      id: 2,
      orderId: 'ORD002',
      title: 'Logo Design',
      priority: 'Medium',
      status: 'Pending',
      assignedTo: 'Mike Artist',
      startedAt: null,
      deadline: '2024-03-17 17:00',
      progress: 0
    },
    {
      id: 3,
      orderId: 'ORD003',
      title: 'Product Banner',
      priority: 'Low',
      status: 'Completed',
      assignedTo: 'Lisa Graphics',
      startedAt: '2024-03-13 10:00',
      completedAt: '2024-03-14 15:00',
      progress: 100
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'InProgress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'Pending':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Work Queue</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search work items..."
                className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="InProgress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            {workItems.map((item) => (
              <div key={item.id} className="bg-white border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(item.status)}
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Order ID: {item.orderId}</p>
                    <p className="text-sm text-gray-500">Assigned to: {item.assignedTo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Deadline</p>
                    <p className="text-sm font-medium text-gray-900">{item.deadline}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>

                {item.status === 'InProgress' && (
                  <div className="mt-4 flex justify-end">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-md text-sm">
                      Mark as Complete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
 
  );
};

export default WorkQueue;