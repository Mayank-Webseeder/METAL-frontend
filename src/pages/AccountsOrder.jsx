

// import { useState, useEffect } from "react";
// import { 
//   RefreshCw, 
//   ChevronDown, 
//   Search, 
//   Package, 
//   AlertCircle,
//   DollarSign,
//   FileText,
//   User,
//   Clock,
//   Eye,
//   ChevronLeft,
//   ChevronRight
// } from "lucide-react";
// import Loader from './Loader';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AccountOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updateStatus, setUpdateStatus] = useState({ loading: false, error: null, success: null });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
  
//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [ordersPerPage, setOrdersPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [paginatedOrders, setPaginatedOrders] = useState([]);
  
//   const BASE_URL = import.meta.env.VITE_BASE_URL;
  
//   // Status options
//   const statusOptions = [ "accounts_pending",
//     "accounts_billed",
//     "accounts_paid",];
  
//   // Status color mapping
//   const statusColors = {
 
//     "accounts_pending": "bg-yellow-100 text-yellow-800",
//     "accounts_billed": "bg-purple-100 text-purple-800",
//     "accounts_paid": "bg-emerald-100 text-emerald-800",
 
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);
  
//   useEffect(() => {
//     // Filter orders based on search term and status
//     let result = orders;
    
//     if (searchTerm) {
//       result = result.filter(order => 
//         (order.orderId && order.orderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (order._id && order._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (order.customer && order.customer.name && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (order.customer && order.customer.email && order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//     }

//     if (statusFilter) {
//       result = result.filter(order => order.status === statusFilter);
//     }

//     setFilteredOrders(result);
//     setTotalPages(Math.ceil(result.length / ordersPerPage));
//     setCurrentPage(1); // Reset to first page when filters change
//   }, [orders, searchTerm, statusFilter, ordersPerPage]);
  
//   // Update paginated orders when filtered orders or pagination settings change
//   useEffect(() => {
//     const startIndex = (currentPage - 1) * ordersPerPage;
//     const endIndex = startIndex + ordersPerPage;
//     setPaginatedOrders(filteredOrders.slice(startIndex, endIndex));
//   }, [filteredOrders, currentPage, ordersPerPage]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
      
//       // Use the correct API endpoint path
//       const endpoint = `${BASE_URL}/api/v1/admin/accounts/getAssignedOrders`;
        
//       const response = await fetch(endpoint, {
//         method: "GET",
//         headers: { Authorization: `${token}` },
//       });
      
//       if (!response.ok) throw new Error("Failed to fetch orders");
      
//       const data = await response.json();
//       console.log("Fetched account orders data:", data);
      
//       // Handle the data structure correctly
//       if (data.success && Array.isArray(data.data)) {
//         setOrders(data.data);
//         setFilteredOrders(data.data);
//         setTotalPages(Math.ceil(data.data.length / ordersPerPage));
//         setError(null);
//         //toast.success("Orders fetched successfully");
//       } else {
//         throw new Error("Invalid data format received from API");
//       }
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       toast.error(`Error fetching orders: ${error.message}`); 
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateBill = async (orderId) => {
//     try {
//       setUpdateStatus({ loading: true, error: null, success: null });
//       const token = localStorage.getItem("token");
      
//       const response = await fetch(`${BASE_URL}/api/v1/admin/accounts/createBill`, {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json",
//           "Authorization": `${token}` 
//         },
//         body: JSON.stringify({ orderId })
//       });
      
//       const result = await response.json();
      
//       if (!response.ok) {
//         throw new Error(result.message || "Failed to create bill");
//       }
      
//       // Update the local state to reflect the change
//       setOrders(orders.map(order => 
//         order._id === orderId ? { ...order, status: "Billed" } : order
//       ));
      
//       setUpdateStatus({ 
//         loading: false, 
//         error: null, 
//         success: `Bill created successfully` 
//       });
      
//       toast.success("Bill created successfully");
      
//       // Refresh orders to get updated data
//       fetchOrders();
      
//     } catch (error) {
//       console.error("Error creating bill:", error);
//       setUpdateStatus({ 
//         loading: false, 
//         error: error.message, 
//         success: null 
//       });
      
//       toast.error(`Failed to create bill: ${error.message}`);
//     }
//   };

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//   };

//   const handleRowsPerPageChange = (e) => {
//     setOrdersPerPage(Number(e.target.value));
//     setCurrentPage(1); // Reset to first page when changing rows per page
//   };

//   const renderStatusBadge = (status) => {
//     return (
//       <span 
//         className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
//       >
//         {status}
//       </span>
//     );
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
    
//     const date = new Date(dateString);
//     return date.toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const renderFinancialStatus = (order) => {
//     if (order.status === "accounts_paid") {
//       return (
//         <div className="flex items-center text-green-600">
//           <DollarSign className="h-4 w-4 mr-1" />
//           <span className="text-xs font-medium">Paid</span>
//         </div>
//       );
//     } else if (order.status === "accounts_billed") {
//       return (
//         <div className="flex items-center text-purple-600">
//           <FileText className="h-4 w-4 mr-1" />
//           <span className="text-xs font-medium">Billed</span>
//         </div>
//       );
//     } else if (order.status === "accounts_pending" || order.status === "cutout_completed") {
//       return (
//         <div className="flex items-center text-amber-600">
//           <Clock className="h-4 w-4 mr-1" />
//           <span className="text-xs font-medium">Ready for Billing</span>
//         </div>
//       );
//     } else {
//       return (
//         <div className="flex items-center text-gray-600">
//           <Clock className="h-4 w-4 mr-1" />
//           <span className="text-xs font-medium">Not Ready</span>
//         </div>
//       );
//     }
//   };

//   const renderPagination = () => {
//     // If we have no pages or only one page, don't show pagination
//     if (totalPages <= 1) return null;
    
//     // Calculate pages to show in pagination (show up to 5 page buttons)
//     let pages = [];
//     const maxPagesToShow = 5;
    
//     let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
//     let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
//     // Adjust startPage if we're near the end
//     if (endPage - startPage + 1 < maxPagesToShow) {
//       startPage = Math.max(1, endPage - maxPagesToShow + 1);
//     }
    
//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }
    
//     return (
//       <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
//         <div className="flex flex-1 justify-between sm:hidden">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
//               currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
//             }`}
//           >
//             Previous
//           </button>
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
//               currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
//             }`}
//           >
//             Next
//           </button>
//         </div>
//         <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
//           <div>
//             <p className="text-sm text-gray-700">
//               Showing <span className="font-medium">{paginatedOrders.length > 0 ? (currentPage - 1) * ordersPerPage + 1 : 0}</span> to{" "}
//               <span className="font-medium">{Math.min(currentPage * ordersPerPage, filteredOrders.length)}</span> of{" "}
//               <span className="font-medium">{filteredOrders.length}</span> results
//             </p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center">
//               <span className="mr-2 text-sm text-gray-700">Rows per page:</span>
//               <select 
//                 value={ordersPerPage} 
//                 onChange={handleRowsPerPageChange}
//                 className="border border-gray-300 rounded-md text-sm py-1 px-2"
//               >
//                 <option value={5}>5</option>
//                 <option value={10}>10</option>
//                 <option value={25}>25</option>
//                 <option value={50}>50</option>
//               </select>
//             </div>
//             <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ${
//                   currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
//                 }`}
//               >
//                 <span className="sr-only">Previous</span>
//                 <ChevronLeft className="h-5 w-5" aria-hidden="true" />
//               </button>
//               {pages.map(page => (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange(page)}
//                   className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
//                     page === currentPage
//                       ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
//                       : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}
//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ${
//                   currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
//                 }`}
//               >
//                 <span className="sr-only">Next</span>
//                 <ChevronRight className="h-5 w-5" aria-hidden="true" />
//               </button>
//             </nav>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8">
//       <ToastContainer position="top-right" autoClose={3000} />
      
//       <div className="container mx-auto">
   
        
//         {/* Debug section - will show raw count of orders being fetched */}
//         <div className="mb-4 text-sm text-gray-600">
//           Total orders fetched: {orders.length} | Filtered orders: {filteredOrders.length}
//         </div>
        
//         {/* Status update feedback messages */}
//         {updateStatus.loading && (
//           <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-lg mb-4 flex items-center">
//             <RefreshCw className="animate-spin h-4 w-4 mr-2" />
//             Processing request...
//           </div>
//         )}
        
//         {updateStatus.error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 flex items-center">
//             <AlertCircle className="h-4 w-4 mr-2" />
//             {updateStatus.error}
//           </div>
//         )}
        
//         {updateStatus.success && (
//           <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4">
//             {updateStatus.success}
//           </div>
//         )}

//         <div className="bg-white shadow-lg rounded-xl overflow-hidden">
//           <div className="p-3 sm:p-4 border-b bg-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 justify-between">
//             <div className="relative flex-1 sm:mr-4">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by order ID, customer name or email..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-9 sm:pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//               />
//             </div>
//             <div className="relative min-w-[140px]">
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="appearance-none w-full border border-gray-300 rounded-lg py-2 px-3 sm:px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//               >
//                 <option value="">All Statuses</option>
//                 {statusOptions.map(status => (
//                   <option key={status} value={status}>
//                     {status}
//                   </option>
//                 ))}
//               </select>
//               <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//             </div>
            
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <Loader />
//             </div>
//           ) : error ? (
//             <div className="p-8 text-center">
//               <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
//               <p className="text-red-500 font-medium">Error: {error}</p>
//               <button 
//                 onClick={fetchOrders}
//                 className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
//               >
//                 Try Again
//               </button>
//             </div>
//           ) : filteredOrders.length === 0 ? (
//             <div className="p-8 text-center">
//               <Package className="h-10 w-10 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-600">No orders currently assigned to accounts</p>
//             </div>
//           ) : (
//             <div className="">
//               <table className="w-full">
//                 <thead className="bg-gray-100 border-b">
//                   <tr>
//                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
//                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Customer Address</th>
//                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Financial Status</th>
//                     <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Date Created</th>
//                     <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {paginatedOrders.map((order) => (
//                     <tr key={order._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
//                         <div className="text-xs sm:text-sm font-medium text-gray-900">
//                           {order.orderId || order._id}
//                         </div>
//                       </td>
//                       <td className="px-3 sm:px-6 py-3 sm:py-4">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
//                             <User className="h-4 w-4 text-gray-500" />
//                           </div>
//                           <div className="ml-3">
//                             <div className="text-xs sm:text-sm font-medium text-gray-900">
//                               {order.customer ? order.customer.name : 'Unknown'}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               {order.customer ? order.customer.email : 'No email'}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
//                         <div className="text-xs sm:text-sm text-gray-500">
//                           {order.customer && order.customer.address ? (
//                             <div>
//                               <div>{order.customer.address.city || 'N/A'}</div>
//                               <div>
//                                 {order.customer.address.state || 'N/A'}, 
//                                 {order.customer.address.country || 'N/A'}
//                               </div>
//                             </div>
//                           ) : (
//                             <span>No address information</span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
//                         {renderStatusBadge(order.status)}
//                       </td>
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
//                         {renderFinancialStatus(order)}
//                       </td>
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
//                         {formatDate(order.createdAt)}
//                       </td>
//                       <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
//                         <div className="flex items-center justify-end space-x-2">
//                           {(order.status === "Completed" || order.status === "InAccountSection") && (
//                             <button
//                               onClick={() => handleCreateBill(order._id)}
//                               className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs flex items-center"
//                               title="Create Bill"
//                             >
//                               <FileText className="h-3 w-3 mr-1" /> Create Bill
//                             </button>
//                           )}
                          
//                           <button
//                             className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex items-center"
//                             title="View Order Details"
//                           >
//                             <Eye className="h-3 w-3 mr-1" /> Details
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
              
//               {/* Pagination component */}
//               {renderPagination()}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountOrders;



import { useState, useEffect } from "react";
import { 
  RefreshCw, 
  ChevronDown, 
  Search, 
  Package, 
  AlertCircle,
  DollarSign,
  FileText,
  User,
  Clock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Loader from './Loader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSocketEvents } from "../hooks/useSocketEvents";

const AccountOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState({ loading: false, error: null, success: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedOrders, setPaginatedOrders] = useState([]);
  
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  
  // Status options
  const statusOptions = [
    "accounts_pending",
    "accounts_billed",
    "accounts_paid"
  ];
  
  // Status color mapping
  const statusColors = {
    "accounts_pending": "bg-yellow-100 text-yellow-800",
    "accounts_billed": "bg-purple-100 text-purple-800",
    "accounts_paid": "bg-emerald-100 text-emerald-800",
  };

  // Socket event handler for order updates
  const setStatusHandler = (data) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === data.orderId
          ? { ...order, ...data.order }
          : order
      )
    );

    // Show a toast notification
    toast.info(`Order #${data.order.orderId} has been updated`);
  };

  useSocketEvents({
    "orderUpdated": setStatusHandler,
  });

  useEffect(() => {
    fetchOrders();
  }, []);
  
  useEffect(() => {
    // Filter orders based on search term and status
    let result = orders;
    
    if (searchTerm) {
      result = result.filter(order => 
        (order.orderId && order.orderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order._id && order._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.customer && order.customer.name && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.customer && order.customer.email && order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter) {
      result = result.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(result);
    setTotalPages(Math.ceil(result.length / ordersPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [orders, searchTerm, statusFilter, ordersPerPage]);
  
  // Update paginated orders when filtered orders or pagination settings change
  useEffect(() => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    setPaginatedOrders(filteredOrders.slice(startIndex, endIndex));
  }, [filteredOrders, currentPage, ordersPerPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Use the correct API endpoint path
      const endpoint = `${BASE_URL}/api/v1/admin/accounts/getAssignedOrders`;
        
      const response = await fetch(endpoint, {
        method: "GET",
        headers: { Authorization: `${token}` },
      });
      
      if (!response.ok) throw new Error("Failed to fetch orders");
      
      const data = await response.json();
      console.log("Fetched account orders data:", data);
      
      // Handle the data structure correctly
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
        setFilteredOrders(data.data);
        setTotalPages(Math.ceil(data.data.length / ordersPerPage));
        setError(null);
      } else {
        throw new Error("Invalid data format received from API");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(`Error fetching orders: ${error.message}`); 
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      setUpdateStatus({ loading: true, error: null, success: null });
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/api/v1/admin/accounts/updateStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`
        },
        body: JSON.stringify({ orderId, status })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update status");
      }

      // Update the local state to reflect the change
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status } : order
      ));

      setUpdateStatus({
        loading: false,
        error: null,
        success: `Order status updated to ${status}`
      });

      toast.success(`Order status updated to ${status}`);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateStatus(prev => ({ ...prev, success: null }));
      }, 3000);

    } catch (error) {
      console.error("Error updating status:", error);
      setUpdateStatus({
        loading: false,
        error: error.message,
        success: null
      });

      toast.error(`Failed to update status: ${error.message}`);

      // Clear error message after 5 seconds
      setTimeout(() => {
        setUpdateStatus(prev => ({ ...prev, error: null }));
      }, 5000);
    }
  };
 
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (e) => {
    setOrdersPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const renderStatusBadge = (status) => {
    return (
      <span 
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
      >
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderFinancialStatus = (order) => {
    if (order.status === "accounts_paid") {
      return (
        <div className="flex items-center text-green-600">
          <DollarSign className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">Paid</span>
        </div>
      );
    } else if (order.status === "accounts_billed") {
      return (
        <div className="flex items-center text-purple-600">
          <FileText className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">Billed</span>
        </div>
      );
    } else if (order.status === "accounts_pending" || order.status === "cutout_completed") {
      return (
        <div className="flex items-center text-amber-600">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">Ready for Billing</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-gray-600">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">Not Ready</span>
        </div>
      );
    }
  };

  const renderPagination = () => {
    // If we have no pages or only one page, don't show pagination
    if (totalPages <= 1) return null;
    
    // Calculate pages to show in pagination (show up to 5 page buttons)
    let pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{paginatedOrders.length > 0 ? (currentPage - 1) * ordersPerPage + 1 : 0}</span> to{" "}
              <span className="font-medium">{Math.min(currentPage * ordersPerPage, filteredOrders.length)}</span> of{" "}
              <span className="font-medium">{filteredOrders.length}</span> results
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-700">Rows per page:</span>
              <select 
                value={ordersPerPage} 
                onChange={handleRowsPerPageChange}
                className="border border-gray-300 rounded-md text-sm py-1 px-2"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ${
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              {pages.map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    page === currentPage
                      ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ${
                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="container mx-auto">
        {/* Debug section - will show raw count of orders being fetched */}
        <div className="mb-4 text-sm text-gray-600">
          Total orders fetched: {orders.length} | Filtered orders: {filteredOrders.length}
        </div>
        
        {/* Status update feedback messages */}
        {updateStatus.loading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-lg mb-4 flex items-center">
            <RefreshCw className="animate-spin h-4 w-4 mr-2" />
            Processing request...
          </div>
        )}
        
        {updateStatus.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {updateStatus.error}
          </div>
        )}
        
        {updateStatus.success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4">
            {updateStatus.success}
          </div>
        )}

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-3 sm:p-4 border-b bg-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 justify-between">
            <div className="relative flex-1 sm:mr-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, customer name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 sm:pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div className="relative min-w-[140px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none w-full border border-gray-300 rounded-lg py-2 px-3 sm:px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="">All Statuses</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
              <p className="text-red-500 font-medium">Error: {error}</p>
              <button 
                onClick={fetchOrders}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orders currently assigned to accounts</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Customer Address</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Financial Status</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Date Created</th>
                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-medium text-gray-900">
                          {order.orderId || order._id}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <div className="text-xs sm:text-sm font-medium text-gray-900">
                              {order.customer ? order.customer.name : 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.customer ? order.customer.email : 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                        <div className="text-xs sm:text-sm text-gray-500">
                          {order.customer && order.customer.address ? (
                            <div>
                              <div>{order.customer.address.city || 'N/A'}</div>
                              <div>
                                {order.customer.address.state || 'N/A'}, 
                                {order.customer.address.country || 'N/A'}
                              </div>
                            </div>
                          ) : (
                            <span>No address information</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        {renderStatusBadge(order.status)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        {renderFinancialStatus(order)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                        <div className="flex items-center justify-end">
                          <div className="relative">
                            <select
                              className="text-xs sm:text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                              value={order.status || ""}
                            >
                              <option value="" disabled>Status</option>
                              {statusOptions.map(status => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination component */}
              {renderPagination()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountOrders;

