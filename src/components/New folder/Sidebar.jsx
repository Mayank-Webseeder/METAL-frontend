import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  UserPlus,
  Contact2,
  Image,
  ListTodo,
  DollarSign,
  Settings,
  LogOut,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('accountType') || '{}');

  const menuItems = {
    SuperAdmin: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { name: 'User Management', icon: Users, path: '/user-management' },
      { name: 'Orders', icon: FileText, path: '/orders' },
      { name: 'Customers', icon: Contact2, path: '/customers' },
      // { name: 'Gallery', icon: Image, path: '/gallery' },
      // { name: 'Work Queue', icon: ListTodo, path: '/work-queue' },
      { name: 'Financial', icon: DollarSign, path: '/financial' }
    ],
    Admin: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { name: 'Orders', icon: FileText, path: '/orders' },
      { name: 'Customers', icon: Contact2, path: '/customers' },
      // { name: 'Gallery', icon: Image, path: '/gallery' },
      // { name: 'Work Queue', icon: ListTodo, path: '/work-queue' },
      { name: 'Financial', icon: DollarSign, path: '/financial' }
    ],
    Graphics: [
      { name: 'Orders', icon: FileText, path: '/graphics-order' },
      // { name: 'Customers', icon: Contact2, path: '/customers' },
      // { name: 'Gallery', icon: Image, path: '/gallery' },
      // { name: 'Work Queue', icon: ListTodo, path: '/work-queue' }
    ],
    Display: [
      { name: 'Orders', icon: FileText, path: '/display-order' },
      // { name: 'Work Queue', icon: ListTodo, path: '/work-queue' }
    ],
    Accounts: [
      { name: 'Orders', icon: FileText, path: '/orders' },
      { name: 'Accounts', icon: DollarSign, path: '/accounts' }
    ]
  };

  const currentUserMenu = menuItems[userInfo] || [];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('accountType');
    navigate('/login');
  };

  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 shadow-lg h-screen flex flex-col justify-between transition-transform duration-300 ease-in-out transform`}>
      <div>
        <div className="h-16 flex items-center justify-between border-b border-gray-700 px-4">
          <h1 className="text-2xl font-bold text-indigo-400 text-center">{userInfo}</h1>
          <button 
            onClick={toggleSidebar} 
            className="p-1 text-gray-400 rounded-md hover:text-white hover:bg-gray-800 lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            {currentUserMenu.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()} // Close sidebar on mobile after navigation
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                      ? 'bg-indigo-700 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-indigo-200' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center py-3 text-sm font-medium text-white rounded-lg hover:bg-red-400 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;