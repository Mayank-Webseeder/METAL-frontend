// import React, { useState, useEffect } from "react";
// import { X, Download, Loader, FileText, Camera, Package, User, Calendar, List, CheckCircle, UserPlus, View } from "lucide-react";
// import axios from "axios"; 
// import toast from "react-hot-toast";

// const ViewOrderDetails = ({ order, onClose }) => {
//   const BASE_URL = import.meta.env.VITE_BASE_URL;
//   const API_PREFIX = "/api/v1/admin";
//   const [fileData, setFileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [downloadingFile, setDownloadingFile] = useState(null);
//   const [activeTab, setActiveTab] = useState("details");
//   const [displayUsers, setDisplayUsers] = useState([]);
//   const [selectedDisplayUser, setSelectedDisplayUser] = useState("");
//   const [assignLoading, setAssignLoading] = useState(false);
//   const [assignSuccess, setAssignSuccess] = useState(false);
//   const [assignError, setAssignError] = useState(null);

//   useEffect(() => {
//     if (order) {
//       fetchFileData();
//       fetchDisplayUsers();
//     }
//   }, [order]);

//   const fetchFileData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${BASE_URL}${API_PREFIX}/files/order/${order._id}`, {
//         method: "GET",
//         headers: { Authorization: `${token}` },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch file data");
//       }

//       const data = await response.json();
//       setFileData(data.data);
//     } catch (err) {
//       console.error("Error fetching file data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDisplayUsers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${BASE_URL}/api/v1/auth/getAllUsers`, {
//         headers: { Authorization: `${token}` },
//         withCredentials: true,
//       });

//       if (response.data.success) {
//         const filteredUsers = response.data.data.filter(user => user.accountType === "Display");
//         setDisplayUsers(filteredUsers);

//         // If the order is already assigned to a display user, preselect them
//         if (order.assignedTo && filteredUsers.some(user => user._id === order.assignedTo._id)) {
//           setSelectedDisplayUser(order.assignedTo._id);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching display users:", error);
//     }
//   };

//   const handleAssignOrder = async () => {
//     if (!selectedDisplayUser) {
//       setAssignError("Please select a display user");
//       return;
//     }

//     try {
//       setAssignLoading(true);
//       setAssignError(null);
//       const token = localStorage.getItem("token");

//       // Make sure we're using the correct API endpoint
//       // Note that we're now using '/api/v1/display/assignOrder/' instead of the previous path
//       const response = await axios.post(
//         `${BASE_URL}/api/v1/admin/display/assignOrder/${order._id}`,
//         { displayUserId: selectedDisplayUser },
//         {
//           headers: {
//             Authorization: `${token}`,
//             'Content-Type': 'application/json'
//           },
//           withCredentials: true,
//         }
//       );

//       if (response.data.success) {
//         setAssignSuccess(true);
//         toast.success("Order assigned successfully!");
//         // Reset success message after 3 seconds
//         setTimeout(() => setAssignSuccess(false), 3000);
//       } else {
//         setAssignError("Failed to assign order");
//         toast.error("Failed to assign order");
//       }
//     } catch (error) {
//       console.error("Error assigning order:", error);
//       setAssignError(error.response?.data?.message || "Failed to assign order");
//     } finally {
//       setAssignLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "New":
//         return "bg-gray-100 text-gray-800";
//       case "InProgress":
//         return "bg-blue-100 text-blue-800";
//       case "PendingApproval":
//         return "bg-orange-100 text-orange-800";
//       case "Approved":
//         return "bg-green-100 text-green-800";
//       case "Completed":
//         return "bg-green-100 text-green-800";
//       case "Billed":
//         return "bg-indigo-100 text-indigo-800";
//       case "Paid":
//         return "bg-emerald-100 text-emerald-800";
//       default:
//         return "bg-yellow-100 text-yellow-800";
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "New":
//         return <Package className="w-4 h-4" />;
//       case "InProgress":
//         return <Loader className="w-4 h-4" />;
//       case "PendingApproval":
//         return <List className="w-4 h-4" />;
//       case "Approved":
//       case "Completed":
//         return <CheckCircle className="w-4 h-4" />;
//       default:
//         return <Package className="w-4 h-4" />;
//     }
//   };

//   const downloadFile = async (documentId, fileType = null, downloadType = "single", fileIndex = null, filename = "") => {
//     try {
//       let url;
//       const downloadId = `${downloadType}-${fileType || "all"}-${documentId}${fileIndex !== null ? `-${fileIndex}` : ""}`;
//       setDownloadingFile(downloadId);

//       // Generate URL based on download type
//       switch (downloadType) {
//         case "all":
//           // Download all files (both CAD and images)
//           url = `${API_PREFIX}/files/download-all/${documentId}`;
//           break;
//         case "type":
//           // Download all files of a specific type (CAD or images)
//           url = `${API_PREFIX}/files/download-all-type/${documentId}?type=${fileType}`;
//           break;
//         case "single":
//           // Download a specific file
//           url = `${API_PREFIX}/files/download/${documentId}/${fileIndex}?type=${fileType}`;
//           break;
//         default:
//           throw new Error("Invalid download type");
//       }

//       const token = localStorage.getItem("token");
//       const fullUrl = `${BASE_URL}${url}`;

//       const response = await fetch(fullUrl, {
//         method: 'GET',
//         headers: {
//           'Authorization': `${token}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to download file');
//       }

//       const blob = await response.blob();
//       const downloadUrl = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = downloadUrl;
//       link.download = filename || `${fileType || "all"}_files_${order.orderId}.zip`;
//       document.body.appendChild(link);
//       link.click();

//       // Clean up
//       window.URL.revokeObjectURL(downloadUrl);
//       document.body.removeChild(link);

//     } catch (err) {
//       console.error("Error downloading file:", err);
//     } finally {
//       // Clear downloading state after a short delay
//       setTimeout(() => setDownloadingFile(null), 1000);
//     }
//   };
//   console.log("order", fileData);

//   const renderDetailsTab = () => (
//     <div className="space-y-8">
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="flex items-center border-b border-gray-100">
//           <div className="w-1/2 p-5 border-r border-gray-100">
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="bg-blue-50 p-2 rounded-lg">
//                 <Package className="h-5 w-5 text-blue-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800">Order Information</h3>
//             </div>
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-sm font-medium text-gray-500">Order ID</span>
//                 <span className="text-sm font-semibold">{order.orderId}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-sm font-medium text-gray-500">Status</span>
//                 <div className="flex items-center space-x-1">
//                   {getStatusIcon(order.status)}
//                   <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
//                     {order.status}
//                   </span>
//                 </div>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-sm font-medium text-gray-500">Created</span>
//                 <span className="text-sm">{order.created}</span>
//               </div>
//             </div>
//           </div>

//           <div className="w-1/2 p-5">
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="bg-indigo-50 p-2 rounded-lg">
//                 <User className="h-5 w-5 text-indigo-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800">Customer Details</h3>
//             </div>
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-sm font-medium text-gray-500">Customer Name</span>
//                 <span className="text-sm font-semibold">{order.customer?.name}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-sm font-medium text-gray-500">Email Id</span>
//                 <span className="text-sm font-semibold">{order.customer?.email}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-sm font-medium text-gray-500">Assigned To</span>
//                 <span className="text-sm">
//                   {order.assignedTo
//                     ? `${order.assignedTo.firstName} ${order.assignedTo.lastName}`
//                     : "Not Assigned"}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="p-5">
//           <div className="flex items-center space-x-3 mb-3">
//             <div className="bg-green-50 p-2 rounded-lg">
//               <List className="h-5 w-5 text-green-600" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-800">Requirements</h3>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm leading-relaxed">
//             {order.requirements || "No specific requirements provided"}
//           </div>
//         </div>
//       </div>

//       {order.image && order.image.length > 0 && (
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="flex items-center space-x-3 p-5 border-b border-gray-100">
//             <div className="bg-rose-50 p-2 rounded-lg">
//               <Camera className="h-5 w-5 text-rose-600" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-800">Order Images</h3>
//           </div>
//           <div className="p-5">
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//               {order.image.map((img, index) => (
//                 <div key={index} className="group relative rounded-lg overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md">
//                   <img
//                     src={`${BASE_URL}${img}`}
//                     alt={`Order image ${index + 1}`}
//                     className="w-full h-32 object-cover"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-start p-3">
//                     <span className="text-white text-xs font-medium">Image {index + 1}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );



//   if (!order) return null;
//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
//         <div className="sticky top-0 bg-white px-6 py-4 flex justify-between items-center border-b z-10">
//           <div className="flex items-center space-x-3">
//             <div className="bg-blue-100 p-2 rounded-full">
//               <Package className="h-5 w-5 text-blue-600" />
//             </div>
//             <h2 className="text-xl font-bold text-gray-800">Order #{order.orderId}</h2>
//             <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
//               {order.status}
//             </span>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>
//         <div className="flex border-b bg-gray-50">
//           <button
//             onClick={() => setActiveTab("details")}
//             className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "details"
//                 ? "border-b-2 border-blue-600 text-blue-600 bg-white"
//                 : "text-gray-600 hover:text-gray-800"
//               }`}
//           >
//             Order Details
//           </button>
       
         
        
//         </div>

//         <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
//           {activeTab === "details"
//             ? renderDetailsTab()
   

//                     : null}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewOrderDetails;


import React, { useState, useEffect } from "react";
import { X, Download, Loader, FileText, Camera, Package, User, Calendar, List, CheckCircle, UserPlus, View } from "lucide-react";
import axios from "axios"; 
import toast from "react-hot-toast";

const ViewOrderDetails = ({ order, onClose }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PREFIX = "/api/v1/admin";
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (order) {
      fetchFileData();
      fetchDisplayUsers();
    }
  }, [order]);

  const fetchFileData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}${API_PREFIX}/files/order/${order._id}`, {
        method: "GET",
        headers: { Authorization: `${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch file data");
      }

      const data = await response.json();
      setFileData(data.data);
    } catch (err) {
      console.error("Error fetching file data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDisplayUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/v1/auth/getAllUsers`, {
        headers: { Authorization: `${token}` },
        withCredentials: true,
      });

      if (response.data.success) {
        const filteredUsers = response.data.data.filter(user => user.accountType === "Display");
        setDisplayUsers(filteredUsers);

        // If the order is already assigned to a display user, preselect them
        if (order.assignedTo && filteredUsers.some(user => user._id === order.assignedTo._id)) {
          setSelectedDisplayUser(order.assignedTo._id);
        }
      }
    } catch (error) {
      console.error("Error fetching display users:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-gray-100 text-gray-800";
      case "InProgress":
        return "bg-blue-100 text-blue-800";
      case "PendingApproval":
        return "bg-orange-100 text-orange-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Billed":
        return "bg-indigo-100 text-indigo-800";
      case "Paid":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "New":
        return <Package className="w-4 h-4" />;
      case "InProgress":
        return <Loader className="w-4 h-4" />;
      case "PendingApproval":
        return <List className="w-4 h-4" />;
      case "Approved":
      case "Completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const renderDetailsTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Order Information</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Order ID</span>
              <span className="text-sm font-semibold">{order.orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Status</span>
              <div className="flex items-center space-x-1">
                {getStatusIcon(order.status)}
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Created</span>
              <span className="text-sm">{order.created}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Assigned To</span>
              <span className="text-sm">
                {order.assignedTo
                  ? `${order.assignedTo.firstName} ${order.assignedTo.lastName}`
                  : "Not Assigned"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-green-50 p-2 rounded-lg">
              <List className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Requirements</h3>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm leading-relaxed">
            {order.requirements || "No specific requirements provided"}
          </div>
        </div>
      </div>

      {order.image && order.image.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center space-x-3 p-5 border-b border-gray-100">
            <div className="bg-rose-50 p-2 rounded-lg">
              <Camera className="h-5 w-5 text-rose-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Order Images</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {order.image.map((img, index) => (
                <div key={index} className="group relative rounded-lg overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md">
                  <img
                    src={`${BASE_URL}${img}`}
                    alt={`Order image ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-start p-3">
                    <span className="text-white text-xs font-medium">Image {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!order) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-white px-6 py-4 flex justify-between items-center border-b z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Order #{order.orderId}</h2>
            <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex border-b bg-gray-50">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "details"
                ? "border-b-2 border-blue-600 text-blue-600 bg-white"
                : "text-gray-600 hover:text-gray-800"
              }`}
          >
            Order Details
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {activeTab === "details" ? renderDetailsTab() : null}
        </div>
      </div>
    </div>
  );
};

export default ViewOrderDetails;