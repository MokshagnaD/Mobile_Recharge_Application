const express = require('express');
const router = express.Router();
const { Notification } = require('./schemas');
const { authenticateToken } = require('./authMiddleware');

// Get user's notifications
router.get('/:mobile', authenticateToken, async (req, res) => {
  try {
    const { mobile } = req.params;

    if (req.user.role !== 'admin' && req.user.mobile !== mobile && mobile !== 'ALL_USERS') {
      return res.status(403).json({ success: false, message: 'Unauthorized access to notifications' });
    }

    const notifications = await Notification.find({
      $or: [{ mobile }, { mobile: 'ALL_USERS' }]
    }).sort({ createdAt: -1 }).limit(50);

    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
  }
});

// Mark notification as read
router.patch('/:id/read', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark as read', error: error.message });
  }
});

// Delete single notification
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete notification', error: error.message });
  }
});

// Clear all notifications for user
router.delete('/:mobile/clear-all', authenticateToken, async (req, res) => {
  try {
    const { mobile } = req.params;
    if (req.user.role !== 'admin' && req.user.mobile !== mobile) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    await Notification.deleteMany({ mobile });
    res.json({ success: true, message: 'All notifications cleared successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to clear notifications', error: error.message });
  }
});

module.exports = router;
