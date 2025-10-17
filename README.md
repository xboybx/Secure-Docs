# SecureDoc - Secure Digital Document Management System

## 🏛️ Overview

SecureDoc is a comprehensive digital document management system designed specifically for Indian citizens to securely store, manage, and share government documents. Built with modern web technologies, it provides a secure, user-friendly platform that aligns with India's Digital India initiative, enabling citizens to digitize their important documents while maintaining complete control over privacy and access.

[*Preview the Project*](https://secure-docs-client.onrender.com)

## 🎯 Purpose & Vision

### Primary Purpose
- **Digital Document Storage**: Secure cloud-based storage for government documents
- **Family Document Sharing**: Enable controlled sharing of documents among family members
- **Accessibility**: 24/7 access to important documents from anywhere
- **Security**: Bank-level encryption and security measures
- **Compliance**: Aadhaar-linked authentication for verified identity protection

### Target Audience
- **Individual Citizens**: Anyone needing secure document storage
- **Families**: Households wanting to share documents among members
- **Senior Citizens**: Elderly individuals who may need family assistance with documents
- **Students**: Young adults managing educational and identity documents
- **Working Professionals**: Individuals requiring quick access to documents for various services

## 🏗️ System Architecture

### Frontend (React.js)
```
src/
├── components/          # Reusable UI components
│   ├── documents/       # Document-specific components
│   └── layout/          # Layout components (Navbar, etc.)
├── contexts/            # React Context for state management
├── pages/               # Main application pages
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard and analytics
│   ├── documents/      # Document management pages
│   └── profile/        # User profile management
└── assets/             # Static assets
```

### Backend (Node.js/Express)
```
server/
├── models/             # MongoDB data models
├── routes/             # API route handlers
├── middleware/         # Authentication & security middleware
└── uploads/            # File upload handling
```

## 📋 Core Features

### 🔐 Authentication & Security
- **Aadhaar-linked Registration**: Secure identity verification using Aadhaar numbers
- **OTP Verification**: SMS/Email-based two-factor authentication
- **JWT Token Authentication**: Secure session management
- **Password Encryption**: bcrypt-based password hashing
- **Rate Limiting**: Protection against brute force attacks
- **CORS Protection**: Cross-origin request security

### 📄 Document Management
- **Multi-format Support**: JPEG, PNG, PDF document uploads
- **Document Categories**: 
  - Aadhaar Card
  - PAN Card
  - Passport
  - Driving License
  - Educational Certificates
  - Income Documents
  - Medical Records
  - Insurance Papers
  - Property Documents
  - Other miscellaneous documents

- **Metadata Management**: Title, description, issue/expiry dates, document numbers
- **File Size Optimization**: 10MB upload limit with compression
- **Search & Filter**: Advanced search by title, type, and metadata
- **Document Viewer**: In-browser preview for images and PDFs
- **Secure Download**: Controlled document download with permissions

### 👨‍👩‍👧‍👦 Family Sharing System
- **Family Member Addition**: Add family members using Aadhaar numbers
- **Relationship Mapping**: Define relationships (parent, child, spouse, sibling)
- **Permission Control**: Granular permissions (view, download, share)
- **Shared Document View**: Dedicated interface for documents shared with you
- **Access Tracking**: Monitor who has access to your documents

### 📊 Dashboard & Analytics
- **Document Statistics**: Total documents, shared documents, family members
- **Recent Activity**: Track recent uploads and document access
- **Quick Actions**: Fast access to common operations
- **Visual Analytics**: Charts and graphs for document insights
- **Expiry Alerts**: Notifications for documents nearing expiry

## 🛠️ Technical Stack

### Frontend Technologies
- **React 18.3.1**: Modern React with hooks and functional components
- **React Router DOM**: Client-side routing and navigation
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **React Icons**: Comprehensive icon library
- **React Hot Toast**: User-friendly notification system
- **Axios**: HTTP client for API communication

### Backend Technologies
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for document storage
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token for authentication
- **bcryptjs**: Password hashing and encryption
- **Multer**: File upload handling
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing
- **Express Rate Limit**: API rate limiting

### Development Tools
- **Vite**: Fast build tool and development server
- **ESLint**: Code linting and quality assurance
- **Concurrently**: Run multiple npm scripts simultaneously
- **Nodemon**: Automatic server restart during development

## 📁 Detailed File Structure Analysis

### Core Application Files

#### `/src/App.jsx`
- **Purpose**: Main application component with routing configuration
- **Features**: Protected routes, public routes, loading states
- **Usage**: Entry point for the React application

#### `/src/contexts/AuthContext.jsx`
- **Purpose**: Global authentication state management
- **Features**: Login, register, OTP verification, profile updates
- **Usage**: Provides authentication context to all components

#### `/src/components/layout/Navbar.jsx`
- **Purpose**: Main navigation component
- **Features**: Responsive design, user menu, authentication status
- **Usage**: Consistent navigation across all pages

### Authentication System

#### `/src/pages/auth/Register.jsx`
- **Purpose**: User registration with comprehensive form validation
- **Features**: Multi-step form, Aadhaar validation, address collection
- **Usage**: New user onboarding

#### `/src/pages/auth/Login.jsx`
- **Purpose**: User authentication interface
- **Features**: Email/password login, remember me, forgot password
- **Usage**: Existing user access

#### `/src/pages/auth/VerifyOTP.jsx`
- **Purpose**: OTP verification for account activation
- **Features**: 6-digit OTP input, resend functionality, countdown timer
- **Usage**: Account verification after registration

### Document Management

#### `/src/pages/documents/Documents.jsx`
- **Purpose**: Main document listing and management interface
- **Features**: Grid view, search, filter, pagination, document actions
- **Usage**: Primary document management hub

#### `/src/pages/documents/UploadDocument.jsx`
- **Purpose**: Document upload interface with metadata collection
- **Features**: Drag-and-drop upload, file validation, metadata forms
- **Usage**: Adding new documents to the system

#### `/src/pages/documents/SharedDocuments.jsx`
- **Purpose**: View documents shared by family members
- **Features**: Permission-based access, owner information, download controls
- **Usage**: Accessing family-shared documents

#### `/src/components/documents/DocumentViewer.jsx`
- **Purpose**: In-browser document preview and download
- **Features**: PDF viewer, image zoom, download functionality
- **Usage**: Viewing documents without downloading

### User Management

#### `/src/pages/profile/Profile.jsx`
- **Purpose**: User profile management and family member administration
- **Features**: Profile editing, family member addition, permission management
- **Usage**: Account settings and family connections

#### `/src/pages/dashboard/Dashboard.jsx`
- **Purpose**: Main dashboard with statistics and quick actions
- **Features**: Document statistics, recent activity, quick navigation
- **Usage**: Application home page after login

### Backend API Structure

#### `/server/models/User.js`
- **Purpose**: User data model with validation and security
- **Features**: Password hashing, data validation, family relationships
- **Usage**: User account management

#### `/server/models/Document.js`
- **Purpose**: Document data model with metadata and sharing
- **Features**: File storage, sharing permissions, document categorization
- **Usage**: Document storage and retrieval

#### `/server/routes/auth.js`
- **Purpose**: Authentication API endpoints
- **Features**: Registration, login, OTP verification, password reset
- **Usage**: User authentication services

#### `/server/routes/documents.js`
- **Purpose**: Document management API endpoints
- **Features**: Upload, download, sharing, metadata management
- **Usage**: Document CRUD operations

#### `/server/routes/users.js`
- **Purpose**: User profile and family management APIs
- **Features**: Profile updates, family member management, user search
- **Usage**: User account services

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Environment Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with required variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/secure-docs
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   SMS_API_KEY=your-sms-api-key
   SMS_SENDER_ID=your-sender-id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🔒 Security Features

### Data Protection
- **Encryption**: All sensitive data encrypted at rest and in transit
- **Access Control**: Role-based permissions for document access
- **Audit Trail**: Comprehensive logging of all document operations
- **Secure File Storage**: Base64 encoding with MongoDB storage
- **Input Validation**: Server-side validation for all user inputs

### Authentication Security
- **Multi-factor Authentication**: OTP-based verification
- **Session Management**: Secure JWT token handling
- **Password Security**: bcrypt hashing with salt rounds
- **Account Lockout**: Protection against brute force attacks
- **Secure Headers**: Helmet.js for security headers

## 🌟 Benefits to Users

### For Individual Citizens
- **Document Safety**: Never lose important documents again
- **Quick Access**: Instant access to documents for government services
- **Reduced Paperwork**: Digital copies accepted by many services
- **Organization**: Systematic categorization and search capabilities
- **Backup Security**: Cloud-based backup prevents physical loss

### For Families
- **Shared Access**: Family members can access necessary documents
- **Emergency Situations**: Quick access during medical or legal emergencies
- **Elderly Care**: Children can help parents manage documents
- **Travel Convenience**: Access documents while traveling
- **Inheritance Planning**: Organized document sharing for estate planning

### For Government & Society
- **Reduced Costs**: Lower administrative overhead
- **Faster Processing**: Quick document verification
- **Reduced Fraud**: Secure, verified document storage
- **Environmental Impact**: Reduced paper usage
- **Digital India Alignment**: Supports government digitization goals

## 📈 Use Cases

### Personal Document Management
- Store and organize all government-issued documents
- Set expiry reminders for time-sensitive documents
- Quick retrieval for job applications, loan processes, etc.

### Family Document Sharing
- Parents sharing documents with adult children
- Spouses accessing each other's documents
- Grandparents' documents accessible to family members

### Emergency Situations
- Medical emergencies requiring insurance documents
- Legal situations needing identity proofs
- Travel emergencies requiring passport/visa copies

### Professional Requirements
- Job applications requiring educational certificates
- Loan applications needing income documents
- Business registrations requiring identity proofs

## 🔮 Future Enhancements

### Planned Features
- **Mobile Application**: Native iOS and Android apps
- **OCR Integration**: Automatic text extraction from documents
- **Blockchain Verification**: Immutable document verification
- **AI-powered Organization**: Smart document categorization
- **Government Integration**: Direct API connections with government services
- **Multi-language Support**: Regional language interfaces
- **Advanced Analytics**: Document usage patterns and insights

### Technical Improvements
- **Microservices Architecture**: Scalable service-oriented design
- **Real-time Notifications**: WebSocket-based instant updates
- **Advanced Search**: Elasticsearch integration for better search
- **CDN Integration**: Faster document delivery
- **Automated Backups**: Regular data backup and recovery systems

## 🤝 Contributing

We welcome contributions from the community. Please read our contributing guidelines and submit pull requests for any improvements.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and queries:
- Email: support@securedoc.in
- Documentation: [docs.securedoc.in](https://docs.securedoc.in)
- Community Forum: [community.securedoc.in](https://community.securedoc.in)

## 🙏 Acknowledgments

- Government of India's Digital India initiative
- Open source community for the amazing tools and libraries
- Beta testers and early adopters for valuable feedback

---

**SecureDoc** - Empowering Digital India, One Document at a Time 🇮🇳
