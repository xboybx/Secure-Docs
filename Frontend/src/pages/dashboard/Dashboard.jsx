import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { FiUpload, FiFileText, FiShare2, FiUsers, FiTrendingUp, FiFolder } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDocuments: 0,
    sharedDocuments: 0,
    familyMembers: 0,
    recentUploads: 0
  });
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [documentsRes, profileRes] = await Promise.all([
        axios.get('/documents?limit=5'),
        axios.get('/users/profile')
      ]);

      const documents = documentsRes.data.documents;
      const profile = profileRes.data.user;

      // Calculate stats
      const ownedDocs = documents.filter(doc => doc.owner._id === user._id);
      const sharedDocs = documents.filter(doc => doc.owner._id !== user._id);
      const recentUploads = documents.filter(doc => {
        const uploadDate = new Date(doc.createdAt);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return uploadDate > weekAgo && doc.owner._id === user._id;
      }).length;

      setStats({
        totalDocuments: ownedDocs.length,
        sharedDocuments: sharedDocs.length,
        familyMembers: profile.familyMembers?.length || 0,
        recentUploads
      });

      setRecentDocuments(documents.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Upload Document',
      description: 'Add a new document to your vault',
      icon: FiUpload,
      link: '/upload',
      color: 'primary'
    },
    {
      title: 'View All Documents',
      description: 'Browse your document collection',
      icon: FiFileText,
      link: '/documents',
      color: 'secondary'
    },
    {
      title: 'Shared Documents',
      description: 'Documents shared with you',
      icon: FiShare2,
      link: '/shared',
      color: 'green'
    },
    {
      title: 'Manage Profile',
      description: 'Update your profile and settings',
      icon: FiUsers,
      link: '/profile',
      color: 'purple'
    }
  ];

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your secure documents and share them with family members.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalDocuments}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <FiFileText className="text-xl text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shared with Me</p>
              <p className="text-3xl font-bold text-gray-900">{stats.sharedDocuments}</p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <FiShare2 className="text-xl text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Family Members</p>
              <p className="text-3xl font-bold text-gray-900">{stats.familyMembers}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiUsers className="text-xl text-green-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent Uploads</p>
              <p className="text-3xl font-bold text-gray-900">{stats.recentUploads}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="text-xl text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="card p-6 hover:shadow-lg transition-shadow duration-200 group"
            >
              <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-${action.color}-200 transition-colors duration-200`}>
                <action.icon className={`text-xl text-${action.color}-600`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Documents</h2>
          <Link
            to="/documents"
            className="text-primary-600 hover:text-primary-500 text-sm font-medium"
          >
            View all →
          </Link>
        </div>

        {recentDocuments.length > 0 ? (
          <div className="card">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentDocuments.map((doc) => (
                    <tr key={doc._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">
                            {getDocumentTypeIcon(doc.documentType)}
                          </span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {doc.title}
                            </div>
                            {doc.description && (
                              <div className="text-sm text-gray-500">
                                {doc.description.length > 50 
                                  ? `${doc.description.substring(0, 50)}...` 
                                  : doc.description
                                }
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
                          {doc.documentType.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doc.owner._id === user._id ? 'You' : `${doc.owner.firstName} ${doc.owner.lastName}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card p-8 text-center">
            <FiFolder className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
            <p className="text-gray-600 mb-4">Upload your first document to get started</p>
            <Link to="/upload" className="btn-primary">
              Upload Document
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;