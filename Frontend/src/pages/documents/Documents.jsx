import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEdit,
  FiTrash2,
  FiShare2,
  FiEye,
} from "react-icons/fi";
import {
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";
import toast from "react-hot-toast";
import DocumentViewer from "../../components/documents/DocumentViewer";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareDocId, setShareDocId] = useState(null);
  const [shareDoc, setShareDoc] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDoc, setEditDoc] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const documentTypes = [
    { value: "", label: "All Types" },
    { value: "aadhaar", label: "Aadhaar Card" },
    { value: "pan", label: "PAN Card" },
    { value: "passport", label: "Passport" },
    { value: "drivinglicense", label: "Driving License" },
    { value: "marksheet", label: "Mark Sheet" },
    { value: "certificate", label: "Certificate" },
    { value: "income", label: "Income Document" },
    { value: "medical", label: "Medical Document" },
    { value: "insurance", label: "Insurance" },
    { value: "property", label: "Property Document" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    fetchDocuments();
  }, [currentPage, selectedType]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
      };

      if (selectedType) params.type = selectedType;

      const response = await axios.get("/documents", { params });
      setDocuments(response.data.documents);
      setTotalPages(response.data.pagination.total);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      await axios.delete(`/documents/${documentId}`);
      toast.success("Document deleted successfully");
      fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };

  const handleViewDocument = (documentId) => {
    setSelectedDocumentId(documentId);
    setViewerOpen(true);
  };

  const handleDownloadDocument = async (documentId, fileName) => {
    try {
      const response = await axios.get(`/documents/${documentId}`);
      const doc = response.data.document; // Renamed from 'document' to 'doc'

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
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document");
    }
  };

  const handleOpenShareModal = (docId) => {
    setShareDocId(docId);
    const doc = documents.find((d) => d._id === docId);
    setShareDoc(doc);
    setShareModalOpen(true);
  };

  const handleOpenEditModal = (doc) => {
    setEditDoc(doc);
    setEditTitle(doc.title);
    setEditDescription(doc.description || "");
    setEditModalOpen(true);
  };

  const handleEditDocument = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/documents/${editDoc._id}`, {
        title: editTitle,
        description: editDescription,
      });
      toast.success("Document updated successfully!");
      setEditModalOpen(false);
      setEditDoc(null);
      fetchDocuments();
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error(
        error.response?.data?.message || "Failed to update document."
      );
    }
  };

  const getDocumentTypeIcon = (type) => {
    const icons = {
      aadhaar: "🆔",
      pan: "💳",
      passport: "📘",
      drivinglicense: "🚗",
      marksheet: "📜",
      certificate: "🏆",
      income: "💰",
      medical: "🏥",
      insurance: "🛡️",
      property: "🏠",
      other: "📄",
    };
    return icons[type] || "📄";
  };

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
          <p className="text-gray-600 mt-1">
            Manage your secure document collection
          </p>
        </div>
        <Link
          to="/upload"
          className="btn-primary mt-4 sm:mt-0 flex items-center space-x-2"
        >
          <FiPlus />
          <span>Upload Document</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="sm:w-64">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input-field"
            >
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredDocuments.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div key={doc._id} className="document-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">
                      {getDocumentTypeIcon(doc.documentType)}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {doc.documentType.replace(/([A-Z])/g, " $1").trim()}
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
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">File Size:</span>
                    <span className="text-gray-900">
                      {formatFileSize(doc.fileSize)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Uploaded:</span>
                    <span className="text-gray-900">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
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
                      <span
                        className={`${
                          new Date(doc.expiryDate) < new Date()
                            ? "text-red-600"
                            : "text-gray-900"
                        }`}
                      >
                        {new Date(doc.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
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
                  <button
                    onClick={() =>
                      handleDownloadDocument(doc._id, doc.fileName)
                    }
                    className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors duration-200 text-sm"
                  >
                    <FiDownload className="text-xs" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => handleOpenShareModal(doc._id)}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200 text-sm"
                  >
                    <FiShare2 className="text-xs" />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(doc)}
                    className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm"
                  >
                    <FiEdit className="text-xs" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200 text-sm"
                  >
                    <FiTrash2 className="text-xs" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-2 border border-gray-300 rounded-md text-sm font-medium ${
                      currentPage === index + 1
                        ? "bg-primary-600 text-white border-primary-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="card p-8 text-center">
          <FiFilter className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No documents found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedType
              ? "Try adjusting your search filters"
              : "Upload your first document to get started"}
          </p>
          <Link to="/upload" className="btn-primary">
            Upload Document
          </Link>
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

      {/* Share Modal */}
      {shareModalOpen && shareDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Share Document</h2>
            <p className="mb-4 text-gray-700">
              Share <span className="font-semibold">{shareDoc.title}</span> via:
            </p>
            <div className="flex justify-center gap-6 mb-4">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Check out this document: ${window.location.origin}/documents/${shareDoc._id}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 text-3xl hover:scale-110 transition-transform"
                title="Share on WhatsApp"
              >
                <FaWhatsapp />
              </a>
              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  `${window.location.origin}/documents/${shareDoc._id}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-3xl hover:scale-110 transition-transform"
                title="Share on Facebook"
              >
                <FaFacebook />
              </a>
              {/* Twitter/X */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  `${window.location.origin}/documents/${shareDoc._id}`
                )}&text=${encodeURIComponent(
                  `Check out this document: ${shareDoc.title}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 text-3xl hover:scale-110 transition-transform"
                title="Share on Twitter/X"
              >
                <FaTwitter />
              </a>
              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  `${window.location.origin}/documents/${shareDoc._id}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 text-3xl hover:scale-110 transition-transform"
                title="Share on LinkedIn"
              >
                <FaLinkedin />
              </a>
              {/* Email */}
              <a
                href={`mailto:?subject=${encodeURIComponent(
                  `Check out this document: ${shareDoc.title}`
                )}&body=${encodeURIComponent(
                  `${window.location.origin}/documents/${shareDoc._id}`
                )}`}
                className="text-gray-700 text-3xl hover:scale-110 transition-transform"
                title="Share via Email"
              >
                <FaEnvelope />
              </a>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShareModalOpen(false)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && editDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Document</h2>
            <form onSubmit={handleEditDocument}>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Document Name
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="input-field w-full mb-4"
                required
              />
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="input-field w-full mb-4"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
