// import React from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import {
//   LayoutDashboard,
//   Users,
//   FileText,
//   UserPlus,
//   Contact2,
//   Image,
//   ListTodo,
//   DollarSign,
//   Settings,
//   LogOut,
//   X
// } from 'lucide-react';
// import toast from "react-hot-toast";
// import name from "../../../public/name.png";
// import logo from "../../../public/logo1.png";


// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const userInfo = JSON.parse(localStorage.getItem('accountType') || '{}');

//   const menuItems = {
//     SuperAdmin: [
//       { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
//       { name: 'User Management', icon: Users, path: '/user-management' },
//       { name: 'Orders', icon: FileText, path: '/orders' },
//       { name: 'Customers', icon: Contact2, path: '/customers' },
//       { name: 'Lead', icon: ListTodo, path: '/leads' },
//       // { name: 'Gallery', icon: Image, path: '/gallery' },
//       // { name: 'Work Queue', icon: ListTodo, path: '/work-queue' },
//       { name: 'Financial', icon: DollarSign, path: '/financial' }
//     ],
//     Admin: [
//       { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
//       { name: 'Orders', icon: FileText, path: '/orders' },
//       { name: 'Customers', icon: Contact2, path: '/customers' },
//       // { name: 'Gallery', icon: Image, path: '/gallery' },
//       // { name: 'Work Queue', icon: ListTodo, path: '/work-queue' },
//       { name: 'Financial', icon: DollarSign, path: '/financial' }
//     ],
//     Graphics: [
//       { name: 'Orders', icon: FileText, path: '/graphics-order' },
//       // { name: 'Customers', icon: Contact2, path: '/customers' },
//       // { name: 'Gallery', icon: Image, path: '/gallery' },
//       // { name: 'Work Queue', icon: ListTodo, path: '/work-queue' }
//     ],
//     Display: [
//       { name: 'Orders', icon: FileText, path: '/display-order' },
//       // { name: 'Work Queue', icon: ListTodo, path: '/work-queue' }
//     ],
//     Accounts: [
//       { name: 'Accounts', icon: DollarSign, path: '/accounts-order' }
//     ],
//     Viewer: [
//       { name: 'Orders', icon: FileText, path: '/view-order' }
//     ]
//   };

//   const currentUserMenu = menuItems[userInfo] || [];

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('accountType');
//     toast.success("Logout Successful");
//     navigate('/login');
//   };

//   return (
//     <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 shadow-lg h-screen flex flex-col justify-between transition-transform duration-300 ease-in-out transform`}>
//       <div>
//         <div className="h-16 flex items-center justify-between border-b border-gray-700 px-4">
//           {/* <h1 className="text-2xl font-bold text-indigo-400 text-center">{userInfo}</h1> */}
//           <div className='flex flex-row gap-'>
//             <img src={logo} alt="logo" className='h-8 w-8'/>
//             <img src={name} alt="name" className='h-9 w-42' />
//           </div>
          
//           <button 
//             onClick={toggleSidebar} 
//             className="p-1 text-gray-400 rounded-md hover:text-white hover:bg-gray-800 lg:hidden"
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>
//         <nav className="mt-6">
//           <div className="px-4 space-y-2">
//             {currentUserMenu.map((item) => {
//               const isActive = location.pathname === item.path;
//               return (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   onClick={() => window.innerWidth < 1024 && toggleSidebar()} // Close sidebar on mobile after navigation
//                   className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
//                       ? 'bg-indigo-700 text-white'
//                       : 'text-gray-300 hover:bg-gray-800 hover:text-white'
//                     }`}
//                 >
//                   <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-indigo-200' : 'text-gray-400'}`} />
//                   {item.name}
//                 </Link>
//               );
//             })}
//           </div>
//         </nav>
//       </div>
//       <div className="p-4 border-t border-gray-700">
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center justify-center py-3 text-sm font-medium text-white rounded-lg shadow-xl hover:bg-red-400 transition-colors"
//         >
//           <LogOut className="h-5 w-5 mr-2" /> Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// import React, { useEffect, useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import {
//   LayoutDashboard,
//   Users,
//   FileText,
//   UserPlus,
//   Contact2,
//   Image,
//   ListTodo,
//   DollarSign,
//   Settings,
//   LogOut,
//   X
// } from 'lucide-react';
// import toast from "react-hot-toast";
// import name from "../../../public/name.png";
// import logo from "../../../public/logo1.png";


// const Sidebar = ({ isOpen, toggleSidebar, setActiveMenuItem }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const userInfo = JSON.parse(localStorage.getItem('accountType') || '{}');

//   const menuItems = {
//     SuperAdmin: [
//       { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
//       { name: 'User Management', icon: Users, path: '/user-management' },
//       { name: 'Orders', icon: FileText, path: '/orders' },
//       { name: 'Customers', icon: Contact2, path: '/customers' },
//       { name: 'Lead', icon: ListTodo, path: '/leads' },
//       // { name: 'Gallery', icon: Image, path: '/gallery' },
//       // { name: 'Work Queue', icon: ListTodo, path: '/work-queue' },
//       // { name: 'Financial', icon: DollarSign, path: '/financial' }
//     ],
//     Admin: [
//       { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
//       { name: 'Orders', icon: FileText, path: '/orders' },
//       { name: 'Customers', icon: Contact2, path: '/customers' },
//       // { name: 'Gallery', icon: Image, path: '/gallery' },
//       // { name: 'Work Queue', icon: ListTodo, path: '/work-queue' },
//       // { name: 'Financial', icon: DollarSign, path: '/financial' }
//     ],
//     Graphics: [
//       { name: 'Orders', icon: FileText, path: '/graphics-order' },
//       // { name: 'Customers', icon: Contact2, path: '/customers' },
//       // { name: 'Gallery', icon: Image, path: '/gallery' },
//       // { name: 'Work Queue', icon: ListTodo, path: '/work-queue' }
//     ],
//     Display: [
//       { name: 'Orders', icon: FileText, path: '/display-order' },
//       // { name: 'Work Queue', icon: ListTodo, path: '/work-queue' }
//     ],
//     Accounts: [
//       { name: 'Accounts', icon: DollarSign, path: '/accounts-order' }
//     ],
//     Viewer: [
//       { name: 'Orders', icon: FileText, path: '/view-order' }
//     ]
//   };

//   const currentUserMenu = menuItems[userInfo] || [];

//   // Update active menu item based on current location
//   useEffect(() => {
//     const activeItem = currentUserMenu.find(item => item.path === location.pathname);
//     if (activeItem) {
//       setActiveMenuItem(activeItem.name);
//     } else {
//       setActiveMenuItem(null);
//     }
//   }, [location.pathname, currentUserMenu, setActiveMenuItem]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('accountType');
//     toast.success("Logout Successful");
//     navigate('/login');
//   };

//   return (
//     <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 shadow-lg h-screen flex flex-col justify-between transition-transform duration-300 ease-in-out transform`}>
//       <div>
//         <div className="h-16 flex items-center justify-between border-b border-gray-700 px-4">
//           {/* <h1 className="text-2xl font-bold text-indigo-400 text-center">{userInfo}</h1> */}
//           <div className='flex flex-row gap-'>
//             <img src={logo} alt="logo" className='h-8 w-8'/>
//             <img src={name} alt="name" className='h-9 w-42' />
//           </div>
          
//           <button 
//             onClick={toggleSidebar} 
//             className="p-1 text-gray-400 rounded-md hover:text-white hover:bg-gray-800 lg:hidden"
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>
//         <nav className="mt-6">
//           <div className="px-4 space-y-2">
//             {currentUserMenu.map((item) => {
//               const isActive = location.pathname === item.path;
//               return (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   onClick={() => {
//                     setActiveMenuItem(item.name);
//                     if (window.innerWidth < 1024) toggleSidebar();
//                   }}
//                   className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
//                       ? 'bg-indigo-700 text-white'
//                       : 'text-gray-300 hover:bg-gray-800 hover:text-white'
//                     }`}
//                 >
//                   <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-indigo-200' : 'text-gray-400'}`} />
//                   {item.name}
//                 </Link>
//               );
//             })}
//           </div>
//         </nav>
//       </div>
//       <div className="p-4 border-t border-gray-700">
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center justify-center py-3 text-sm font-medium text-white rounded-lg shadow-xl hover:bg-red-400 transition-colors"
//         >
//           <LogOut className="h-5 w-5 mr-2" /> Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import React, { useEffect, useState } from 'react';
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
import toast from "react-hot-toast";
import name from "../../../public/name.png";
import logo from "../../../public/logo1.png";

const Sidebar = ({ isOpen, toggleSidebar, setActiveMenuItem }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('accountType') || '{}');
  const [activeItem, setActiveItem] = useState(null);

  const menuItems = {
    SuperAdmin: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { name: 'User Management', icon: Users, path: '/user-management' },
      { name: 'Orders', icon: FileText, path: '/orders' },
      { name: 'Customers', icon: Contact2, path: '/customers' },
      { name: 'Lead', icon: ListTodo, path: '/leads' },
      // { name: 'Gallery', icon: Image, path: '/gallery' },
      // { name: 'Work Queue', icon: ListTodo, path: '/work-queue' },
      // { name: 'Financial', icon: DollarSign, path: '/financial' }
    ],
    Admin: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { name: 'Orders', icon: FileText, path: '/orders' },
      { name: 'Customers', icon: Contact2, path: '/customers' },
      // { name: 'Gallery', icon: Image, path: '/gallery' },
      // { name: 'Work Queue', icon: ListTodo, path: '/work-queue' },
      // { name: 'Financial', icon: DollarSign, path: '/financial' }
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
      { name: 'Accounts', icon: DollarSign, path: '/accounts-order' }
    ],
    Viewer: [
      { name: 'Orders', icon: FileText, path: '/view-order' }
    ]
  };

  const currentUserMenu = menuItems[userInfo] || [];

  // Update active menu item based on current location
  useEffect(() => {
    const active = currentUserMenu.find(item => item.path === location.pathname);
    if (active) {
      setActiveItem(active.name);
      setActiveMenuItem(active.name);
    } else {
      setActiveItem(null);
      setActiveMenuItem(null);
    }
  }, [location.pathname, currentUserMenu, setActiveMenuItem]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('accountType');
    toast.success("Logout Successful");
    navigate('/login');
  };

  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg h-screen flex flex-col justify-between transition-transform duration-300 ease-in-out transform`}>
      <div>
        <div className="h-16 flex items-center justify-between border-b px-4">
          <div className='flex flex-row items-center gap-2'>
            <img src={logo} alt="logo" className='h-8 w-8'/>
            <img src={name} alt="name" className='h-9 w-42' />
          </div>
          
          {/* <button 
            onClick={toggleSidebar} 
            className="p-1 text-gray-600 rounded-md hover:text-gray-800 hover:bg-gray-100 lg:hidden"
          >
            <X className="h-6 w-6" />
          </button> */}
        </div>
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            {currentUserMenu.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    setActiveItem(item.name);
                    setActiveMenuItem(item.name);
                    if (window.innerWidth < 1024) toggleSidebar();
                  }}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center py-3 px-4 text-sm font-medium text-white bg-gradient-to-r from-red-400 to-pink-500 rounded-lg shadow-md hover:from-red-500 hover:to-pink-600 transition-all duration-300"
        >
          <LogOut className="h-5 w-5 mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;