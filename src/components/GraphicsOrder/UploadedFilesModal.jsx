import { useState } from "react";
import { X, Download, File, Image } from "lucide-react";

const UploadedFilesModal = ({ order, onClose, baseUrl }) => {
  const [activeTab, setActiveTab] = useState('images');
  
  if (!order) return null;
  
  // Get file name from path
  const getFileName = (path) => {
    if (!path) return "Unknown file";
    const parts = path.split('/');
    return parts[parts.length - 1];
  };
  
  // Format files
  const cadFiles = order.cadFiles || [];
  const imageFiles = order.image || [];
  
  // Log data for debugging
  console.log("CAD files:", cadFiles);
  console.log("Image files:", imageFiles);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Uploaded Files - {order.orderId}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex border-b mb-4">
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'images' 
              ? 'border-b-2 border-indigo-600 text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('images')}
          >
            Images ({imageFiles.length})
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'cad' 
              ? 'border-b-2 border-indigo-600 text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('cad')}
          >
            CAD Files ({cadFiles.length})
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {activeTab === 'images' ? (
            imageFiles.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imageFiles.map((img, index) => (
                  <div key={index} className="rounded-lg overflow-hidden border border-gray-200 flex flex-col">
                    <div className="h-32 overflow-hidden bg-gray-100">
                      <img 
                        src={`${baseUrl}${img}`} 
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-2 flex justify-between items-center bg-gray-50">
                      <span className="text-xs truncate">{getFileName(img)}</span>
                      <a 
                        href={`${baseUrl}${img}`} 
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <Image className="h-5 w-5 mr-2" />
                No images available
              </div>
            )
          ) : (
            cadFiles && cadFiles.length > 0 ? (
              <div className="space-y-2">
                {cadFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <File className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm">{getFileName(file)}</span>
                    </div>
                    <a 
                      href={`${baseUrl}${file}`} 
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <File className="h-5 w-5 mr-2" />
                No CAD files available
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadedFilesModal;

// import { useState, useEffect } from "react";
// import { X, Download, File, Image, Trash2, RefreshCw, AlertCircle } from "lucide-react";

// const UploadedFilesModal = ({ order, onClose, baseUrl }) => {
//   const [activeTab, setActiveTab] = useState('images');
//   const [files, setFiles] = useState({ cadFiles: [], imageFiles: [] });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [deleting, setDeleting] = useState(null);
  
//   useEffect(() => {
//     if (order) {
//       fetchFiles();
//     }
//   }, [order]);
  
//   const fetchFiles = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
      
//       const response = await fetch(`${baseUrl}/api/v1/admin/display/getCadFilesAndPhoto`, {
//         method: "GET",
//         headers: { 
//           "Authorization": `${token}`,
//           "Content-Type": "application/json" 
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error("Failed to fetch files");
//       }
      
//       const data = await response.json();
      
//       if (data.success) {
//         // Filter files for the current order
//         const orderFiles = data.data.filter(file => file.orderId === order.orderId);
        
//         if (orderFiles.length > 0) {
//           setFiles({
//             cadFiles: orderFiles[0].cadFiles || [],
//             imageFiles: orderFiles[0].image || []
//           });
//         } else {
//           // Fallback to props if API doesn't return data for this order
//           setFiles({
//             cadFiles: order.cadFiles || [],
//             imageFiles: order.image || []
//           });
//         }
//       } else {
//         // Fallback to props if API request fails
//         setFiles({
//           cadFiles: order.cadFiles || [],
//           imageFiles: order.image || []
//         });
//       }
//     } catch (err) {
//       console.error("Error fetching files:", err);
//       setError(err.message);
      
//       // Fallback to props if API request fails
//       setFiles({
//         cadFiles: order.cadFiles || [],
//         imageFiles: order.image || []
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const deleteFile = async (fileType, fileIndex) => {
//     try {
//       setDeleting(fileType + '-' + fileIndex);
//       const token = localStorage.getItem("token");
      
//       const response = await fetch(`${baseUrl}/api/v1/admin/grpahics/deleteCadFile`, {
//         method: "POST",
//         headers: { 
//           "Authorization": `${token}`,
//           "Content-Type": "application/json" 
//         },
//         body: JSON.stringify({
//           orderId: order.orderId,
//           fileType: fileType === 'cad' ? 'cadFile' : 'image',
//           index: fileIndex
//         })
//       });
      
//       if (!response.ok) {
//         throw new Error(`Failed to delete ${fileType} file`);
//       }
      
//       const data = await response.json();
      
//       if (data.success) {
//         // Update local state to reflect deletion
//         if (fileType === 'cad') {
//           setFiles(prev => ({
//             ...prev,
//             cadFiles: prev.cadFiles.filter((_, i) => i !== fileIndex)
//           }));
//         } else {
//           setFiles(prev => ({
//             ...prev,
//             imageFiles: prev.imageFiles.filter((_, i) => i !== fileIndex)
//           }));
//         }
//       } else {
//         throw new Error(data.message || `Failed to delete ${fileType} file`);
//       }
//     } catch (err) {
//       console.error("Error deleting file:", err);
//       setError(err.message);
//     } finally {
//       setDeleting(null);
//     }
//   };
  
//   // Get file name from path
//   const getFileName = (path) => {
//     if (!path) return "Unknown file";
//     const parts = path.split('/');
//     return parts[parts.length - 1];
//   };
  
//   if (!order) return null;
  
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold">Uploaded Files - {order.orderId}</h3>
//           <div className="flex items-center">
//             <button 
//               onClick={fetchFiles} 
//               className="mr-2 text-indigo-600 hover:text-indigo-800"
//               disabled={loading}
//             >
//               <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
//             </button>
//             <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//               <X className="h-5 w-5" />
//             </button>
//           </div>
//         </div>
        
//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 flex items-center">
//             <AlertCircle className="h-4 w-4 mr-2" />
//             {error}
//             <button 
//               className="ml-auto text-red-700 hover:text-red-900" 
//               onClick={() => setError(null)}
//             >
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//         )}
        
//         <div className="flex border-b mb-4">
//           <button 
//             className={`px-4 py-2 text-sm font-medium ${activeTab === 'images' 
//               ? 'border-b-2 border-indigo-600 text-indigo-600' 
//               : 'text-gray-500 hover:text-gray-700'}`}
//             onClick={() => setActiveTab('images')}
//           >
//             Images ({files.imageFiles.length})
//           </button>
//           <button 
//             className={`px-4 py-2 text-sm font-medium ${activeTab === 'cad' 
//               ? 'border-b-2 border-indigo-600 text-indigo-600' 
//               : 'text-gray-500 hover:text-gray-700'}`}
//             onClick={() => setActiveTab('cad')}
//           >
//             CAD Files ({files.cadFiles.length})
//           </button>
//         </div>
        
//         {loading ? (
//           <div className="flex justify-center items-center h-32">
//             <RefreshCw className="animate-spin h-8 w-8 text-indigo-600" />
//           </div>
//         ) : (
//           <div className="overflow-y-auto flex-1">
//             {activeTab === 'images' ? (
//               files.imageFiles.length > 0 ? (
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                   {files.imageFiles.map((img, index) => (
//                     <div key={index} className="rounded-lg overflow-hidden border border-gray-200 flex flex-col">
//                       <div className="h-32 overflow-hidden bg-gray-100">
//                         <img 
//                           src={`${baseUrl}${img}`} 
//                           alt={`Image ${index + 1}`}
//                           className="w-full h-full object-cover hover:scale-105 transition-transform"
//                         />
//                       </div>
//                       <div className="p-2 flex justify-between items-center bg-gray-50">
//                         <span className="text-xs truncate">{getFileName(img)}</span>
//                         <div className="flex space-x-2">
//                           <a 
//                             href={`${baseUrl}${img}`} 
//                             download
//                             target="_blank"
//                             rel="noreferrer"
//                             className="text-indigo-600 hover:text-indigo-800"
//                           >
//                             <Download className="h-4 w-4" />
//                           </a>
//                           <button 
//                             onClick={() => deleteFile('image', index)}
//                             className="text-red-600 hover:text-red-800"
//                             disabled={deleting === `image-${index}`}
//                           >
//                             {deleting === `image-${index}` ? (
//                               <RefreshCw className="h-4 w-4 animate-spin" />
//                             ) : (
//                               <Trash2 className="h-4 w-4" />
//                             )}
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center h-32 text-gray-500">
//                   <Image className="h-5 w-5 mr-2" />
//                   No images available
//                 </div>
//               )
//             ) : (
//               files.cadFiles && files.cadFiles.length > 0 ? (
//                 <div className="space-y-2">
//                   {files.cadFiles.map((file, index) => (
//                     <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                       <div className="flex items-center">
//                         <File className="h-5 w-5 text-gray-500 mr-2" />
//                         <span className="text-sm">{getFileName(file)}</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <a 
//                           href={`${baseUrl}${file}`} 
//                           download
//                           target="_blank"
//                           rel="noreferrer"
//                           className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
//                         >
//                           <Download className="h-4 w-4 mr-1" />
//                           Download
//                         </a>
//                         <button 
//                           onClick={() => deleteFile('cad', index)}
//                           className="flex items-center text-sm text-red-600 hover:text-red-800"
//                           disabled={deleting === `cad-${index}`}
//                         >
//                           {deleting === `cad-${index}` ? (
//                             <RefreshCw className="h-4 w-4 animate-spin mr-1" />
//                           ) : (
//                             <Trash2 className="h-4 w-4 mr-1" />
//                           )}
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center h-32 text-gray-500">
//                   <File className="h-5 w-5 mr-2" />
//                   No CAD files available
//                 </div>
//               )
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UploadedFilesModal;

// import { useState, useEffect } from "react";
// import { X, Download, File, Image } from "lucide-react";

// const UploadedFilesModal = ({ order, onClose, baseUrl }) => {
//   const [activeTab, setActiveTab] = useState('images');
//   const [fileData, setFileData] = useState({ photo: [], CadFile: [] });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   useEffect(() => {
//     if (order && order._id) {
//       fetchFilesData(order._id);
//     }
//   }, [order]);
  
//   const fetchFilesData = async (orderId) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
      
//       const response = await fetch(`${baseUrl}/api/v1/admin/display/getCadFilesAndPhoto`, {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json",
//           "Authorization": `${token}` 
//         },
//         body: JSON.stringify({ orderId })
//       });
      
//       if (!response.ok) {
//         throw new Error("Failed to fetch files");
//       }
      
//       const result = await response.json();
      
//       if (result.success) {
//         setFileData({
//           photo: result.data.photo || [],
//           CadFile: result.data.CadFile || []
//         });
//       } else {
//         throw new Error(result.message || "Failed to retrieve files");
//       }
      
//     } catch (err) {
//       console.error("Error fetching files:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Get file name from path
//   const getFileName = (path) => {
//     if (!path) return "Unknown file";
//     const parts = path.split('/');
//     return parts[parts.length - 1];
//   };
  
//   if (!order) return null;
  
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold">Uploaded Files - {order.orderId}</h3>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X className="h-5 w-5" />
//           </button>
//         </div>
        
//         <div className="flex border-b mb-4">
//           <button 
//             className={`px-4 py-2 text-sm font-medium ${activeTab === 'images' 
//               ? 'border-b-2 border-indigo-600 text-indigo-600' 
//               : 'text-gray-500 hover:text-gray-700'}`}
//             onClick={() => setActiveTab('images')}
//           >
//             Images ({fileData.photo.length})
//           </button>
//           <button 
//             className={`px-4 py-2 text-sm font-medium ${activeTab === 'cad' 
//               ? 'border-b-2 border-indigo-600 text-indigo-600' 
//               : 'text-gray-500 hover:text-gray-700'}`}
//             onClick={() => setActiveTab('cad')}
//           >
//             CAD Files ({fileData.CadFile.length})
//           </button>
//         </div>
        
//         {loading ? (
//           <div className="flex justify-center items-center h-32">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
//           </div>
//         ) : error ? (
//           <div className="flex flex-col items-center justify-center h-32 text-red-500">
//             <p className="mb-2">Error: {error}</p>
//             <button 
//               onClick={() => fetchFilesData(order._id)} 
//               className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
//             >
//               Try Again
//             </button>
//           </div>
//         ) : (
//           <div className="overflow-y-auto flex-1">
//             {activeTab === 'images' ? (
//               fileData.photo.length > 0 ? (
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                   {fileData.photo.map((img, index) => (
//                     <div key={index} className="rounded-lg overflow-hidden border border-gray-200 flex flex-col">
//                       <div className="h-32 overflow-hidden bg-gray-100">
//                         <img 
//                           src={`${baseUrl}${img}`} 
//                           alt={`Image ${index + 1}`}
//                           className="w-full h-full object-cover hover:scale-105 transition-transform"
//                         />
//                       </div>
//                       <div className="p-2 flex justify-between items-center bg-gray-50">
//                         <span className="text-xs truncate">{getFileName(img)}</span>
//                         <a 
//                           href={`${baseUrl}${img}`} 
//                           download
//                           target="_blank"
//                           rel="noreferrer"
//                           className="text-indigo-600 hover:text-indigo-800"
//                         >
//                           <Download className="h-4 w-4" />
//                         </a>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center h-32 text-gray-500">
//                   <Image className="h-5 w-5 mr-2" />
//                   No images available
//                 </div>
//               )
//             ) : (
//               fileData.CadFile && fileData.CadFile.length > 0 ? (
//                 <div className="space-y-2">
//                   {fileData.CadFile.map((file, index) => (
//                     <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                       <div className="flex items-center">
//                         <File className="h-5 w-5 text-gray-500 mr-2" />
//                         <span className="text-sm">{getFileName(file)}</span>
//                       </div>
//                       <a 
//                         href={`${baseUrl}${file}`} 
//                         download
//                         target="_blank"
//                         rel="noreferrer"
//                         className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
//                       >
//                         <Download className="h-4 w-4 mr-1" />
//                         Download
//                       </a>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center h-32 text-gray-500">
//                   <File className="h-5 w-5 mr-2" />
//                   No CAD files available
//                 </div>
//               )
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UploadedFilesModal;