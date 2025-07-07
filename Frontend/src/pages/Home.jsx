import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiShield, FiShare2, FiCloud, FiLock, FiUsers, FiFileText } from 'react-icons/fi';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: FiShield,
      title: 'Secure Storage',
      description: 'Your documents are encrypted and stored securely with bank-level security measures.'
    },
    {
      icon: FiShare2,
      title: 'Family Sharing',
      description: 'Share documents with family members while maintaining complete control over permissions.'
    },
    {
      icon: FiCloud,
      title: 'Cloud Access',
      description: 'Access your documents anytime, anywhere from any device with internet connectivity.'
    },
    {
      icon: FiLock,
      title: 'Privacy Protected',
      description: 'Your personal information is protected with advanced encryption and privacy controls.'
    },
    {
      icon: FiUsers,
      title: 'Aadhaar Linked',
      description: 'Secure authentication linked to your Aadhaar number for verified identity protection.'
    },
    {
      icon: FiFileText,
      title: 'All Document Types',
      description: 'Store PAN cards, passports, certificates, and other important government documents.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Secure Digital Document 
              <span className="block text-secondary-300">Management System</span>
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-primary-100">
              Store, manage, and share your government documents securely. 
              Access your PAN card, passport, Aadhaar, and other important documents 
              anytime, anywhere with complete security and family sharing capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-primary-700 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                  >
                    Get Started Today
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white hover:bg-white hover:text-primary-700 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="bg-white text-primary-700 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose SecureDoc?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of document management with our comprehensive, 
              secure, and user-friendly platform designed for modern India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="text-2xl text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Digital India, Secure Future
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join millions of Indians who are embracing digital document management. 
                Our platform aligns with the Government of India's vision for a paperless, 
                efficient, and transparent governance system.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Reduce Government Costs</h4>
                    <p className="text-gray-600">Lower overhead costs through digital transformation</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Prevent Document Loss</h4>
                    <p className="text-gray-600">Never lose important documents again with secure cloud storage</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Enhanced Accessibility</h4>
                    <p className="text-gray-600">Access services across education, healthcare, railways, and more</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Digital document management"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-primary-600 bg-opacity-10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-24 bg-primary-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Go Digital?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of users who have already made the switch to secure, 
              digital document management. Get started today and experience the future.
            </p>
            <Link
              to="/register"
              className="bg-white text-primary-700 hover:bg-gray-50 font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 inline-block"
            >
              Create Your Account Now
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;