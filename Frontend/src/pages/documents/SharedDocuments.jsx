import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiDownload, FiEye, FiUser, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import DocumentViewer from '../../components/documents/DocumentViewer';

const SharedDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

  useEffect(() => {
    fetchSharedDocuments();
  }, []);

  const fetchSharedDocuments = async () => {
    try {
      const response = await axios.get('/documents');
      // Filter documents shared with the current user
      const sharedDocs = response.data.documents.filter(doc => 
        doc.sharedWith && doc.sharedWith.length > 0
      );
      setDocuments(sharedDocs);
    } catch (error) {
      console.error('Error fetching shared documents:', error);
      toast.error('Failed to fetch shared documents');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = (documentId) => {
    setSelectedDocumentId(documentId);
    setViewerOpen(true);
  };

  const handleDownloadDocument = async (documentId, fileName) => {
    try {
      const response = await axios.get(`/documents/${documentId}`);
      const document = response.data.document;
      
      const link = document.createElement('a');
      link.href = `data:${document.mimeType};base64,${document.fileData}`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  const getDocumentTypeIcon = (type) => {
    const icons = {
      aadhaar: '🆔',
      pan: '💳',
      passport: '📘',
      drivinglicense: '🚗',
      marksheet: '📜',
      certificate: '🏆',
      income: '💰',
      medical: '🏥',
      insurance: '🛡️',
      property: '🏠',
      other: '📄'
    };
    return icons[type] || '📄';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shared Documents</h1>
        <p className="text-gray-600 mt-2">Documents that have been shared with you by family members</p>
      </div>

      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div key={doc._id} className="document-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{getDocumentTypeIcon(doc.documentType)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{doc.title}</h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {doc.documentType.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                  </div>
                </div>
              </div>

              {doc.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {doc.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <FiUser className="text-gray-400" />
                  <span className="text-gray-500">Shared by:</span>
                  <span className="text-gray-900 font-medium">
                    {doc.owner.firstName} {doc.owner.lastName}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <FiCalendar className="text-gray-400" />
                  <span className="text-gray-500">Shared on:</span>
                  <span className="text-gray-900">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">File Size:</span>
                  <span className="text-gray-900">{formatFileSize(doc.fileSize)}</span>
                </div>

                {doc.issueDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Issue Date:</span>
                    <span className="text-gray-900">
                      {new Date(doc.issueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {doc.expiryDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Expiry:</span>
                    <span className={`${new Date(doc.expiryDate) < new Date() ? 'text-red-600' : 'text-gray-900'}`}>
                      {new Date(doc.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Permissions Info */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-700 mb-1">Your Permissions:</p>
                <div className="flex flex-wrap gap-2">
                  {doc.sharedWith.map((share, index) => (
                    <div key={index} className="flex space-x-2 text-xs">
                      {share.permissions.canView && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded">View</span>
                      )}
                      {share.permissions.canDownload && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">Download</span>
                      )}
                      {share.permissions.canShare && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">Share</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleViewDocument(doc._id)}
                  className="flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors duration-200 text-sm"
                >
                  <FiEye className="text-xs" />
                  <span>View</span>
                </button>
                
                {/* Check if user has download permission */}
                {doc.sharedWith.some(share => share.permissions.canDownload) && (
                  <button
                    onClick={() => handleDownloadDocument(doc._id, doc.fileName)}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors duration-200 text-sm"
                  >
                    <FiDownload className="text-xs" />
                    <span>Download</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <FiUser className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No shared documents</h3>
          <p className="text-gray-600">
            No documents have been shared with you yet. Ask your family members to share their documents with you.
          </p>
        </div>
      )}

      {/* Document Viewer Modal */}
      <DocumentViewer
        documentId={selectedDocumentId}
        isOpen={viewerOpen}
        onClose={() => {
          setViewerOpen(false);
          setSelectedDocumentId(null);
        }}
      />
    </div>
  );
};

export default SharedDocuments;