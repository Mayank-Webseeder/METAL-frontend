// import React, { useState, useEffect } from "react";
// import { 
//   FileText, 
//   Package, 
//   Camera, 
//   Download, 
//   Loader, 
//   CheckCircle, 
//   ChevronDown, 
//   X, 
//   Eye,
//   ArrowLeft
// } from "lucide-react";

// const DisplayOrder = ({ order, onClose, onStatusUpdate }) => {
//   const [fileData, setFileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [downloadingFile, setDownloadingFile] = useState(null);
//   const [activeTab, setActiveTab] = useState("details");
//   const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
//   const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);
//   const [showImagePreview, setShowImagePreview] = useState(false);
//   const [previewImage, setPreviewImage] = useState("");

//   const BASE_URL = import.meta.env.VITE_BASE_URL;
//   const API_PREFIX = "/api/v1/display";

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
//       setError("Failed to load files. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (newStatus) => {
//     try {
//       setStatusUpdateLoading(true);
//       const token = localStorage.getItem("token");
      
//       const response = await fetch(`${BASE_URL}${API_PREFIX}/updateOrderStatus/${order._id}`, {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json",
//           Authorization: `${token}` 
//         },
//         body: JSON.stringify({ status: newStatus })
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update status");
//       }

//       const data = await response.json();
      
//       if (data.success) {
//         setStatusUpdateSuccess(true);
        
//         // If parent component has a callback for status updates
//         if (onStatusUpdate) {
//           onStatusUpdate(order._id, newStatus);
//         }
        
//         // Reset success message after 3 seconds
//         setTimeout(() => {
//           setStatusUpdateSuccess(false);
//         }, 3000);
//       }
//     } catch (err) {
//       console.error("Error updating status:", err);
//       setError("Failed to update status. Please try again.");
//     } finally {
//       setStatusUpdateLoading(false);
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
//       setError("Failed to download file. Please try again.");
//     } finally {
//       // Clear downloading state after a delay
//       setTimeout(() => setDownloadingFile(null), 1000);
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

//   const openImagePreview = (imagePath) => {
//     setPreviewImage(`${BASE_URL}${imagePath}`);
//     setShowImagePreview(true);
//   };

//   const closeImagePreview = () => {
//     setShowImagePreview(false);
//     setPreviewImage("");
//   };

//   const renderDetailsTab = () => (
//     <div className="space-y-6">
//       <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
//         <div className="flex flex-col md:flex-row md:divide-x divide-gray-100">
//           <div className="w-full md:w-1/2 p-5">
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
//                 <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
//                   {order.status}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-sm font-medium text-gray-500">Created Date</span>
//                 <span className="text-sm">{order.created}</span>
//               </div>
//               {order.dimensions && (
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm font-medium text-gray-500">Dimensions</span>
//                   <span className="text-sm">{order.dimensions}</span>
//                 </div>
//               )}
//             </div>
//           </div>
          
//           <div className="w-full md:w-1/2 p-5">
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="bg-green-50 p-2 rounded-lg">
//                 <CheckCircle className="h-5 w-5 text-green-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800">Complete Order</h3>
//             </div>
//             <div className="space-y-4">
//               <p className="text-sm text-gray-600">
//                 When you've finished working on this order, mark it as complete.
//               </p>
              
//               {statusUpdateSuccess && (
//                 <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-green-700 flex items-center">
//                   <CheckCircle className="h-4 w-4 mr-2" />
//                   Order status updated successfully!
//                 </div>
//               )}
              
//               <button
//                 onClick={() => handleStatusChange("Completed")}
//                 disabled={statusUpdateLoading || order.status === "Completed"}
//                 className="w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors"
//               >
//                 {statusUpdateLoading ? (
//                   <span className="flex items-center justify-center">
//                     <Loader className="animate-spin h-4 w-4 mr-2" /> Updating...
//                   </span>
//                 ) : order.status === "Completed" ? (
//                   <span className="flex items-center justify-center">
//                     <CheckCircle className="h-4 w-4 mr-2" /> Already Completed
//                   </span>
//                 ) : (
//                   <span className="flex items-center justify-center">
//                     <CheckCircle className="h-4 w-4 mr-2" /> Mark as Completed
//                   </span>
//                 )}
//               </button>
              
//               {order.status !== "Completed" && (
//                 <div className="flex items-center justify-center">
//                   <span className="text-xs text-gray-500">
//                     You can also change to other statuses:
//                   </span>
//                 </div>
//               )}
              
//               {order.status !== "Completed" && (
//                 <div className="relative">
//                   <select
//                     onChange={(e) => handleStatusChange(e.target.value)}
//                     className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                     defaultValue=""
//                   >
//                     <option value="" disabled>Change Status</option>
//                     <option value="InProgress">In Progress</option>
//                     <option value="PendingApproval">Pending Approval</option>
//                     <option value="Paused">Paused</option>
//                   </select>
//                   <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
        
//         <div className="p-5 border-t border-gray-100">
//           <div className="flex items-center space-x-3 mb-3">
//             <div className="bg-indigo-50 p-2 rounded-lg">
//               <FileText className="h-5 w-5 text-indigo-600" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-800">Requirements</h3>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
//             {order.requirements || "No specific requirements provided"}
//           </div>
//         </div>
//       </div>
      
//       {order.image && order.image.length > 0 && (
//         <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
//           <div className="flex items-center space-x-3 p-5 border-b border-gray-100">
//             <div className="bg-rose-50 p-2 rounded-lg">
//               <Camera className="h-5 w-5 text-rose-600" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-800">Order Images</h3>
//           </div>
//           <div className="p-5">
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//               {order.image.map((img, index) => (
//                 <div 
//                   key={index} 
//                   className="relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
//                   onClick={() => openImagePreview(img)}
//                 >
//                   <img 
//                     src={`${BASE_URL}${img}`} 
//                     alt={`Order image ${index + 1}`}
//                     className="w-full h-32 object-cover"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
//                     <span className="text-white text-xs font-medium">Image {index + 1}</span>
//                     <Eye className="h-4 w-4 text-white" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   const renderFilesTab = () => (
//     <div>
//       {loading ? (
//         <div className="flex flex-col items-center justify-center py-12">
//           <Loader className="animate-spin h-10 w-10 text-blue-500 mb-3" />
//           <p className="text-gray-500">Loading files...</p>
//         </div>
//       ) : error ? (
//         <div className="flex flex-col items-center justify-center py-12">
//           <div className="bg-red-100 text-red-600 p-3 rounded-full mb-3">
//             <X className="h-10 w-10" />
//           </div>
//           <p className="text-gray-700 font-medium">{error}</p>
//           <button 
//             onClick={fetchFileData}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       ) : fileData && fileData.length > 0 ? (
//         <div className="space-y-6">
//           {fileData.map((doc) => (
//             <div key={doc.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
//               <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-5 py-4 border-b">
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center space-x-3">
//                     <div className="bg-blue-500 p-2 rounded-lg">
//                       <FileText className="h-5 w-5 text-white" />
//                     </div>
//                     <span className="font-medium text-gray-800">Files</span>
//                   </div>
                  
//                   <button
//                     onClick={() => downloadFile(doc.id, null, "all", null, `all_files_${order.orderId}.zip`)}
//                     disabled={downloadingFile === `all-all-${doc.id}`}
//                     className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
//                   >
//                     {downloadingFile === `all-all-${doc.id}` ? (
//                       <>
//                         <Loader className="h-4 w-4 mr-2 animate-spin" /> Downloading...
//                       </>
//                     ) : (
//                       <>
//                         <Download className="h-4 w-4 mr-2" /> Download All
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
              
//               {/* CAD files */}
//               {doc.cadFiles && doc.cadFiles.length > 0 && (
//                 <div className="px-5 py-4 border-b border-gray-100">
//                   <div className="flex justify-between items-center mb-3">
//                     <div className="flex items-center space-x-2">
//                       <div className="bg-indigo-100 p-1.5 rounded">
//                         <FileText className="h-4 w-4 text-indigo-600" />
//                       </div>
//                       <h4 className="font-medium text-gray-700">CAD Files</h4>
//                     </div>
                    
//                     <button
//                       onClick={() => downloadFile(doc.id, "cad", "type", null, `cad_files_${order.orderId}.zip`)}
//                       disabled={downloadingFile === `type-cad-${doc.id}`}
//                       className="inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs rounded-lg hover:bg-indigo-200 transition-colors"
//                     >
//                       {downloadingFile === `type-cad-${doc.id}` ? (
//                         <>
//                           <Loader className="h-3 w-3 mr-1.5 animate-spin" /> Downloading...
//                         </>
//                       ) : (
//                         <>
//                           <Download className="h-3 w-3 mr-1.5" /> All CAD Files
//                         </>
//                       )}
//                     </button>
//                   </div>
//                   <div className="bg-gray-50 rounded-lg overflow-hidden">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead>
//                         <tr>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filename</th>
//                           <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200 bg-white">
//                         {doc.cadFiles.map((file) => (
//                           <tr key={file.index} className="hover:bg-gray-50 transition-colors">
//                             <td className="px-4 py-3 text-sm font-medium text-gray-700 flex items-center">
//                               <FileText className="h-4 w-4 text-gray-400 mr-2" />
//                               {file.filename}
//                             </td>
//                             <td className="px-4 py-3 text-right">
//                               <button
//                                 onClick={() => downloadFile(doc.id, "cad", "single", file.index, file.filename)}
//                                 disabled={downloadingFile === `single-cad-${doc.id}-${file.index}`}
//                                 className="inline-flex items-center px-3 py-1 bg-white border border-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-50 transition-colors"
//                               >
//                                 {downloadingFile === `single-cad-${doc.id}-${file.index}` ? (
//                                   <>
//                                     <Loader className="h-3 w-3 mr-1.5 animate-spin" /> Downloading
//                                   </>
//                                 ) : (
//                                   <>
//                                     <Download className="h-3 w-3 mr-1.5" /> Download
//                                   </>
//                                 )}
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}
              
//               {/* Image files */}
//               {doc.images && doc.images.length > 0 && (
//                 <div className="px-5 py-4">
//                   <div className="flex justify-between items-center mb-3">
//                     <div className="flex items-center space-x-2">
//                       <div className="bg-rose-100 p-1.5 rounded">
//                         <Camera className="h-4 w-4 text-rose-600" />
//                       </div>
//                       <h4 className="font-medium text-gray-700">Images</h4>
//                     </div>
                    
//                     <button
//                       onClick={() => downloadFile(doc.id, "image", "type", null, `images_${order.orderId}.zip`)}
//                       disabled={downloadingFile === `type-image-${doc.id}`}
//                       className="inline-flex items-center px-3 py-1.5 bg-rose-100 text-rose-700 text-xs rounded-lg hover:bg-rose-200 transition-colors"
//                     >
//                       {downloadingFile === `type-image-${doc.id}` ? (
//                         <>
//                           <Loader className="h-3 w-3 mr-1.5 animate-spin" /> Downloading...
//                         </>
//                       ) : (
//                         <>
//                           <Download className="h-3 w-3 mr-1.5" /> All Images
//                         </>
//                       )}
//                     </button>
//                   </div>
//                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                     {doc.images.map((img) => (
//                       <div 
//                         key={img.index} 
//                         className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
//                       >
//                         <img 
//                           src={`${BASE_URL}${img.path}`} 
//                           alt={img.filename}
//                           className="w-full h-28 object-cover cursor-pointer"
//                           onClick={() => openImagePreview(img.path)}
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
//                           <span className="text-white text-xs font-medium truncate max-w-[70%]">{img.filename}</span>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               downloadFile(doc.id, "image", "single", img.index, img.filename);
//                             }}
//                             disabled={downloadingFile === `single-image-${doc.id}-${img.index}`}
//                             className="p-1.5 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm"
//                           >
//                             {downloadingFile === `single-image-${doc.id}-${img.index}` ? (
//                               <Loader className="h-3 w-3 animate-spin text-gray-600" />
//                             ) : (
//                               <Download className="h-3 w-3 text-gray-600" />
//                             )}
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-100">
//           <div className="flex justify-center mb-4">
//             <div className="bg-gray-200 p-3 rounded-full">
//               <FileText className="h-8 w-8 text-gray-400" />
//             </div>
//           </div>
//           <h3 className="text-lg font-medium text-gray-700 mb-2">No Files Available</h3>
//           <p className="text-gray-500 text-sm">No files have been uploaded for this order yet.</p>
//         </div>
//       )}
//     </div>
//   );

//   if (!order) return null;

//   return (
//     <div className="bg-gray-50 min-h-screen p-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//           <div className="flex items-center space-x-4 mb-4 sm:mb-0">
//             <button 
//               onClick={onClose}
//               className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors"
//             >
//               <ArrowLeft className="h-5 w-5 text-gray-600" />
//             </button>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900 flex items-center">
//                 Order #{order.orderId}
//                 <span className={`ml-3 px-2 py-1 text-xs leading-4 font-medium rounded-full ${getStatusColor(order.status)}`}>
//                   {order.status}
//                 </span>
//               </h1>
//               <p className="text-sm text-gray-600">Assigned for display processing</p>
//             </div>
//           </div>
          
//           {/* Actions */}
//           <div className="flex space-x-3">
//             <button
//               onClick={() => handleStatusChange("Completed")}
//               disabled={statusUpdateLoading || order.status === "Completed"}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors flex items-center"
//             >
//               {statusUpdateLoading ? (
//                 <>
//                   <Loader className="animate-spin h-4 w-4 mr-2" /> Updating...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle className="h-4 w-4 mr-2" /> 
//                   {order.status === "Completed" ? "Already Completed" : "Mark as Completed"}
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
        
//         {/* Tabs */}
//         <div className="bg-white rounded-t-lg shadow-sm border border-gray-100 mb-1">
//           <div className="flex">
//             <button
//               onClick={() => setActiveTab("details")}
//               className={`px-6 py-3 text-sm font-medium transition-colors ${
//                 activeTab === "details"
//                   ? "border-b-2 border-blue-600 text-blue-600"
//                   : "text-gray-600 hover:text-gray-800"
//               }`}
//             >
//               Order Details
//             </button>
//             <button
//               onClick={() => setActiveTab("files")}
//               className={`px-6 py-3 text-sm font-medium transition-colors ${
//                 activeTab === "files"
//                   ? "border-b-2 border-blue-600 text-blue-600"
//                   : "text-gray-600 hover:text-gray-800"
//               }`}
//             >
//               Files
//             </button>
//           </div>
//         </div>
        
//         {/* Content */}
//         <div>
//           {activeTab === "details" ? renderDetailsTab() : renderFilesTab()}
//         </div>
//       </div>
      
//       {/* Image Preview Modal */}
//       {showImagePreview && (
//         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
//           <div className="relative max-w-4xl w-full">
//             <button
//               onClick={closeImagePreview}
//               className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
//             >
//               <X className="h-6 w-6 text-white" />
//             </button>
//             <img 
//               src={previewImage} 
//               alt="Preview" 
//               className="max-w-full max-h-[80vh] object-contain mx-auto"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DisplayOrder;


import { useState, useEffect } from "react";
import { 
  RefreshCw, 
  ChevronDown, 
  Search, 
  Package, 
  AlertCircle,
  Eye,
  FileText,
  Download
} from "lucide-react";
import Loader from './Loader';
import DisplayOrderDetailsModal from './DisplayOrderDetailsModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DisplayOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState({ loading: false, error: null, success: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  
  // Status options based on the allowed statuses for display users
  const statusOptions = ["Pending", "InProgress", "Reviewed", "Completed"];
  
  // Status color mapping
  const statusColors = {
    "Pending": "bg-gray-100 text-gray-800",
    "InProgress": "bg-blue-100 text-blue-800",
    "Reviewed": "bg-purple-100 text-purple-800",
    "Completed": "bg-green-100 text-green-800",
    "Failed": "bg-red-100 text-red-800"
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  
  useEffect(() => {
    // Filter orders based on search term and status
    let result = orders;
    
    if (searchTerm) {
      result = result.filter(order => 
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.requirements.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      result = result.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // Using the display user endpoint to get assigned orders
      const endpoint = `${BASE_URL}/api/v1/admin/assigned`;
        
      const response = await fetch(endpoint, {
        method: "GET",
        headers: { Authorization: `${token}` },
      });
      
      if (!response.ok) throw new Error("Failed to fetch orders");
      
      const data = await response.json();
      console.log("Fetched display orders:", data);
      const ordersData = data.data || [];
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      setUpdateStatus({ loading: true, error: null, success: null });
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${BASE_URL}/api/v1/admin/updateStatus`, {
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

  const renderStatusBadge = (status) => {
    return (
      <span 
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
      >
        {status}
      </span>
    );
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    // Refresh orders list to get updated data
    fetchOrders();
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Display Orders</h1>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
              View and manage orders assigned to your display account
            </p>
          </div>
          <button 
            onClick={fetchOrders}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
          >
            <RefreshCw className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Refresh Orders
          </button>
        </div>
        
        {/* Status update feedback messages */}
        {updateStatus.loading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-lg mb-4 flex items-center">
            <RefreshCw className="animate-spin h-4 w-4 mr-2" />
            Updating status...
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
                placeholder="Search by order ID or requirements..."
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
              <p className="text-gray-600">No orders currently assigned to you</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirements</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Dimensions</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Files</th>
                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-medium text-gray-900">{order.orderId}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px]">
                          {order.requirements}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-xs sm:text-sm text-gray-500">{order.dimensions}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        {renderStatusBadge(order.status)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                        {order.created}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                        <div className="flex space-x-2">
                          {order.image && order.image.length > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {order.image.length} Images
                            </span>
                          )}
                          {order.cadFiles && order.cadFiles.length > 0 && (
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                              {order.cadFiles.length} CAD Files
                            </span>
                          )}
                          {(!order.image || order.image.length === 0) && 
                           (!order.cadFiles || order.cadFiles.length === 0) && (
                            <span className="text-xs text-gray-500">No files</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewOrderDetails(order)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded text-xs flex items-center"
                            title="View Order Details"
                          >
                            <Eye className="h-3 w-3 mr-1" /> View Details
                          </button>
                          
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
            </div>
          )}
        </div>
      </div>
      
      {/* Order Details Modal */}
      {selectedOrder && (
        <DisplayOrderDetailsModal
          order={selectedOrder}
          onClose={closeOrderDetails}
          onStatusUpdate={handleStatusUpdate}
          baseUrl={BASE_URL}
        />
      )}
    </div>
  );
};

export default DisplayOrders;