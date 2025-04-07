import React from 'react';
import { Users, FileText, UserPlus, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { name: 'Total Users', value: '120', icon: Users, color: 'bg-blue-500' },
    { name: 'Active Orders', value: '45', icon: FileText, color: 'bg-green-500' },
    { name: 'New Leads', value: '23', icon: UserPlus, color: 'bg-yellow-500' },
    { name: 'Revenue', value: '$45,000', icon: DollarSign, color: 'bg-purple-500' },
  ];

  const recentOrders = [
    { id: 'ORD001', customer: 'John Doe', status: 'New', date: '2024-03-15' },
    { id: 'ORD002', customer: 'Jane Smith', status: 'InProgress', date: '2024-03-14' },
    { id: 'ORD003', customer: 'Mike Johnson', status: 'Completed', date: '2024-03-13' },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h2>
        <div className="bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${order.status === 'New' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'InProgress' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;