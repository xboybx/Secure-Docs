import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiCreditCard, FiPlus, FiTrash2 } from 'react-icons/fi';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });
  const [familyMembers, setFamilyMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    aadhaarNumber: '',
    relationshipType: '',
    permissions: {
      canView: true,
      canDownload: false
    }
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pincode: user.address?.pincode || ''
        }
      });
      setFamilyMembers(user.familyMembers || []);
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateProfile(profileData);
    
    if (result.success) {
      toast.success('Profile updated successfully!');
    }
    
    setLoading(false);
  };

  const handleAddFamilyMember = async (e) => {
    e.preventDefault();
    
    if (!newMember.aadhaarNumber || !newMember.relationshipType) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/users/family-members', newMember);
      setFamilyMembers(response.data.familyMembers);
      setNewMember({
        aadhaarNumber: '',
        relationshipType: '',
        permissions: {
          canView: true,
          canDownload: false
        }
      });
      toast.success('Family member added successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add family member';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const relationshipTypes = [
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'other', label: 'Other' }
  ];

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: FiUser },
    { id: 'family', label: 'Family Members', icon: FiUser }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account information and family connections</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="text-lg" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Information Tab */}
      {activeTab === 'profile' && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
          
          {/* Read-only Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <FiMail className="text-gray-400" />
                <span className="text-gray-900">{user?.email}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aadhaar Number
              </label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <FiCreditCard className="text-gray-400" />
                <span className="text-gray-900">
                  {user?.aadhaarNumber ? `****-****-${user.aadhaarNumber.slice(-4)}` : 'Not provided'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Aadhaar number cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <FiCalendar className="text-gray-400" />
                <span className="text-gray-900">
                  {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Date of birth cannot be changed</p>
            </div>
          </div>

          {/* Editable Information */}
          <form onSubmit={handleProfileSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    className="input-field pl-10"
                    placeholder="First name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    className="input-field pl-10"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleProfileChange}
                    className="input-field pl-10"
                    placeholder="10-digit mobile number"
                    maxLength="10"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                <FiMapPin className="text-gray-400" />
                <span>Address</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    name="address.street"
                    value={profileData.address.street}
                    onChange={handleProfileChange}
                    className="input-field"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="address.city"
                    value={profileData.address.city}
                    onChange={handleProfileChange}
                    className="input-field"
                    placeholder="City"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="address.state"
                    value={profileData.address.state}
                    onChange={handleProfileChange}
                    className="input-field"
                    placeholder="State"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="address.pincode"
                    value={profileData.address.pincode}
                    onChange={handleProfileChange}
                    className="input-field"
                    placeholder="PIN code"
                    maxLength="6"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <span>Update Profile</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Family Members Tab */}
      {activeTab === 'family' && (
        <div className="space-y-6">
          {/* Add Family Member */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Family Member</h2>
            
            <form onSubmit={handleAddFamilyMember} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="aadhaarNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Aadhaar Number *
                  </label>
                  <input
                    type="text"
                    id="aadhaarNumber"
                    value={newMember.aadhaarNumber}
                    onChange={(e) => setNewMember(prev => ({ ...prev, aadhaarNumber: e.target.value }))}
                    className="input-field"
                    placeholder="12-digit Aadhaar number"
                    maxLength="12"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="relationshipType" className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship *
                  </label>
                  <select
                    id="relationshipType"
                    value={newMember.relationshipType}
                    onChange={(e) => setNewMember(prev => ({ ...prev, relationshipType: e.target.value }))}
                    className="input-field"
                    required
                  >
                    <option value="">Select relationship</option>
                    {relationshipTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newMember.permissions.canView}
                      onChange={(e) => setNewMember(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, canView: e.target.checked }
                      }))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Can view documents</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newMember.permissions.canDownload}
                      onChange={(e) => setNewMember(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, canDownload: e.target.checked }
                      }))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Can download documents</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPlus />
                  <span>Add Family Member</span>
                </button>
              </div>
            </form>
          </div>

          {/* Family Members List */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Family Members</h2>
            
            {familyMembers.length > 0 ? (
              <div className="space-y-4">
                {familyMembers.map((member, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <FiUser className="text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {member.userId?.firstName} {member.userId?.lastName}
                          </h3>
                          <p className="text-sm text-gray-600 capitalize">{member.relationshipType}</p>
                          <p className="text-xs text-gray-500">
                            Added on {new Date(member.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex space-x-2 mb-1">
                            {member.permissions.canView && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">View</span>
                            )}
                            {member.permissions.canDownload && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Download</span>
                            )}
                          </div>
                        </div>
                        
                        <button className="text-red-600 hover:text-red-800 transition-colors duration-200">
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiUser className="text-4xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No family members added</h3>
                <p className="text-gray-600">Add family members to share documents with them</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;