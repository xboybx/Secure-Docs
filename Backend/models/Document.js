import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  documentType: {
    type: String,
    required: true,
    enum: [
      'aadhaar',
      'pan',
      'passport',
      'drivinglicense',
      'marksheet',
      'certificate',
      'income',
      'medical',
      'insurance',
      'property',
      'other'
    ]
  },
  fileData: {
    type: String, // Base64 encoded file data
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  issuedBy: {
    type: String,
    trim: true
  },
  issueDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  documentNumber: {
    type: String,
    trim: true
  },
  sharedWith: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permissions: {
      canView: { type: Boolean, default: true },
      canDownload: { type: Boolean, default: false },
      canShare: { type: Boolean, default: false }
    },
    sharedAt: { type: Date, default: Date.now },
    sharedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  verification: {
    isVerified: { type: Boolean, default: false },
    verifiedBy: String,
    verifiedAt: Date,
    verificationMethod: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
documentSchema.index({ owner: 1, documentType: 1 });
documentSchema.index({ 'sharedWith.userId': 1 });
documentSchema.index({ tags: 1 });
documentSchema.index({ createdAt: -1 });

export default mongoose.model('Document', documentSchema);