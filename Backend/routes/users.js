import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('familyMembers.userId', 'firstName lastName email aadhaarNumber');

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }).escape(),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }).escape(),
  body('phoneNumber').optional().matches(/^[6-9]\d{9}$/),
  body('address.street').optional().trim().escape(),
  body('address.city').optional().trim().escape(),
  body('address.state').optional().trim().escape(),
  body('address.pincode').optional().matches(/^\d{6}$/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const updates = req.body;
    const user = await User.findById(req.user._id);

    // Check if phone number is being changed and if it's already taken
    if (updates.phoneNumber && updates.phoneNumber !== user.phoneNumber) {
      const existingUser = await User.findOne({ phoneNumber: updates.phoneNumber });
      if (existingUser) {
        return res.status(400).json({ message: 'Phone number already in use' });
      }
    }

    // Update fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        user[key] = updates[key];
      }
    });

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Add family member
router.post('/family-members', authenticateToken, [
  body('aadhaarNumber').matches(/^\d{12}$/),
  body('relationshipType').isIn(['parent', 'child', 'spouse', 'sibling', 'other']),
  body('permissions.canView').optional().isBoolean(),
  body('permissions.canDownload').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { aadhaarNumber, relationshipType, permissions = {} } = req.body;

    const familyMember = await User.findOne({ aadhaarNumber, isVerified: true });
    if (!familyMember) {
      return res.status(404).json({ message: 'Family member not found or not verified' });
    }

    if (familyMember._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot add yourself as family member' });
    }

    const user = await User.findById(req.user._id);

    // Check if already added
    const existingMember = user.familyMembers.find(
      member => member.userId.toString() === familyMember._id.toString()
    );

    if (existingMember) {
      return res.status(400).json({ message: 'Family member already added' });
    }

    user.familyMembers.push({
      userId: familyMember._id,
      relationshipType,
      permissions: {
        canView: permissions.canView !== undefined ? permissions.canView : true,
        canDownload: permissions.canDownload !== undefined ? permissions.canDownload : false
      }
    });

    await user.save();
    await user.populate('familyMembers.userId', 'firstName lastName email aadhaarNumber');

    res.json({
      message: 'Family member added successfully',
      familyMembers: user.familyMembers
    });

  } catch (error) {
    console.error('Add family member error:', error);
    res.status(500).json({ message: 'Failed to add family member' });
  }
});

// Search users by Aadhaar
router.get('/search', authenticateToken, [
  body('aadhaar').matches(/^\d{12}$/)
], async (req, res) => {
  try {
    const { aadhaar } = req.query;

    if (!aadhaar || !/^\d{12}$/.test(aadhaar)) {
      return res.status(400).json({ message: 'Valid 12-digit Aadhaar number required' });
    }

    const user = await User.findOne({ 
      aadhaarNumber: aadhaar, 
      isVerified: true 
    }).select('firstName lastName email aadhaarNumber');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Search user error:', error);
    res.status(500).json({ message: 'Failed to search user' });
  }
});

export default router;