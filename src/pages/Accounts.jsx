import React, { useState } from 'react';
import { Search, DollarSign, FileText, CreditCard, Calendar } from 'lucide-react';

const Accounts = () => {
  const transactions = [
    {
      id: 1,
      orderId: 'ORD001',
      type: 'Invoice',
      amount: 1500.00,
      status: 'Pending',
      invoiceNumber: 'INV001',
      customer: 'John Doe',
      date: '2024-03-15',
      paymentMethod: null
    },
    {
      id: 2,
      orderId: 'ORD002',
      type: 'Payment',
      amount: 2000.00,
      status: 'Completed',
      invoiceNumber: 'INV002',
      customer: 'Jane Smith',
      date: '2024-03-14',
      paymentMethod: 'Credit Card'
    },
    {
      id: 3,
      orderId: 'ORD003',
      type: 'Invoice',
      amount: 1800.00,
      status: 'Completed',
      invoiceNumber: 'INV003',
      customer: 'Mike Johnson',
      date: '2024-03-13',
      paymentMethod: 'Bank Transfer'
    },
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,000',
      icon: DollarSign,
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      title: 'Pending Payments',
      value: '$12,500',
      icon: FileText,
      change: '-5.2%',
      changeType: 'negative'
    },
    {
      title: 'Completed Payments',
      value: '$32,500',
      icon: CreditCard,
      change: '+8.1%',
      changeType: 'positive'
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Accounts</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${
                stat.changeType === 'positive' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <stat.icon className={`h-6 w-6 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">All Types</option>
              <option value="Invoice">Invoices</option>
              <option value="Payment">Payments</option>
            </select>
            <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'Invoice' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {transaction.type === 'Invoice' ? (
                        <FileText className="h-5 w-5 text-blue-600" />
                      ) : (
                        <DollarSign className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.type === 'Invoice' ? transaction.invoiceNumber : 'Payment'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Order: {transaction.orderId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{transaction.customer}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ${transaction.amount.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    transaction.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{transaction.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {transaction.paymentMethod || '-'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Accounts;