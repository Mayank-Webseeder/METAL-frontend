import { useState, useEffect } from "react";
import { 
  X, 
  Download, 
  Loader, 
  FileText, 
  Camera, 
  Package, 
  User, 
  Calendar, 
  List, 
  CheckCircle, 
  ThumbsUp,
  RefreshCw,
  AlertCircle
} from "lucide-react";

// File Download component to handle all download-related functionality
const FileDownloadManager = ({ order, baseUrl }) => {
  const [downloadingFile, setDownloadingFile] = useState(null);
  const API_PREFIX = "/api/v1";

  const downloadFile = async (documentId, fileType = null, downloadType = "single", fileIndex = null, filename = "") => {
    try {
      let url;
      const downloadId = `${downloadType}-${fileType || "all"}-${documentId}${fileIndex !== null ? `-${fileIndex}` : ""}`;
      setDownloadingFile(downloadId);
      
      // Generate URL based on download type
      switch (downloadType) {
        case "all":
          // Download all files (both CAD and images)
          url = `${API_PREFIX}/admin/files/download-all/${documentId}`;
          break;
        case "type":
          // Download all files of a specific type (CAD or images)
          url = `${API_PREFIX}/admin/files/download-all-type/${documentId}?type=${fileType}`;
          break;
        case "single":
          // Download a specific file
          url = `${API_PREFIX}/admin/files/download/${documentId}/${fileIndex}?type=${fileType}`;
          break;
        default:
          throw new Error("Invalid download type");
      }
      
      const token = localStorage.getItem("token");
      const fullUrl = `${baseUrl}${url}`;
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename || `${fileType || "all"}_files_${order.orderId}.zip`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
      
    } catch (err) {
      console.error("Error downloading file:", err);
    } finally {
      // Clear downloading state after a short delay
      setTimeout(() => setDownloadingFile(null), 1000);
    }
  };

  return { downloadFile, downloadingFile };
};

// CadFilesSection component to display and handle CAD files
const CadFilesSection = ({ fileData, order, downloadFile, downloadingFile, baseUrl }) => {
  // Check if cadFiles exists and has items
  if (!fileData?.cadFiles || fileData.cadFiles.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-50 p-2 rounded-lg">
            <FileText className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">CAD Files</h3>
        </div>
        <button
          onClick={() => downloadFile(order._id, "cad", "type")}
          className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium flex items-center hover:bg-indigo-200 transition-colors"
          disabled={downloadingFile === `type-cad-${order._id}`}
        >
          {downloadingFile === `type-cad-${order._id}` ? (
            <Loader className="h-3 w-3 mr-1 animate-spin" />
          ) : (
            <Download className="h-3 w-3 mr-1" />
          )}
          Download All CAD
        </button>
      </div>
      <div className="p-5">
        <div className="space-y-3">
          {fileData.cadFiles.map((file, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-100 p-2 rounded-md">
                  <FileText className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{file.filename || `CAD File ${index + 1}`}</p>
                  <p className="text-xs text-gray-500">{file.filesize || "Unknown size"}</p>
                </div>
              </div>
              <button
                onClick={() => downloadFile(
                  order._id, 
                  "cad", 
                  "single", 
                  index, 
                  file.filename
                )}
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                disabled={downloadingFile === `single-cad-${order._id}-${index}`}
              >
                {downloadingFile === `single-cad-${order._id}-${index}` ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ImagesSection component to display and handle image files
const ImagesSection = ({ fileData, order, downloadFile, downloadingFile, baseUrl, onImageClick }) => {
  // Check if images exists and has items
  if (!fileData?.images || fileData.images.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="bg-rose-50 p-2 rounded-lg">
            <Camera className="h-5 w-5 text-rose-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Images</h3>
        </div>
        <button
          onClick={() => downloadFile(order._id, "image", "type")}
          className="px-3 py-1.5 bg-rose-100 text-rose-700 rounded-lg text-xs font-medium flex items-center hover:bg-rose-200 transition-colors"
          disabled={downloadingFile === `type-image-${order._id}`}
        >
          {downloadingFile === `type-image-${order._id}` ? (
            <Loader className="h-3 w-3 mr-1 animate-spin" />
          ) : (
            <Download className="h-3 w-3 mr-1" />
          )}
          Download All Images
        </button>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fileData.images.map((img, index) => (
            <div 
              key={index}
              className="group relative rounded-lg overflow-hidden shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md"
              onClick={() => onImageClick(img.path)}
            >
              <img 
                src={`${baseUrl}${img.path}`} 
                alt={img.filename || `Order image ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                <span className="text-white text-xs font-medium truncate max-w-[70%]">
                  {img.filename || `Image ${index + 1}`}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadFile(
                      order._id, 
                      "image", 
                      "single", 
                      index, 
                      img.filename
                    );
                  }}
                  className="p-1.5 bg-white/20 text-white hover:bg-white/40 rounded-full transition-colors"
                  disabled={downloadingFile === `single-image-${order._id}-${index}`}
                >
                  {downloadingFile === `single-image-${order._id}-${index}` ? (
                    <Loader className="h-3 w-3 animate-spin" />
                  ) : (
                    <Download className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DisplayOrderDetailsModal = ({ order, onClose, onStatusUpdate, baseUrl }) => {
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [selectedImage, setSelectedImage] = useState(null);
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  
  const BASE_URL = baseUrl;
  const API_PREFIX = "/api/v1";

  // Use the FileDownloadManager to get download functionality
  const { downloadFile, downloadingFile } = FileDownloadManager({ order, baseUrl });

  // Status options based on the allowed statuses for display users
  const statusOptions = ["Pending", "InProgress", "Reviewed", "Completed"];
  
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
      // Use the correct API endpoint for files
      const response = await fetch(`${BASE_URL}${API_PREFIX}/admin/file/order/${order._id}`, {
        method: "GET",
        headers: { Authorization: `${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch file data");
      }

      const data = await response.json();
      
      // If data.data is an array, take the first element
      // This is because your console log shows the file data comes as an array with a single object
      if (Array.isArray(data.data) && data.data.length > 0) {
        setFileData(data.data[0]);
        console.log("Files data processed:", data.data[0]);
      } else {
        setFileData(data.data);
        console.log("Files data:", data.data);
      }
    } catch (err) {
      console.error("Error fetching file data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsReviewed = async () => {
    setUpdateStatusLoading(true);
    try {
      await onStatusUpdate(order._id, "Reviewed");
    } finally {
      setUpdateStatusLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gray-100 text-gray-800";
      case "InProgress":
        return "bg-blue-100 text-blue-800";
      case "Reviewed":
        return "bg-purple-100 text-purple-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Package className="w-4 h-4" />;
      case "InProgress":
        return <Loader className="w-4 h-4" />;
      case "Reviewed":
        return <ThumbsUp className="w-4 h-4" />;
      case "Completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleImageClick = (imagePath) => {
    setSelectedImage(`${BASE_URL}${imagePath}`);
  };

  const closeImagePreview = () => {
    setSelectedImage(null);
  };

  const renderDetailsTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row border-b border-gray-100">
          <div className="w-full md:w-1/2 p-5 md:border-r border-gray-100">
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
                <span className="text-sm font-medium text-gray-500">Dimensions</span>
                <span className="text-sm">{order.dimensions || "Not specified"}</span>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 p-5">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-indigo-50 p-2 rounded-lg">
                <User className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Customer Details</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Customer Name</span>
                <span className="text-sm font-semibold">{order.customer?.name || "Not available"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Email</span>
                <span className="text-sm">{order.customer?.email || "Not available"}</span>
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

      {/* Mark as Reviewed button */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Actions</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Update order status after reviewing</p>
                <div className="flex space-x-2">
                  {statusOptions.map(status => (
                    <span 
                      key={status}
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === status ? getStatusColor(status) : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {status}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={handleMarkAsReviewed}
                disabled={updateStatusLoading || order.status === "Reviewed" || order.status === "Completed"}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center 
                  ${order.status === "Reviewed" || order.status === "Completed" 
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed" 
                    : "bg-purple-600 text-white hover:bg-purple-700"}`}
              >
                {updateStatusLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Mark as Reviewed
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div> */}
      
      {order.image && order.image.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center space-x-3 p-5 border-b border-gray-100">
            <div className="bg-rose-50 p-2 rounded-lg">
              <Camera className="h-5 w-5 text-rose-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Reference Images</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {order.image.map((img, index) => (
                <div 
                  key={index} 
                  className="group relative rounded-lg overflow-hidden shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md"
                  onClick={() => handleImageClick(img)}
                >
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
          <span className="text-gray-600">Loading files...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center py-16">
          <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
          <span className="text-red-600 font-medium mb-2">Error loading files</span>
          <span className="text-gray-600 text-sm">{error}</span>
          <button 
            onClick={fetchFileData}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : !fileData || ((!fileData.cadFiles || fileData.cadFiles.length === 0) && 
                        (!fileData.images || fileData.images.length === 0)) ? (
        <div className="flex flex-col justify-center items-center py-16">
          <FileText className="h-10 w-10 text-gray-400 mb-4" />
          <span className="text-gray-600">No files available for this order</span>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Download All Files Button */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">All Files</h3>
                  <p className="text-sm text-gray-500">Download all order files in a single ZIP package</p>
                </div>
                <button
                  onClick={() => downloadFile(order._id, null, "all")}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium flex items-center hover:bg-indigo-700 transition-colors"
                  disabled={downloadingFile === `all-all-${order._id}`}
                >
                  {downloadingFile === `all-all-${order._id}` ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download All Files
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* CAD Files Section - Using the separated component */}
          <CadFilesSection 
            fileData={fileData} 
            order={order} 
            downloadFile={downloadFile} 
            downloadingFile={downloadingFile} 
            baseUrl={BASE_URL}
          />

          {/* Images Section - Using the separated component */}
          <ImagesSection 
            fileData={fileData} 
            order={order} 
            downloadFile={downloadFile} 
            downloadingFile={downloadingFile} 
            baseUrl={BASE_URL}
            onImageClick={handleImageClick}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Order Details: {order.orderId}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === "details" 
                ? "border-indigo-600 text-indigo-600" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Order Details
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === "files" 
                ? "border-indigo-600 text-indigo-600" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("files")}
          >
            Files & Downloads
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "details" ? renderDetailsTab() : renderFilesTab()}
        </div>
      </div>
      
      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[60] bg-black/90 overflow-hidden flex items-center justify-center" onClick={closeImagePreview}>
          <div className="relative max-w-[90%] max-h-[90%]">
            <img 
              src={selectedImage} 
              alt="Image preview" 
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button 
              className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
              onClick={closeImagePreview}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayOrderDetailsModal;