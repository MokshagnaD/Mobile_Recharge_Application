const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    default: 'Jio Subscriber'
  },
  address: {
    type: String,
    default: ''
  },
  pincode: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  simType: {
    type: String,
    enum: ['Prepaid', 'Postpaid'],
    default: 'Prepaid'
  },
  telecomCircle: {
    type: String,
    default: 'India - National'
  }
}, {
  timestamps: true
});

// Plan Schema - Enhanced for authentic Jio Range
const planSchema = new mongoose.Schema({
  planName: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  dataLimit: {
    type: String,
    required: true
  },
  validity: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['popular', '5g', 'entertainment', 'booster', 'annual', 'topup'],
    default: 'popular'
  },
  tag: {
    type: String,
    default: ''
  },
  voice: {
    type: String,
    default: 'Truly Unlimited Calls'
  },
  sms: {
    type: String,
    default: '100 SMS/day'
  },
  ottBenefits: {
    type: [String],
    default: ['JioCinema', 'JioTV', 'JioCloud']
  },
  details: {
    type: String,
    default: 'Unlimited 5G Data on eligible devices. High-speed data followed by unlimited at 64 Kbps.'
  },
  planStatus: {
    type: String,
    enum: ['Active', 'Expired'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Subscription Schema
const subscriptionSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  planname: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    default: 0
  },
  dataLimit: {
    type: String,
    default: '1.5GB/day'
  },
  subscriptionDuration: {
    type: Number,
    required: true
  },
  subscriptionDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    default: function() {
      return new Date(Date.now() + this.subscriptionDuration * 24 * 60 * 60 * 1000);
    }
  },
  status: {
    type: String,
    enum: ['Active', 'Expired', 'Prepaid', 'Pending', 'Failed'],
    default: 'Active'
  },
  transactionId: {
    type: String,
    default: () => 'JIO' + Date.now().toString().slice(-8)
  },
  paymentMethod: {
    type: String,
    default: 'JioPay UPI'
  }
}, {
  timestamps: true
});

// Support Ticket Schema
const supportTicketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  issueType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: 'No additional description provided'
  },
  lastRecharge: {
    planName: String,
    amount: String,
    date: Date
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  resolution: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['recharge', 'expiry', 'usage', 'security', 'system', 'support', 'offer']
  },
  title: {
    type: String,
    required: true,
    maxlength: 120
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Refund Schema
const refundSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    required: true
  },
  planName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Refunded', 'Processing'],
    default: 'Pending'
  },
  initiatedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date
  },
  eta: {
    type: Date,
    default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  },
  reason: {
    type: String,
    default: 'User requested cancellation of prepaid pack'
  }
}, {
  timestamps: true
});

// User Settings Schema
const settingsSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  notifications: {
    type: Boolean,
    default: true
  },
  language: {
    type: String,
    default: 'en'
  },
  sessionTimeout: {
    type: Number,
    default: 30
  },
  biometric: {
    type: Boolean,
    default: false
  },
  autoRecharge: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Plan = mongoose.models.Plan || mongoose.model('Plan', planSchema);
const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
const SupportTicket = mongoose.models.SupportTicket || mongoose.model('SupportTicket', supportTicketSchema);
const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
const Refund = mongoose.models.Refund || mongoose.model('Refund', refundSchema);
const UserSettings = mongoose.models.UserSettings || mongoose.model('UserSettings', settingsSchema);

module.exports = {
  User,
  Plan,
  Subscription,
  SupportTicket,
  Notification,
  Refund,
  UserSettings
};
