import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import Document from '../models/Document.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Get all user documents
router.get('/', authenticateToken, [
  query('type').optional().isIn(['aadhaar', 'pan', 'passport', 'drivinglicense', 'marksheet', 'certificate', 'income', 'medical', 'insurance', 'property', 'other']),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { type, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = { 
      $or: [
        { owner: req.user._id },
        { 'sharedWith.userId': req.user._id }
      ],
      isActive: true
    };

    if (type) {
      filter.documentType = type;
    }

    const documents = await Document.find(filter)
      .populate('owner', 'firstName lastName email')
      .populate('sharedWith.userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-fileData'); // Exclude file data from list view for performance

    const total = await Document.countDocuments(filter);

    res.json({
      documents,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: documents.length,
        totalDocuments: total
      }
    });

  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Failed to fetch documents' });
  }
});

// Get single document with file data
router.get('/:id', authenticateToken, [
  param('id').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { id } = req.params;

    const document = await Document.findOne({
      _id: id,
      $or: [
        { owner: req.user._id },
        { 'sharedWith.userId': req.user._id }
      ],
      isActive: true
    })
    .populate('owner', 'firstName lastName email')
    .populate('sharedWith.userId', 'firstName lastName email');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ document });

  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ message: 'Failed to fetch document' });
  }
});

// Upload document
router.post('/upload', authenticateToken, upload.single('document'), [
  body('title').trim().isLength({ min: 1, max: 100 }).escape(),
  body('description').optional().trim().isLength({ max: 500 }).escape(),
  body('documentType').isIn(['aadhaar', 'pan', 'passport', 'drivinglicense', 'marksheet', 'certificate', 'income', 'medical', 'insurance', 'property', 'other']),
  body('issuedBy').optional().trim().escape(),
  body('issueDate').optional().isISO8601(),
  body('expiryDate').optional().isISO8601(),
  body('documentNumber').optional().trim().escape(),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description, documentType, issuedBy, issueDate, expiryDate, documentNumber, tags } = req.body;

    // Convert file buffer to base64
    const fileData = req.file.buffer.toString('base64');

    const document = new Document({
      title,
      description,
      documentType,
      fileData,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      owner: req.user._id,
      issuedBy,
      issueDate: issueDate ? new Date(issueDate) : undefined,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      documentNumber,
      tags: tags || []
    });

    await document.save();
    await document.populate('owner', 'firstName lastName email');

    // Return document without file data for response
    const responseDoc = document.toObject();
    delete responseDoc.fileData;

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: responseDoc
    });

  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ message: 'Failed to upload document' });
  }
});

// Update document
router.put('/:id', authenticateToken, [
  param('id').isMongoId(),
  body('title').optional().trim().isLength({ min: 1, max: 100 }).escape(),
  body('description').optional().trim().isLength({ max: 500 }).escape(),
  body('issuedBy').optional().trim().escape(),
  body('issueDate').optional().isISO8601(),
  body('expiryDate').optional().isISO8601(),
  body('documentNumber').optional().trim().escape(),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const updates = req.body;

    const document = await Document.findOne({ _id: id, owner: req.user._id, isActive: true });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Update fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        if (key === 'issueDate' || key === 'expiryDate') {
          document[key] = new Date(updates[key]);
        } else {
          document[key] = updates[key];
        }
      }
    });

    await document.save();
    await document.populate('owner', 'firstName lastName email');

    // Return document without file data for response
    const responseDoc = document.toObject();
    delete responseDoc.fileData;

    res.json({
      message: 'Document updated successfully',
      document: responseDoc
    });

  } catch (error) {
    console.error('Document update error:', error);
    res.status(500).json({ message: 'Failed to update document' });
  }
});

// Delete document (soft delete)
router.delete('/:id', authenticateToken, [
  param('id').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { id } = req.params;

    const document = await Document.findOne({ _id: id, owner: req.user._id, isActive: true });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    document.isActive = false;
    await document.save();

    res.json({ message: 'Document deleted successfully' });

  } catch (error) {
    console.error('Document delete error:', error);
    res.status(500).json({ message: 'Failed to delete document' });
  }
});

// Share document
router.post('/:id/share', authenticateToken, [
  param('id').isMongoId(),
  body('userEmail').isEmail().normalizeEmail(),
  body('permissions.canView').optional().isBoolean(),
  body('permissions.canDownload').optional().isBoolean(),
  body('permissions.canShare').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { userEmail, permissions = {} } = req.body;

    const document = await Document.findOne({ _id: id, owner: req.user._id, isActive: true });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const targetUser = await User.findOne({ email: userEmail, isVerified: true });
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found or not verified' });
    }

    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot share document with yourself' });
    }

    // Check if already shared
    const existingShare = document.sharedWith.find(
      share => share.userId.toString() === targetUser._id.toString()
    );

    if (existingShare) {
      return res.status(400).json({ message: 'Document already shared with this user' });
    }

    document.sharedWith.push({
      userId: targetUser._id,
      permissions: {
        canView: permissions.canView !== undefined ? permissions.canView : true,
        canDownload: permissions.canDownload !== undefined ? permissions.canDownload : false,
        canShare: permissions.canShare !== undefined ? permissions.canShare : false
      },
      sharedBy: req.user._id
    });

    await document.save();
    await document.populate('sharedWith.userId', 'firstName lastName email');

    // Return document without file data for response
    const responseDoc = document.toObject();
    delete responseDoc.fileData;

    res.json({
      message: 'Document shared successfully',
      document: responseDoc
    });

  } catch (error) {
    console.error('Document share error:', error);
    res.status(500).json({ message: 'Failed to share document' });
  }
});

export default router;