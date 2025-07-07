import { useState, useEffect } from "react";
import { FiX, FiDownload, FiZoomIn, FiZoomOut } from "react-icons/fi";
import axios from "axios";

const DocumentViewer = ({ documentId, isOpen, onClose }) => {
  const [doc, setDoc] = useState(null); // Renamed from 'document' to 'doc'
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    if (isOpen && documentId) {
      fetchDocument();
    }
  }, [isOpen, documentId]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      // Use axios for consistent API base URL and error handling
      const response = await axios.get(`/documents/${documentId}`);
      setDoc(response.data.document); // Renamed setter
    } catch (error) {
      console.error("Error fetching document:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!doc) return;
    // Use Blob for binary download (safer for large files)
    const byteCharacters = atob(doc.fileData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: doc.mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = doc.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl max-h-full w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {doc?.title || "Loading..."}
            </h3>
            {doc && (
              <p className="text-sm text-gray-600">
                {doc.fileName} • {doc.mimeType}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Zoom Controls for Images */}
            {doc && doc.mimeType.startsWith("image/") && (
              <>
                <button
                  onClick={handleZoomOut}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
                  title="Zoom Out"
                >
                  <FiZoomOut />
                </button>
                <span className="text-sm text-gray-600 px-2">{zoom}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
                  title="Zoom In"
                >
                  <FiZoomIn />
                </button>
              </>
            )}

            <button
              onClick={handleDownload}
              disabled={!doc}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md disabled:opacity-50"
              title="Download"
            >
              <FiDownload />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              title="Close"
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : doc ? (
            <div className="flex justify-center">
              {doc.mimeType === "application/pdf" ? (
                <iframe
                  src={`data:${doc.mimeType};base64,${doc.fileData}`}
                  className="w-full h-96 border rounded-lg"
                  title={doc.title}
                />
              ) : doc.mimeType.startsWith("image/") ? (
                <img
                  src={`data:${doc.mimeType};base64,${doc.fileData}`}
                  alt={doc.title}
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  style={{ transform: `scale(${zoom / 100})` }}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Preview not available for this file type
                  </p>
                  <button onClick={handleDownload} className="mt-4 btn-primary">
                    Download to View
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Failed to load document</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
