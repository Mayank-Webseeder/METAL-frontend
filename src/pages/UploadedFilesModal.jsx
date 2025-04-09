// import { useState } from "react";
// import { X, Download, File, Image } from "lucide-react";

// const UploadedFilesModal = ({ order, onClose, baseUrl }) => {
//   const [activeTab, setActiveTab] = useState('images');
  
//   if (!order) return null;
  
//   // Get file name from path
//   const getFileName = (path) => {
//     const parts = path.split('/');
//     return parts[parts.length - 1];
//   };
  
//   // Format CAD filenames
//   const cadFiles = order.cadFiles || [];
//   const imageFiles = order.image || [];
  
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
//             Images
//           </button>
//           <button 
//             className={`px-4 py-2 text-sm font-medium ${activeTab === 'cad' 
//               ? 'border-b-2 border-indigo-600 text-indigo-600' 
//               : 'text-gray-500 hover:text-gray-700'}`}
//             onClick={() => setActiveTab('cad')}
//           >
//             CAD Files
//           </button>
//         </div>
        
//         <div className="overflow-y-auto flex-1">
//           {activeTab === 'images' ? (
//             imageFiles.length > 0 ? (
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                 {imageFiles.map((img, index) => (
//                   <div key={index} className="rounded-lg overflow-hidden border border-gray-200 flex flex-col">
//                     <div className="h-32 overflow-hidden bg-gray-100">
//                       <img 
//                         src={`${baseUrl}${img}`} 
//                         alt={`Image ${index + 1}`}
//                         className="w-full h-full object-cover hover:scale-105 transition-transform"
//                       />
//                     </div>
//                     <div className="p-2 flex justify-between items-center bg-gray-50">
//                       <span className="text-xs truncate">{getFileName(img)}</span>
//                       <a 
//                         href={`${baseUrl}${img}`} 
//                         download
//                         target="_blank"
//                         rel="noreferrer"
//                         className="text-indigo-600 hover:text-indigo-800"
//                       >
//                         <Download className="h-4 w-4" />
//                       </a>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="flex items-center justify-center h-32 text-gray-500">
//                 <Image className="h-5 w-5 mr-2" />
//                 No images available
//               </div>
//             )
//           ) : (
//             cadFiles.length > 0 ? (
//               <div className="space-y-2">
//                 {cadFiles.map((file, index) => (
//                   <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                     <div className="flex items-center">
//                       <File className="h-5 w-5 text-gray-500 mr-2" />
//                       <span className="text-sm">{getFileName(file)}</span>
//                     </div>
//                     <a 
//                       href={`${baseUrl}${file}`} 
//                       download
//                       target="_blank"
//                       rel="noreferrer"
//                       className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
//                     >
//                       <Download className="h-4 w-4 mr-1" />
//                       Download
//                     </a>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="flex items-center justify-center h-32 text-gray-500">
//                 <File className="h-5 w-5 mr-2" />
//                 No CAD files available
//               </div>
//             )
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadedFilesModal;


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