// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Plus, X, Search, UserCog, Shield, Mail,
//   Calendar, Edit, Trash2, Filter, ChevronDown
// } from "lucide-react";
// import Loader from './Loader';

// const UserManagement = () => {
//   const BASE_URL = import.meta.env.VITE_BASE_URL;
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [roleFilter, setRoleFilter] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     accountType: "Admin",
//   });
//   const [editData, setEditData] = useState({
//     userId: "",
//     firstName: "",
//     lastName: "",
//     email: "",
//     newPassword: "",
//     confirmPassword: "",
//     accountType: "",
//   });
//   const [passwordError, setPasswordError] = useState("");
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     // Filter users based on search term and role
//     let result = users;

//     if (searchTerm) {
//       result = result.filter(user =>
//         `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (roleFilter) {
//       result = result.filter(user => user.accountType === roleFilter);
//     }

//     setFilteredUsers(result);
//   }, [users, searchTerm, roleFilter]);

//   const fetchUsers = async () => {
//     if (!token) return;
//     try {
//       setLoading(true);
//       const response = await axios.get(`${BASE_URL}/api/v1/auth/getAllUsers`, {
//         headers: { Authorization: `${token}` },
//         withCredentials: true,
//       });
//       if (response.data.success) {
//         setUsers(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleEditChange = (e) => {
//     setEditData({ ...editData, [e.target.name]: e.target.value });

//     // Clear password error when either password field changes
//     if (e.target.name === "newPassword" || e.target.name === "confirmPassword") {
//       setPasswordError("");
//     }
//   };

//   const handleSubmit = async (e) => {
//     if (!token) return;
//     e.preventDefault();
//     try {
//       await axios.post(`${BASE_URL}/api/v1/auth/create-account`, formData, {
//         headers: { Authorization: `${token}` },
//         withCredentials: true,
//       });
//       setShowAddModal(false);
//       fetchUsers(); // Refresh the users list after adding a new user
//       // Reset form data
//       setFormData({
//         firstName: "",
//         lastName: "",
//         email: "",
//         password: "",
//         accountType: "Admin",
//       });
//     } catch (error) {
//       console.error("Error creating user:", error);
//     }
//   };

//   const handleEditSubmit = async (e) => {
//     if (!token) return;
//     e.preventDefault();

//     // Validate passwords match if attempting to change password
//     if (editData.newPassword) {
//       if (editData.newPassword !== editData.confirmPassword) {
//         setPasswordError("Passwords do not match");
//         return;
//       }
//       if (editData.newPassword.length < 6) {
//         setPasswordError("Password must be at least 6 characters");
//         return;
//       }
//     }

//     try {
//       // Update user profile details (name)
//       const userProfileData = {
//         userId: editData.userId,
//         firstName: editData.firstName,
//         lastName: editData.lastName,
//         accountType: editData.accountType
//       };

//       await axios.put(`${BASE_URL}/api/v1/auth/updateUser/${editData.userId}`, userProfileData, {
//         headers: { Authorization: `${token}` },
//         withCredentials: true,
//       });

//       // If password is being changed, make a separate request
//       if (editData.newPassword) {
//         await axios.post(`${BASE_URL}/api/v1/auth/change-password`, {
//           userId: editData.userId,
//           newPassword: editData.newPassword
//         }, {
//           headers: { Authorization: `${token}` },
//           withCredentials: true,
//         });
//       }

//       // Update user in state without refetching
//       setUsers(users.map(user => {
//         if (user._id === editData.userId) {
//           return {
//             ...user,
//             firstName: editData.firstName,
//             lastName: editData.lastName,
//             accountType: editData.accountType
//           };
//         }
//         return user;
//       }));

//       setShowEditModal(false);
//       // Reset edit data
//       setEditData({
//         userId: "",
//         firstName: "",
//         lastName: "",
//         email: "",
//         newPassword: "",
//         confirmPassword: "",
//         accountType: ""
//       });
//     } catch (error) {
//       console.error("Error updating user:", error);
//     }
//   };

//   const handleOpenEditModal = (user) => {
//     setEditData({
//       userId: user._id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       newPassword: "",
//       confirmPassword: "",
//       accountType: user.accountType
//     });
//     setShowEditModal(true);
//   };

//   const handleDeleteUser = async (userId) => {
//     if (!token) return;

//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try {
//         const response = await axios.delete(`${BASE_URL}/api/v1/auth/deleteUser/${userId}`, {
//           headers: { Authorization: `${token}` },
//           withCredentials: true,
//         });

//         if (response.data.success) {
//           // Remove user from state without refetching
//           setUsers(users.filter(user => user._id !== userId));
//         }
//       } catch (error) {
//         console.error("Error deleting user:", error);
//       }
//     }
//   };

//   const renderAccountTypeTag = (type) => {
//     const typeColors = {
//       Admin: "bg-blue-100 text-blue-800",
//       Graphics: "bg-green-100 text-green-800",
//       Display: "bg-purple-100 text-purple-800",
//       Accounts: "bg-yellow-100 text-yellow-800",
//       SuperAdmin: "bg-red-100 text-red-800"
//     };

//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[type] || 'bg-gray-100'}`}>
//         {type}
//       </span>
//     );
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8">
//       <div className="container mx-auto">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
//             <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
//               Manage and control user access across your organization
//             </p>
//           </div>
//           <button
//             onClick={() => setShowAddModal(true)}
//             className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
//           >
//             <Plus className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Add User
//           </button>
//         </div>

//         <div className="bg-white shadow-lg rounded-xl overflow-hidden">
//           <div className="p-3 sm:p-4 border-b bg-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 justify-between">
//             <div className="relative flex-1 sm:mr-4">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search users by name or email..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-9 sm:pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//               />
//             </div>
//             <div className="relative min-w-[140px]">
//               <select
//                 value={roleFilter}
//                 onChange={(e) => setRoleFilter(e.target.value)}
//                 className="appearance-none w-full border border-gray-300 rounded-lg py-2 px-3 sm:px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//               >
//                 <option value="">All Roles</option>
//                 <option value="SuperAdmin">Super Admin</option>
//                 <option value="Admin">Admin</option>
//                 <option value="Graphics">Graphics</option>
//                 <option value="Display">Display</option>
//                 <option value="Accounts">Accounts</option>
//               </select>
//               <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//             </div>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <Loader />
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-100 border-b">
//                   <tr>
//                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Created At</th>
//                     <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredUsers.map((user) => (
//                     <tr key={user._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap flex items-center">
//                         <div className="h-8 w-8 sm:h-10 sm:w-10 bg-indigo-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
//                           <UserCog className="h-4 w-4 sm:h-6 sm:w-6 text-indigo-600" />
//                         </div>
//                         <div className="truncate max-w-[100px] sm:max-w-full">
//                           <div className="text-xs sm:text-sm font-medium text-gray-900">
//                             {user.firstName} {user.lastName}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
//                         <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] sm:max-w-full">{user.email}</div>
//                       </td>
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
//                         {renderAccountTypeTag(user.accountType)}
//                       </td>
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
//                         {new Date(user.created).toLocaleDateString()}
//                       </td>
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
//                         <div className="flex justify-end space-x-2 sm:space-x-3">
//                           <button
//                             onClick={() => handleOpenEditModal(user)}
//                             className="text-indigo-600 hover:text-indigo-900 transition-colors"
//                           >
//                             <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteUser(user._id)}
//                             className="text-red-600 hover:text-red-900 transition-colors"
//                             disabled={user.accountType === "SuperAdmin"}
//                           >
//                             <Trash2 className={`h-4 w-4 sm:h-5 sm:w-5 ${user.accountType === "SuperAdmin" ? "opacity-50 cursor-not-allowed" : ""}`} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Add User Modal */}
//         {showAddModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] p-4 sm:p-6 md:p-8 relative">
//               <button
//                 onClick={() => setShowAddModal(false)}
//                 className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700"
//               >
//                 <X className="h-5 w-5 sm:h-6 sm:w-6" />
//               </button>
//               <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">Create New User</h2>
//               <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
//                 <div>
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">First Name</label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Last Name</label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Password</label>
//                   <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Account Type</label>
//                   <select
//                     name="accountType"
//                     value={formData.accountType}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//                   >
//                     <option value="Admin">Admin</option>
//                     <option value="Graphics">Graphics</option>
//                     <option value="Display">Display</option>
//                     <option value="Accounts">Accounts</option>
//                   </select>
//                 </div>
//                 <div className="flex justify-end mt-4 sm:mt-6">
//                   <button
//                     type="submit"
//                     className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm"
//                   >
//                     Create Account
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}



//         {showEditModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] p-5 sm:p-7 md:p-8 relative my-4 max-h-[90vh] overflow-y-auto border border-gray-100">
//               <button
//                 onClick={() => setShowEditModal(false)}
//                 className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors duration-200 bg-gray-50 hover:bg-gray-100 rounded-full p-1.5 z-10"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//               <div className="mb-6 sm:mb-8">
//                 <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pr-8">Edit User</h2>
//                 <div className="h-1 w-12 bg-indigo-600 mt-2 rounded-full"></div>
//               </div>

//               <form onSubmit={handleEditSubmit} className="space-y-4 sm:space-y-5">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={editData.firstName}
//                     onChange={handleEditChange}
//                     className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-200"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={editData.lastName}
//                     onChange={handleEditChange}
//                     className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-200"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={editData.email}
//                     className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none text-sm bg-gray-50"
//                     disabled
//                   />
//                   <p className="text-xs text-gray-500 mt-1.5 ml-1">Email cannot be changed</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Type</label>
//                   <div className="relative">
//                     <select
//                       name="accountType"
//                       value={editData.accountType}
//                       onChange={handleEditChange}
//                       className="w-full appearance-none border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm pr-10 transition-all duration-200"
//                       disabled={editData.accountType === "SuperAdmin"}
//                     >
//                       <option value="Admin">Admin</option>
//                       <option value="Graphics">Graphics</option>
//                       <option value="Display">Display</option>
//                       <option value="Accounts">Accounts</option>
//                       {editData.accountType === "SuperAdmin" && (
//                         <option value="SuperAdmin">Super Admin</option>
//                       )}
//                     </select>
//                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
//                       <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </div>
//                   </div>
//                   {editData.accountType === "SuperAdmin" && (
//                     <p className="text-xs text-gray-500 mt-1.5 ml-1">SuperAdmin role cannot be changed</p>
//                   )}
//                 </div>

//                 <div className="border-t border-gray-100 pt-4 mt-5">
//                   <div className="flex items-center mb-3">
//                     <h3 className="text-sm font-medium text-gray-800">Change Password</h3>
//                     <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">Optional</span>
//                   </div>
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
//                       <input
//                         type="password"
//                         name="newPassword"
//                         value={editData.newPassword}
//                         onChange={handleEditChange}
//                         className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-200"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
//                       <input
//                         type="password"
//                         name="confirmPassword"
//                         value={editData.confirmPassword}
//                         onChange={handleEditChange}
//                         className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-200"
//                       />
//                     </div>
//                     {passwordError && (
//                       <p className="text-sm text-red-600 mt-1 flex items-center">
//                         <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                         </svg>
//                         {passwordError}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-end pt-2 mt-6">
//                   <button
//                     type="button"
//                     onClick={() => setShowEditModal(false)}
//                     className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl transition-colors text-sm font-medium mr-3"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-colors text-sm font-medium shadow-sm"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserManagement;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Plus, X, Search, UserCog, Shield, Edit, 
//   Trash2, Filter, ChevronDown
// } from "lucide-react";
// import Loader from './Loader';
// import UserModal from '../components/AdminOrder/UserModal';

// const UserManagement = () => {
//   const BASE_URL = import.meta.env.VITE_BASE_URL;
//   const [showModal, setShowModal] = useState(false);
//   const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [roleFilter, setRoleFilter] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [currentUser, setCurrentUser] = useState(null);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     // Filter users based on search term and role
//     let result = users;

//     if (searchTerm) {
//       result = result.filter(user =>
//         `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (roleFilter) {
//       result = result.filter(user => user.accountType === roleFilter);
//     }

//     setFilteredUsers(result);
//   }, [users, searchTerm, roleFilter]);

//   const fetchUsers = async () => {
//     if (!token) return;
//     try {
//       setLoading(true);
//       const response = await axios.get(`${BASE_URL}/api/v1/auth/getAllUsers`, {
//         headers: { Authorization: `${token}` },
//         withCredentials: true,
//       });
//       if (response.data.success) {
//         setUsers(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddUser = () => {
//     setModalMode("add");
//     setCurrentUser(null);
//     setShowModal(true);
//   };

//   const handleOpenEditModal = (user) => {
//     setModalMode("edit");
//     setCurrentUser(user);
//     setShowModal(true);
//   };

//   const handleDeleteUser = async (userId) => {
//     if (!token) return;

//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try {
//         const response = await axios.delete(`${BASE_URL}/api/v1/auth/deleteUser/${userId}`, {
//           headers: { Authorization: `${token}` },
//           withCredentials: true,
//         });

//         if (response.data.success) {
//           // Remove user from state without refetching
//           setUsers(users.filter(user => user._id !== userId));
//         }
//       } catch (error) {
//         console.error("Error deleting user:", error);
//       }
//     }
//   };

//   const handleUserSaved = (savedUser, isNewUser) => {
//     if (isNewUser) {
//       // For a new user, fetch the full list again to get the proper ID and created date
//       fetchUsers();
//     } else {
//       // For an edited user, update the user in the state
//       setUsers(users.map(user => {
//         if (user._id === savedUser.userId) {
//           return {
//             ...user,
//             firstName: savedUser.firstName,
//             lastName: savedUser.lastName,
//             accountType: savedUser.accountType
//           };
//         }
//         return user;
//       }));
//     }
//     setShowModal(false);
//   };

//   const renderAccountTypeTag = (type) => {
//     const typeColors = {
//       Admin: "bg-blue-100 text-blue-800",
//       Graphics: "bg-green-100 text-green-800",
//       Display: "bg-purple-100 text-purple-800",
//       Accounts: "bg-yellow-100 text-yellow-800",
//       SuperAdmin: "bg-red-100 text-red-800"
//     };

//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[type] || 'bg-gray-100'}`}>
//         {type}
//       </span>
//     );
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8">
//       <div className="container mx-auto">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
//             <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
//               Manage and control user access across your organization
//             </p>
//           </div>
//           <button
//             onClick={handleAddUser}
//             className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
//           >
//             <Plus className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Add User
//           </button>
//         </div>

//         <div className="bg-white shadow-lg rounded-xl overflow-hidden">
//           <div className="p-3 sm:p-4 border-b bg-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 justify-between">
//             <div className="relative flex-1 sm:mr-4">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search users by name or email..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-9 sm:pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//               />
//             </div>
//             <div className="relative min-w-[140px]">
//               <select
//                 value={roleFilter}
//                 onChange={(e) => setRoleFilter(e.target.value)}
//                 className="appearance-none w-full border border-gray-300 rounded-lg py-2 px-3 sm:px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//               >
//                 <option value="">All Roles</option>
//                 <option value="SuperAdmin">Super Admin</option>
//                 <option value="Admin">Admin</option>
//                 <option value="Graphics">Graphics</option>
//                 <option value="Display">Display</option>
//                 <option value="Accounts">Accounts</option>
//               </select>
//               <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//             </div>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <Loader />
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-100 border-b">
//                   <tr>
//                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Created At</th>
//                     <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredUsers.map((user) => (
//                     <tr key={user._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap flex items-center">
//                         <div className="h-8 w-8 sm:h-10 sm:w-10 bg-indigo-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
//                           <UserCog className="h-4 w-4 sm:h-6 sm:w-6 text-indigo-600" />
//                         </div>
//                         <div className="truncate max-w-[100px] sm:max-w-full">
//                           <div className="text-xs sm:text-sm font-medium text-gray-900">
//                             {user.firstName} {user.lastName}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
//                         <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] sm:max-w-full">{user.email}</div>
//                       </td>
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
//                         {renderAccountTypeTag(user.accountType)}
//                       </td>
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
//                         {new Date(user.created).toLocaleDateString()}
//                       </td>
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
//                         <div className="flex justify-end space-x-2 sm:space-x-3">
//                           <button
//                             onClick={() => handleOpenEditModal(user)}
//                             className="text-indigo-600 hover:text-indigo-900 transition-colors"
//                           >
//                             <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteUser(user._id)}
//                             className="text-red-600 hover:text-red-900 transition-colors"
//                             disabled={user.accountType === "SuperAdmin"}
//                           >
//                             <Trash2 className={`h-4 w-4 sm:h-5 sm:w-5 ${user.accountType === "SuperAdmin" ? "opacity-50 cursor-not-allowed" : ""}`} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* User Modal (Add/Edit) */}
//         {showModal && (
//           <UserModal
//             mode={modalMode}
//             user={currentUser}
//             onClose={() => setShowModal(false)}
//             onSave={handleUserSaved}
//             baseUrl={BASE_URL}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserManagement;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Plus, X, Search, UserCog, Shield, Edit, 
//   Trash2, Filter, ChevronDown, CheckCircle, XCircle
// } from "lucide-react";
// import Loader from './Loader';
// import UserModal from '../components/AdminOrder/UserModal';

// const UserManagement = () => {
//   const BASE_URL = import.meta.env.VITE_BASE_URL;
//   const [showModal, setShowModal] = useState(false);
//   const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [roleFilter, setRoleFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState(""); // "" for all, "active", "inactive"
//   const [loading, setLoading] = useState(true);
//   const [currentUser, setCurrentUser] = useState(null);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     // Filter users based on search term, role, and status
//     let result = users;

//     if (searchTerm) {
//       result = result.filter(user =>
//         `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (roleFilter) {
//       result = result.filter(user => user.accountType === roleFilter);
//     }

//     if (statusFilter === "active") {
//       result = result.filter(user => user.isActive !== false);
//     } else if (statusFilter === "inactive") {
//       result = result.filter(user => user.isActive === false);
//     }

//     setFilteredUsers(result);
//   }, [users, searchTerm, roleFilter, statusFilter]);

//   const fetchUsers = async () => {
//     if (!token) return;
//     try {
//       setLoading(true);
//       const response = await axios.get(`${BASE_URL}/api/v1/auth/getAllUsers`, {
//         headers: { Authorization: `${token}` },
//         withCredentials: true,
//       });
//       if (response.data.success) {
//         setUsers(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddUser = () => {
//     setModalMode("add");
//     setCurrentUser(null);
//     setShowModal(true);
//   };

//   const handleOpenEditModal = (user) => {
//     setModalMode("edit");
//     setCurrentUser(user);
//     setShowModal(true);
//   };

//   const handleToggleUserStatus = async (user) => {
//     if (!token) return;

//     try {
//       const newStatus = !user.isActive;
//       const confirmMessage = newStatus 
//         ? `Are you sure you want to activate ${user.firstName} ${user.lastName}'s account?` 
//         : `Are you sure you want to deactivate ${user.firstName} ${user.lastName}'s account?`;

//       if (window.confirm(confirmMessage)) {
//         const response = await axios.put(`${BASE_URL}/api/v1/auth/updateUser/${user._id}`, {
//           firstName: user.firstName,
//           lastName: user.lastName,
//           accountType: user.accountType,
//           isActive: newStatus
//         }, {
//           headers: { Authorization: `${token}` },
//           withCredentials: true,
//         });

//         if (response.data.success) {
//           // Update user in state
//           setUsers(users.map(u => {
//             if (u._id === user._id) {
//               return { ...u, isActive: newStatus };
//             }
//             return u;
//           }));
//         }
//       }
//     } catch (error) {
//       console.error("Error toggling user status:", error);
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     if (!token) return;

//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try {
//         const response = await axios.delete(`${BASE_URL}/api/v1/auth/deleteUser/${userId}`, {
//           headers: { Authorization: `${token}` },
//           withCredentials: true,
//         });

//         if (response.data.success) {
//           // Remove user from state without refetching
//           setUsers(users.filter(user => user._id !== userId));
//         }
//       } catch (error) {
//         console.error("Error deleting user:", error);
//       }
//     }
//   };

//   const handleUserSaved = (savedUser, isNewUser) => {
//     if (isNewUser) {
//       // For a new user, fetch the full list again to get the proper ID and created date
//       fetchUsers();
//     } else {
//       // For an edited user, update the user in the state
//       setUsers(users.map(user => {
//         if (user._id === savedUser.userId) {
//           return {
//             ...user,
//             firstName: savedUser.firstName,
//             lastName: savedUser.lastName,
//             accountType: savedUser.accountType,
//             isActive: savedUser.isActive
//           };
//         }
//         return user;
//       }));
//     }
//     setShowModal(false);
//   };

//   const renderAccountTypeTag = (type) => {
//     const typeColors = {
//       Admin: "bg-blue-100 text-blue-800",
//       Graphics: "bg-green-100 text-green-800",
//       Display: "bg-purple-100 text-purple-800",
//       Accounts: "bg-yellow-100 text-yellow-800",
//       SuperAdmin: "bg-red-100 text-red-800",
//       Viewer: "bg-red-400 text-gray-800"
//     };

//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[type] || 'bg-gray-100'}`}>
//         {type}
//       </span>
//     );
//   };

//   const renderStatusIndicator = (isActive) => {
//     return isActive !== false ? (
//       <span className="flex items-center text-green-600">
//         <CheckCircle className="h-4 w-4 mr-1" />
//         <span className="text-xs">Active</span>
//       </span>
//     ) : (
//       <span className="flex items-center text-red-600">
//         <XCircle className="h-4 w-4 mr-1" />
//         <span className="text-xs">Inactive</span>
//       </span>
//     );
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8">
//       <div className="container mx-auto">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
//             <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
//               Manage and control user access across your organization
//             </p>
//           </div>
//           <button
//             onClick={handleAddUser}
//             className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
//           >
//             <Plus className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Add User
//           </button>
//         </div>

//         <div className="bg-white shadow-lg rounded-xl overflow-hidden">
//           <div className="p-3 sm:p-4 border-b bg-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 justify-between">
//             <div className="relative flex-1 sm:mr-4">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search users by name or email..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-9 sm:pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//               />
//             </div>
//             <div className="flex space-x-2 sm:space-x-3">
//               <div className="relative min-w-[120px]">
//                 <select
//                   value={roleFilter}
//                   onChange={(e) => setRoleFilter(e.target.value)}
//                   className="appearance-none w-full border border-gray-300 rounded-lg py-2 px-3 sm:px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//                 >
//                   <option value="">All Roles</option>
//                   <option value="SuperAdmin">Super Admin</option>
//                   <option value="Admin">Admin</option>
//                   <option value="Graphics">Graphics</option>
//                   <option value="Display">Display</option>
//                   <option value="Accounts">Accounts</option>
//                   <option value="Viewer">Viewer</option>
//                 </select>
//                 <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//               </div>
//               <div className="relative min-w-[120px]">
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="appearance-none w-full border border-gray-300 rounded-lg py-2 px-3 sm:px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//                 >
//                   <option value="">All Status</option>
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//                 <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//               </div>
//             </div>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <Loader />
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-100 border-b">
//                   <tr>
//                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Created At</th>
//                     <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredUsers.map((user) => (
//                     <tr key={user._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap flex items-center">
//                         <div className="h-8 w-8 sm:h-10 sm:w-10 bg-indigo-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
//                           <UserCog className="h-4 w-4 sm:h-6 sm:w-6 text-indigo-600" />
//                         </div>
//                         <div className="truncate max-w-[100px] sm:max-w-full">
//                           <div className="text-xs sm:text-sm font-medium text-gray-900">
//                             {user.firstName} {user.lastName}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
//                         <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] sm:max-w-full">{user.email}</div>
//                       </td>
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
//                         {renderAccountTypeTag(user.accountType)}
//                       </td>
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
//                         {renderStatusIndicator(user.isActive)}
//                       </td>
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
//                         {new Date(user.created).toLocaleDateString()}
//                       </td>
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
//                         <div className="flex justify-end space-x-2 sm:space-x-3">
//                           {/* Status Toggle Button */}
//                           {user.accountType !== "SuperAdmin" && (
//                             <button
//                               onClick={() => handleToggleUserStatus(user)}
//                               className={`transition-colors ${
//                                 user.isActive !== false 
//                                   ? "text-green-600 hover:text-green-800" 
//                                   : "text-red-600 hover:text-red-800"
//                               }`}
//                               title={user.isActive !== false ? "Deactivate User" : "Activate User"}
//                             >
//                               {user.isActive !== false ? (
//                                 <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
//                               ) : (
//                                 <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
//                               )}
//                             </button>
//                           )}
//                           <button
//                             onClick={() => handleOpenEditModal(user)}
//                             className="text-indigo-600 hover:text-indigo-900 transition-colors"
//                           >
//                             <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteUser(user._id)}
//                             className="text-red-600 hover:text-red-900 transition-colors"
//                             disabled={user.accountType === "SuperAdmin"}
//                           >
//                             <Trash2 className={`h-4 w-4 sm:h-5 sm:w-5 ${user.accountType === "SuperAdmin" ? "opacity-50 cursor-not-allowed" : ""}`} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* User Modal (Add/Edit) */}
//         {showModal && (
//           <UserModal
//             mode={modalMode}
//             user={currentUser}
//             onClose={() => setShowModal(false)}
//             onSave={handleUserSaved}
//             baseUrl={BASE_URL}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserManagement;


import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus, X, Search, UserCog, Shield, Edit, 
  Trash2, Filter, ChevronDown, CheckCircle, XCircle,
  ChevronLeft, ChevronRight
} from "lucide-react";
import Loader from './Loader';
import UserModal from '../components/AdminOrder/UserModal';

const UserManagement = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "" for all, "active", "inactive"
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const token = localStorage.getItem("token");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term, role, and status
    let result = users;

    if (searchTerm) {
      result = result.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter) {
      result = result.filter(user => user.accountType === roleFilter);
    }

    if (statusFilter === "active") {
      result = result.filter(user => user.isActive !== false);
    } else if (statusFilter === "inactive") {
      result = result.filter(user => user.isActive === false);
    }

    setFilteredUsers(result);
    // Update total pages based on filtered results
    setTotalPages(Math.ceil(result.length / usersPerPage));
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [users, searchTerm, roleFilter, statusFilter, usersPerPage]);

  const fetchUsers = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/v1/auth/getAllUsers`, {
        headers: { Authorization: `${token}` },
        withCredentials: true,
      });
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setModalMode("add");
    setCurrentUser(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (user) => {
    setModalMode("edit");
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleToggleUserStatus = async (user) => {
    if (!token) return;

    try {
      const newStatus = !user.isActive;
      const confirmMessage = newStatus 
        ? `Are you sure you want to activate ${user.firstName} ${user.lastName}'s account?` 
        : `Are you sure you want to deactivate ${user.firstName} ${user.lastName}'s account?`;

      if (window.confirm(confirmMessage)) {
        const response = await axios.put(`${BASE_URL}/api/v1/auth/updateUser/${user._id}`, {
          firstName: user.firstName,
          lastName: user.lastName,
          accountType: user.accountType,
          isActive: newStatus
        }, {
          headers: { Authorization: `${token}` },
          withCredentials: true,
        });

        if (response.data.success) {
          // Update user in state
          setUsers(users.map(u => {
            if (u._id === user._id) {
              return { ...u, isActive: newStatus };
            }
            return u;
          }));
        }
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!token) return;

    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await axios.delete(`${BASE_URL}/api/v1/auth/deleteUser/${userId}`, {
          headers: { Authorization: `${token}` },
          withCredentials: true,
        });

        if (response.data.success) {
          // Remove user from state without refetching
          setUsers(users.filter(user => user._id !== userId));
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleUserSaved = (savedUser, isNewUser) => {
    if (isNewUser) {
      // For a new user, fetch the full list again to get the proper ID and created date
      fetchUsers();
    } else {
      // For an edited user, update the user in the state
      setUsers(users.map(user => {
        if (user._id === savedUser.userId) {
          return {
            ...user,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            accountType: savedUser.accountType,
            isActive: savedUser.isActive
          };
        }
        return user;
      }));
    }
    setShowModal(false);
  };

  const renderAccountTypeTag = (type) => {
    const typeColors = {
      Admin: "bg-blue-100 text-blue-800",
      Graphics: "bg-green-100 text-green-800",
      Display: "bg-purple-100 text-purple-800",
      Accounts: "bg-yellow-100 text-yellow-800",
      SuperAdmin: "bg-red-100 text-red-800",
      Viewer: "bg-red-400 text-gray-800"
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[type] || 'bg-gray-100'}`}>
        {type}
      </span>
    );
  };

  const renderStatusIndicator = (isActive) => {
    return isActive !== false ? (
      <span className="flex items-center text-green-600">
        <CheckCircle className="h-4 w-4 mr-1" />
        <span className="text-xs">Active</span>
      </span>
    ) : (
      <span className="flex items-center text-red-600">
        <XCircle className="h-4 w-4 mr-1" />
        <span className="text-xs">Inactive</span>
      </span>
    );
  };

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Page change handlers
  const goToPage = (pageNumber) => {
    setCurrentPage(Math.min(Math.max(1, pageNumber), totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
              Manage and control user access across your organization
            </p>
          </div>
          <button
            onClick={handleAddUser}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
          >
            <Plus className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Add User
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-3 sm:p-4 border-b bg-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 justify-between">
            <div className="relative flex-1 sm:mr-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 sm:pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div className="flex space-x-2 sm:space-x-3">
              <div className="relative min-w-[120px]">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="appearance-none w-full border border-gray-300 rounded-lg py-2 px-3 sm:px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="">All Roles</option>
                  <option value="SuperAdmin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Graphics">Graphics</option>
                  <option value="Display">Display</option>
                  <option value="Accounts">Accounts</option>
                  <option value="Viewer">Viewer</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative min-w-[120px]">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none w-full border border-gray-300 rounded-lg py-2 px-3 sm:px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Created At</th>
                      <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentUsers.length > 0 ? (
                      currentUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap flex items-center">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-indigo-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                              <UserCog className="h-4 w-4 sm:h-6 sm:w-6 text-indigo-600" />
                            </div>
                            <div className="truncate max-w-[100px] sm:max-w-full">
                              <div className="text-xs sm:text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] sm:max-w-full">{user.email}</div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            {renderAccountTypeTag(user.accountType)}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            {renderStatusIndicator(user.isActive)}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                            {new Date(user.created).toLocaleDateString()}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                            <div className="flex justify-end space-x-2 sm:space-x-3">
                              {/* Status Toggle Button */}
                              {user.accountType !== "SuperAdmin" && (
                                <button
                                  onClick={() => handleToggleUserStatus(user)}
                                  className={`transition-colors ${
                                    user.isActive !== false 
                                      ? "text-green-600 hover:text-green-800" 
                                      : "text-red-600 hover:text-red-800"
                                  }`}
                                  title={user.isActive !== false ? "Deactivate User" : "Activate User"}
                                >
                                  {user.isActive !== false ? (
                                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                                  ) : (
                                    <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                                  )}
                                </button>
                              )}
                              <button
                                onClick={() => handleOpenEditModal(user)}
                                className="text-indigo-600 hover:text-indigo-900 transition-colors"
                              >
                                <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                                disabled={user.accountType === "SuperAdmin"}
                              >
                                <Trash2 className={`h-4 w-4 sm:h-5 sm:w-5 ${user.accountType === "SuperAdmin" ? "opacity-50 cursor-not-allowed" : ""}`} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500 text-sm">
                          No users found with the current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center text-sm text-gray-700">
                  <p>
                    Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastUser, filteredUsers.length)}
                    </span>{" "}
                    of <span className="font-medium">{filteredUsers.length}</span> users
                  </p>
                </div>
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                  <div className="mr-4 flex items-center">
                    <label htmlFor="usersPerPage" className="text-sm text-gray-700 mr-2">
                      Per page:
                    </label>
                    <select
                      id="usersPerPage"
                      value={usersPerPage}
                      onChange={(e) => setUsersPerPage(Number(e.target.value))}
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    {/* Page number display */}
                    <div className="hidden sm:flex space-x-1">
                      {/* First page button */}
                      {currentPage > 2 && (
                        <button
                          onClick={() => goToPage(1)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
                        >
                          1
                        </button>
                      )}

                      {/* Ellipsis for pages before current */}
                      {currentPage > 3 && (
                        <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-gray-500">
                          ...
                        </span>
                      )}

                      {/* Previous page button (if not first page) */}
                      {currentPage > 1 && (
                        <button
                          onClick={() => goToPage(currentPage - 1)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
                        >
                          {currentPage - 1}
                        </button>
                      )}

                      {/* Current page button */}
                      <button
                        className="inline-flex items-center px-3 py-1 border border-indigo-500 rounded-md text-sm font-medium bg-indigo-50 text-indigo-600"
                      >
                        {currentPage}
                      </button>

                      {/* Next page button (if not last page) */}
                      {currentPage < totalPages && (
                        <button
                          onClick={() => goToPage(currentPage + 1)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
                        >
                          {currentPage + 1}
                        </button>
                      )}

                      {/* Ellipsis for pages after current */}
                      {currentPage < totalPages - 2 && (
                        <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-gray-500">
                          ...
                        </span>
                      )}

                      {/* Last page button */}
                      {currentPage < totalPages - 1 && (
                        <button
                          onClick={() => goToPage(totalPages)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
                        >
                          {totalPages}
                        </button>
                      )}
                    </div>

                    {/* Mobile page indicator */}
                    <span className="sm:hidden text-sm text-gray-700">
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Modal (Add/Edit) */}
        {showModal && (
          <UserModal
            mode={modalMode}
            user={currentUser}
            onClose={() => setShowModal(false)}
            onSave={handleUserSaved}
            baseUrl={BASE_URL}
          />
        )}
      </div>
    </div>
  );
};

export default UserManagement;