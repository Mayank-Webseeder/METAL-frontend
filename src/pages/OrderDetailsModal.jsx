// import React, { useState, useEffect } from "react";
// import { X, Download, Loader } from "lucide-react";
// import axios from "axios"

// const OrderDetailsModal = ({ order, onClose }) => {
//   const BASE_URL = import.meta.env.VITE_BASE_URL;
//   const API_PREFIX = "/api/v1/admin"; // Add API prefix based on your route definition
//   const [fileData, setFileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [downloadingFile, setDownloadingFile] = useState(null);

//   useEffect(() => {
//     if (order) {
//       fetchFileData();
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
//       setError("Failed to load file information. Please try again later.");
//     } finally {
//       setLoading(false);
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

// const downloadFile = (documentId, fileIndex = null, fileType = null, isAllFiles = false, filename = "") => {
//     try {
//       // Generate URL based on parameters
//       let url;
      
//       if (isAllFiles) {
//         // Download all files for a document
//         url = `${API_PREFIX}/files/download-all/${documentId}`;
//         setDownloadingFile(`all-${documentId}`);
//       } else if (fileType && fileIndex === null) {
//         // Download all files of a specific type
//         url = `${API_PREFIX}/files/download-all-type/${documentId}?type=${fileType}`;
//         setDownloadingFile(`${fileType}-${documentId}`);
//       } else if (fileIndex !== null && fileType) {
//         // Download a specific file
//         url = `${API_PREFIX}/files/download/${documentId}/${fileIndex}?type=${fileType}`;
//         setDownloadingFile(`${fileType}-${documentId}-${fileIndex}`);
//       } else {
//         console.error("Invalid download parameters");
//         return;
//       }
      
//       const token = localStorage.getItem("token");
//       console.log("kamal token", token);
//       const fullUrl = `${BASE_URL}${url}`;
      
//       // Instead of creating a link and adding the token as query parameter,
//       // make a fetch request with Authorization header
//       fetch(fullUrl, {
//         method: 'GET',
//         headers: {
//           'Authorization': `${token}`
//         }
//       })
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Failed to download file');
//         }
//         return response.blob();
//       })
//       .then(blob => {
//         // Create URL for the blob
//         const url = window.URL.createObjectURL(blob);
        
//         // Create a temporary anchor element for download
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = filename || "";
        
//         // Trigger the download
//         document.body.appendChild(link);
//         link.click();
        
//         // Clean up
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(link);
//       })
//       .catch(err => {
//         console.error("Error downloading file:", err);
//       })
//       .finally(() => {
//         // Clear downloading state after a short delay
//         setTimeout(() => setDownloadingFile(null), 1000);
//       });
      
//     } catch (err) {
//       console.error("Error downloading file:", err);
//       setDownloadingFile(null);
//     }
//   };

//   if (!order) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="sticky top-0 bg-gray-100 p-4 flex justify-between items-center border-b">
//           <h2 className="text-xl font-bold">Order Details - #{order.orderId}</h2>
//           <button
//             onClick={onClose}
//             className="p-1 rounded-full hover:bg-gray-200 transition-colors"
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>

//         <div className="p-6">
//           {/* Order details section */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Order Information</h3>
//               <div className="space-y-3">
//                 <p>
//                   <span className="font-medium text-gray-600">Order ID:</span>{" "}
//                   {order.orderId}
//                 </p>
//                 <p>
//                   <span className="font-medium text-gray-600">Customer:</span>{" "}
//                   {order.customer?.name}
//                 </p>
//                 <p>
//                   <span className="font-medium text-gray-600">Created:</span>{" "}
//                   {order.created}
//                 </p>
//                 <p>
//                   <span className="font-medium text-gray-600">Status:</span>{" "}
//                   <span
//                     className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
//                       order.status
//                     )}`}
//                   >
//                     {order.status}
//                   </span>
//                 </p>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
//               <div className="space-y-3">
//                 <p>
//                   <span className="font-medium text-gray-600">Assigned To:</span>{" "}
//                   {order.assignedTo
//                     ? `${order.assignedTo.firstName} ${order.assignedTo.lastName}`
//                     : "Not Assigned"}
//                 </p>
//                 <p>
//                   <span className="font-medium text-gray-600">Requirements:</span>{" "}
//                 </p>
//                 <p className="text-gray-800 bg-gray-50 p-3 rounded-md">
//                   {order.requirements || "No specific requirements provided"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Order images preview */}
//           {order.image && order.image.length > 0 && (
//             <div className="mb-8">
//               <h3 className="text-lg font-semibold mb-4">Order Images</h3>
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {order.image.map((img, index) => (
//                   <div key={index} className="relative">
//                     <img 
//                       src={`${BASE_URL}${img}`} 
//                       alt={`Order image ${index + 1}`}
//                       className="w-full h-32 object-cover rounded-md"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Files section */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Files</h3>
            
//             {loading ? (
//               <div className="flex justify-center items-center py-10">
//                 <Loader className="animate-spin h-8 w-8 text-gray-500" />
//               </div>
//             ) : error ? (
//               <div className="bg-red-50 text-red-700 p-4 rounded-md">
//                 {error}
//               </div>
//             ) : fileData && fileData.length > 0 ? (
//               <div className="space-y-6">
//                 {fileData.map((doc) => (
//                   <div key={doc.id} className="border rounded-lg overflow-hidden">
//                     <div className="bg-gray-50 px-4 py-3 border-b">
//                       <div className="flex justify-between items-center">
//                         <span className="font-medium">File Group</span>
//                         <div className="space-x-2">
//                           <button
//                             onClick={() => downloadFile(doc.id, null, null, true, `all_files_${order.orderId}.zip`)}
//                             disabled={downloadingFile === `all-${doc.id}`}
//                             className={`inline-flex items-center px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed`}
//                           >
//                             {downloadingFile === `all-${doc.id}` ? (
//                               <>
//                                 <Loader className="h-4 w-4 mr-1 animate-spin" /> Downloading...
//                               </>
//                             ) : (
//                               <>
//                                 <Download className="h-4 w-4 mr-1" /> Download All
//                               </>
//                             )}
//                           </button>
//                         </div>
//                       </div>
//                     </div>
                    
//                     {/* CAD files */}
//                     {doc.cadFiles && doc.cadFiles.length > 0 && (
//                       <div className="p-4 border-b">
//                         <div className="flex justify-between items-center mb-2">
//                           <h4 className="font-medium">CAD Files</h4>
//                           <button
//                             onClick={() => downloadFile(doc.id, null, "cad", false, `cad_files_${order.orderId}.zip`)}
//                             disabled={downloadingFile === `cad-${doc.id}`}
//                             className={`inline-flex items-center px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed`}
//                           >
//                             {downloadingFile === `cad-${doc.id}` ? (
//                               <Loader className="h-3 w-3 mr-1 animate-spin" />
//                             ) : (
//                               <Download className="h-3 w-3 mr-1" />
//                             )}
//                             All CAD Files
//                           </button>
//                         </div>
//                         <div className="overflow-x-auto">
//                           <table className="min-w-full">
//                             <thead>
//                               <tr className="bg-gray-50">
//                                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filename</th>
//                                 <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//                               </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-200">
//                               {doc.cadFiles.map((file) => (
//                                 <tr key={file.index} className="hover:bg-gray-50">
//                                   <td className="px-4 py-2 text-sm">{file.filename}</td>
//                                   <td className="px-4 py-2 text-right">
//                                     <button
//                                       onClick={() => downloadFile(doc.id, file.index, "cad", false, file.filename)}
//                                       disabled={downloadingFile === `cad-${doc.id}-${file.index}`}
//                                       className={`inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed`}
//                                     >
//                                       {downloadingFile === `cad-${doc.id}-${file.index}` ? (
//                                         <Loader className="h-3 w-3 mr-1 animate-spin" />
//                                       ) : (
//                                         <Download className="h-3 w-3 mr-1" />
//                                       )}
//                                       Download
//                                     </button>
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>
//                     )}
                    
//                     {/* Image files */}
//                     {doc.images && doc.images.length > 0 && (
//                       <div className="p-4">
//                         <div className="flex justify-between items-center mb-2">
//                           <h4 className="font-medium">Images</h4>
//                           <button
//                             onClick={() => downloadFile(doc.id, null, "image", false, `images_${order.orderId}.zip`)}
//                             disabled={downloadingFile === `image-${doc.id}`}
//                             className={`inline-flex items-center px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed`}
//                           >
//                             {downloadingFile === `image-${doc.id}` ? (
//                               <Loader className="h-3 w-3 mr-1 animate-spin" />
//                             ) : (
//                               <Download className="h-3 w-3 mr-1" />
//                             )}
//                             All Images
//                           </button>
//                         </div>
//                         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                           {doc.images.map((img) => (
//                             <div key={img.index} className="relative group">
//                               <img 
//                                 src={`${BASE_URL}${img.path}`} 
//                                 alt={img.filename}
//                                 className="w-full h-24 object-cover rounded-md"
//                               />
//                               <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                                 <button
//                                   onClick={() => downloadFile(doc.id, img.index, "image", false, img.filename)}
//                                   disabled={downloadingFile === `image-${doc.id}-${img.index}`}
//                                   className="p-1 bg-white rounded-full hover:bg-gray-100 disabled:bg-gray-200"
//                                 >
//                                   {downloadingFile === `image-${doc.id}-${img.index}` ? (
//                                     <Loader className="h-4 w-4 animate-spin" />
//                                   ) : (
//                                     <Download className="h-4 w-4" />
//                                   )}
//                                 </button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="bg-gray-50 text-gray-600 p-4 rounded-md text-center">
//                 No files available for this order.
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetailsModal;



import React, { useState, useEffect } from "react";
import { X, Download, Loader, FileText, Camera, Package, User, Calendar, List, CheckCircle } from "lucide-react";
import axios from "axios";

const OrderDetailsModal = ({ order, onClose }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PREFIX = "/api/v1/admin"; // Add API prefix based on your route definition
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingFile, setDownloadingFile] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (order) {
      fetchFileData();
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
    //   setError("Failed to load file information. Please try again later.");
    } finally {
      setLoading(false);
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

  const downloadFile = (documentId, fileIndex = null, fileType = null, isAllFiles = false, filename = "") => {
    try {
      // Generate URL based on parameters
      let url;
      
      if (isAllFiles) {
        // Download all files for a document
        url = `${API_PREFIX}/files/download-all/${documentId}`;
        setDownloadingFile(`all-${documentId}`);
      } else if (fileType && fileIndex === null) {
        // Download all files of a specific type
        url = `${API_PREFIX}/files/download-all-type/${documentId}?type=${fileType}`;
        setDownloadingFile(`${fileType}-${documentId}`);
      } else if (fileIndex !== null && fileType) {
        // Download a specific file
        url = `${API_PREFIX}/files/download/${documentId}/${fileIndex}?type=${fileType}`;
        setDownloadingFile(`${fileType}-${documentId}-${fileIndex}`);
      } else {
        console.error("Invalid download parameters");
        return;
      }
      
      const token = localStorage.getItem("token");
      console.log(" token", token);
      const fullUrl = `${BASE_URL}${url}`;
      
      // Instead of creating a link and adding the token as query parameter,
      // make a fetch request with Authorization header
      fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to download file');
        }
        return response.blob();
      })
      .then(blob => {
        // Create URL for the blob
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary anchor element for download
        const link = document.createElement("a");
        link.href = url;
        link.download = filename || "";
        
        // Trigger the download
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      })
      .catch(err => {
        console.error("Error downloading file:", err);
      })
      .finally(() => {
        // Clear downloading state after a short delay
        setTimeout(() => setDownloadingFile(null), 1000);
      });
      
    } catch (err) {
      console.error("Error downloading file:", err);
      setDownloadingFile(null);
    }
  };

  const renderDetailsTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center border-b border-gray-100">
          <div className="w-1/2 p-5 border-r border-gray-100">
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
            </div>
          </div>
          
          <div className="w-1/2 p-5">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-indigo-50 p-2 rounded-lg">
                <User className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Customer Details</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Customer Name</span>
                <span className="text-sm font-semibold">{order.customer?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Email Id</span>
                <span className="text-sm font-semibold">{order.customer?.email}</span>
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
        </div>
        
        <div className="p-5">
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

  const renderFilesTab = () => (
    <div>
      {loading ? (
        <div className="flex flex-col justify-center items-center py-16">
          <Loader className="animate-spin h-10 w-10 text-blue-500 mb-4" />
          <span className="text-gray-500">Loading files...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-xl text-center border border-red-100">
          <div className="mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="font-medium">{error}</p>
          <button 
            onClick={fetchFileData}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      ) : fileData && fileData.length > 0 ? (
        <div className="space-y-6">
          {fileData.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-5 py-4 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-800">File Group</span>
                  </div>
                  <button
                    onClick={() => downloadFile(doc.id, null, null, true, `all_files_${order.orderId}.zip`)}
                    disabled={downloadingFile === `all-${doc.id}`}
                    className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors shadow-sm`}
                  >
                    {downloadingFile === `all-${doc.id}` ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" /> Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" /> Download All
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* CAD files */}
              {doc.cadFiles && doc.cadFiles.length > 0 && (
                <div className="px-5 py-4 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="bg-indigo-100 p-1.5 rounded-lg">
                        <FileText className="h-4 w-4 text-indigo-600" />
                      </div>
                      <h4 className="font-medium text-gray-700">CAD Files</h4>
                    </div>
                    <button
                      onClick={() => downloadFile(doc.id, null, "cad", false, `cad_files_${order.orderId}.zip`)}
                      disabled={downloadingFile === `cad-${doc.id}`}
                      className={`inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs rounded-lg hover:bg-indigo-200 disabled:bg-indigo-50 disabled:text-indigo-300 disabled:cursor-not-allowed transition-colors`}
                    >
                      {downloadingFile === `cad-${doc.id}` ? (
                        <>
                          <Loader className="h-3 w-3 mr-1.5 animate-spin" /> Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-3 w-3 mr-1.5" /> All CAD Files
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filename</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {doc.cadFiles.map((file) => (
                          <tr key={file.index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-gray-700 flex items-center">
                              <FileText className="h-4 w-4 text-gray-400 mr-2" />
                              {file.filename}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => downloadFile(doc.id, file.index, "cad", false, file.filename)}
                                disabled={downloadingFile === `cad-${doc.id}-${file.index}`}
                                className={`inline-flex items-center px-3 py-1 bg-white border border-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors`}
                              >
                                {downloadingFile === `cad-${doc.id}-${file.index}` ? (
                                  <>
                                    <Loader className="h-3 w-3 mr-1.5 animate-spin" /> Downloading
                                  </>
                                ) : (
                                  <>
                                    <Download className="h-3 w-3 mr-1.5" /> Download
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Image files */}
              {doc.images && doc.images.length > 0 && (
                <div className="px-5 py-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="bg-rose-100 p-1.5 rounded-lg">
                        <Camera className="h-4 w-4 text-rose-600" />
                      </div>
                      <h4 className="font-medium text-gray-700">Images</h4>
                    </div>
                    <button
                      onClick={() => downloadFile(doc.id, null, "image", false, `images_${order.orderId}.zip`)}
                      disabled={downloadingFile === `image-${doc.id}`}
                      className={`inline-flex items-center px-3 py-1.5 bg-rose-100 text-rose-700 text-xs rounded-lg hover:bg-rose-200 disabled:bg-rose-50 disabled:text-rose-300 disabled:cursor-not-allowed transition-colors`}
                    >
                      {downloadingFile === `image-${doc.id}` ? (
                        <>
                          <Loader className="h-3 w-3 mr-1.5 animate-spin" /> Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-3 w-3 mr-1.5" /> All Images
                        </>
                      )}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {doc.images.map((img) => (
                      <div key={img.index} className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                        <img 
                          src={`${BASE_URL}${img.path}`} 
                          alt={img.filename}
                          className="w-full h-28 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                          <span className="text-white text-xs font-medium truncate max-w-[70%]">{img.filename}</span>
                          <button
                            onClick={() => downloadFile(doc.id, img.index, "image", false, img.filename)}
                            disabled={downloadingFile === `image-${doc.id}-${img.index}`}
                            className="p-1.5 bg-white rounded-full hover:bg-gray-100 disabled:bg-gray-200 transition-colors shadow-sm"
                          >
                            {downloadingFile === `image-${doc.id}-${img.index}` ? (
                              <Loader className="h-3 w-3 animate-spin text-gray-600" />
                            ) : (
                              <Download className="h-3 w-3 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-200 p-3 rounded-full">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Files Available</h3>
          <p className="text-gray-500 text-sm">No files have been uploaded for this order yet.</p>
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
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "details"
                ? "border-b-2 border-blue-600 text-blue-600 bg-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Order Details
          </button>
          <button
            onClick={() => setActiveTab("files")}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "files"
                ? "border-b-2 border-blue-600 text-blue-600 bg-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Files
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {activeTab === "details" ? renderDetailsTab() : renderFilesTab()}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;