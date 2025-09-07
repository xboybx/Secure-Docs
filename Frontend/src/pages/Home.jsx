import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FiShield,
  FiShare2,
  FiCloud,
  FiLock,
  FiUsers,
  FiFileText,
} from "react-icons/fi";

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: FiShield,
      title: "Secure Storage",
      description:
        "Your documents are encrypted and stored securely with bank-level security measures.",
    },
    {
      icon: FiShare2,
      title: "Family Sharing",
      description:
        "Share documents with family members while maintaining complete control over permissions.",
    },
    {
      icon: FiCloud,
      title: "Cloud Access",
      description:
        "Access your documents anytime, anywhere from any device with internet connectivity.",
    },
    {
      icon: FiLock,
      title: "Privacy Protected",
      description:
        "Your personal information is protected with advanced encryption and privacy controls.",
    },
    {
      icon: FiUsers,
      title: "Aadhaar Linked",
      description:
        "Secure authentication linked to your Aadhaar number for verified identity protection.",
    },
    {
      icon: FiFileText,
      title: "All Document Types",
      description:
        "Store PAN cards, passports, certificates, and other important government documents.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Secure Digital Document
              <span className="block text-secondary-300">
                Management System
              </span>
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-primary-100">
              Store, manage, and share your government documents securely.
              Access your PAN card, passport, Aadhaar, and other important
              documents anytime, anywhere with complete security and family
              sharing capabilities.
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

{/*       {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose SecureDoc?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of document management with our
              comprehensive, secure, and user-friendly platform designed for
              modern India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="text-2xl text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Instructions Section */}
      <section className="py-20 bg-gray-50 border-t border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary-700 mb-6 text-center">
            How to Use SecureDoc
          </h2>
          <div className="space-y-8 text-lg text-gray-700">
            <div>
              <h3 className="font-semibold text-xl mb-2 text-primary-600">
                1. Create an Account
              </h3>
              <ul className="list-disc pl-6">
                <li>
                  Click <b>Get Started Today</b> or{" "}
                  <b>Create Your Account Now</b> to register.
                </li>
                <li>
                  Fill in all required fields: Name, Email, Password (min 6
                  chars), Phone (10 digits), Aadhaar (12 digits), Date of Birth.
                </li>
                <li>Accept the Terms of Service and Privacy Policy.</li>
                <li>Verify your phone number via OTP if prompted.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-2 text-primary-600">
                2. Login
              </h3>
              <ul className="list-disc pl-6">
                <li>
                  Click <b>Sign In</b> and enter your registered email and
                  password.
                </li>
                <li>
                  Forgot password? Use the link on the login page to reset.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-2 text-primary-600">
                3. Upload Documents
              </h3>
              <ul className="list-disc pl-6">
                <li>
                  Go to <b>Upload Document</b> from your dashboard or documents
                  section.
                </li>
                <li>Click to browse or drag-and-drop your file.</li>
                <li>
                  <b>Allowed formats:</b> JPEG, PNG, PDF (max 10MB).
                </li>
                <li>
                  Fill in required details: Title, Document Type. Optionally add
                  description, issued by, document number, dates, tags.
                </li>
                <li>
                  Click <b>Upload Document</b> to save.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-2 text-primary-600">
                4. Document Upload Rules
              </h3>
              <ul className="list-disc pl-6">
                <li>Only upload your own or authorized documents.</li>
                <li>
                  Do not upload offensive, illegal, or copyrighted material.
                </li>
                <li>
                  Use clear titles and correct document types for easy
                  management.
                </li>
              </ul>
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
              Join thousands of users who have already made the switch to
              secure, digital document management. Get started today and
              experience the future.
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
