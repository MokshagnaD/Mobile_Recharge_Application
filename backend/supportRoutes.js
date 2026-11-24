const express = require('express');
const router = express.Router();
const { SupportTicket, Notification } = require('./schemas');
const { authenticateToken } = require('./authMiddleware');
const { checkRole } = require('./roleMiddleware');

// Get user's support tickets
router.get('/tickets/:mobile', authenticateToken, async (req, res) => {
  try {
    const { mobile } = req.params;
    if (req.user.role !== 'admin' && req.user.mobile !== mobile) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const tickets = await SupportTicket.find({ mobile }).sort({ createdAt: -1 });
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch support tickets', error: error.message });
  }
});

// Create new support ticket
router.post('/tickets', authenticateToken, async (req, res) => {
  try {
    const { mobile, issueType, description, lastRecharge } = req.body;
    if (!issueType) {
      return res.status(400).json({ success: false, message: 'Issue type is required' });
    }

    const ticketId = 'JIO-SUP' + Date.now().toString().slice(-6);
    const ticket = new SupportTicket({
      ticketId,
      mobile: mobile || req.user.mobile,
      issueType,
      description: description || 'No additional description provided',
      lastRecharge,
      status: 'Open'
    });

    await ticket.save();

    // Auto-create notification for ticket submission
    try {
      const notification = new Notification({
        mobile: mobile || req.user.mobile,
        type: 'support',
        title: 'Support Ticket Raised',
        message: `Your ticket #${ticketId} for "${issueType}" is logged. Our Jio support team will resolve it within 24 hours.`,
        priority: 'high'
      });
      await notification.save();
    } catch (_) {}

    res.json({ success: true, ticketId, ticket, message: 'Support ticket created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create support ticket', error: error.message });
  }
});

// Admin: Get all support tickets
router.get('/admin/tickets', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch tickets', error: error.message });
  }
});

// Admin: Update ticket status
router.patch('/admin/tickets/:ticketId', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, resolution } = req.body;

    const ticket = await SupportTicket.findOneAndUpdate(
      { ticketId },
      { status, resolution, updatedAt: new Date() },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Notify user
    try {
      await Notification.create({
        mobile: ticket.mobile,
        type: 'support',
        title: `Ticket #${ticketId} ${status}`,
        message: `Your support request has been marked as ${status}.${resolution ? ` Notes: ${resolution}` : ''}`,
        priority: 'medium'
      });
    } catch (_) {}

    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update ticket status', error: error.message });
  }
});

module.exports = router;
