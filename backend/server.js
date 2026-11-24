const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const { connectDB } = require('./database');
const {
  User,
  Plan,
  Subscription,
  SupportTicket,
  Notification,
  Refund,
  UserSettings
} = require('./schemas');
const { authenticateToken } = require('./authMiddleware');
const { checkRole } = require('./roleMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'jio-secure-jwt-secret-key-2026';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Complete Authentic Jio Range Plans
const defaultJioPlans = [
  // True 5G Unlimited Range
  {
    planName: "Jio True 5G ₹349",
    price: 349,
    dataLimit: "2GB/day",
    validity: 28,
    category: "5g",
    tag: "True 5G Unlimited",
    voice: "Truly Unlimited Calls",
    sms: "100 SMS/day",
    ottBenefits: ["JioCinema", "JioTV", "JioCloud"],
    details: "Unlimited 5G Data for 28 days with zero extra charge on 5G devices. High speed 2GB/day on 4G.",
    planStatus: "Active"
  },
  {
    planName: "Jio True 5G ₹399",
    price: 399,
    dataLimit: "2.5GB/day",
    validity: 28,
    category: "5g",
    tag: "Best Value 5G",
    voice: "Truly Unlimited Calls",
    sms: "100 SMS/day",
    ottBenefits: ["JioCinema", "JioTV", "JioCloud"],
    details: "High-speed 2.5GB/day + Unlimited True 5G Data across India.",
    planStatus: "Active"
  },
  {
    planName: "Jio True 5G ₹899",
    price: 899,
    dataLimit: "2GB/day",
    validity: 90,
    category: "5g",
    tag: "Quarterly Dhamaka",
    voice: "Truly Unlimited Calls",
    sms: "100 SMS/day",
    ottBenefits: ["JioCinema", "JioTV", "JioCloud"],
    details: "90 Days of nonstop 2GB/day + Unlimited True 5G Data.",
    planStatus: "Active"
  },

  // Popular Bestsellers
  {
    planName: "Jio Hero ₹299",
    price: 299,
    dataLimit: "1.5GB/day",
    validity: 28,
    category: "popular",
    tag: "Bestseller",
    voice: "Truly Unlimited Calls",
    sms: "100 SMS/day",
    ottBenefits: ["JioCinema", "JioTV", "JioCloud"],
    details: "India's favorite recharge pack with 1.5GB/day for 28 days.",
    planStatus: "Active"
  },
  {
    planName: "Jio Pocket ₹199",
    price: 199,
    dataLimit: "1.5GB/day",
    validity: 18,
    category: "popular",
    tag: "Budget Pick",
    voice: "Truly Unlimited Calls",
    sms: "100 SMS/day",
    ottBenefits: ["JioTV", "JioCinema"],
    details: "Pocket-friendly unlimited voice calls and 1.5GB daily data.",
    planStatus: "Active"
  },
  {
    planName: "Jio Super Value ₹749",
    price: 749,
    dataLimit: "2GB/day",
    validity: 72,
    category: "popular",
    tag: "Trending",
    voice: "Truly Unlimited Calls",
    sms: "100 SMS/day",
    ottBenefits: ["JioCinema", "JioTV", "JioCloud"],
    details: "72 days of seamless 2GB/day data & unlimited calls across all networks.",
    planStatus: "Active"
  },

  // Entertainment & OTT Bundles
  {
    planName: "Jio Hotstar ₹449",
    price: 449,
    dataLimit: "3GB/day",
    validity: 28,
    category: "entertainment",
    tag: "Disney+ Hotstar",
    voice: "Truly Unlimited Calls",
    sms: "100 SMS/day",
    ottBenefits: ["Disney+ Hotstar (3M)", "JioCinema", "JioTV", "JioCloud"],
    details: "Free Disney+ Hotstar Mobile 3-month subscription included + 3GB/day.",
    planStatus: "Active"
  },
  {
    planName: "Jio SonyLIV ₹175",
    price: 175,
    dataLimit: "10GB Bulk",
    validity: 28,
    category: "entertainment",
    tag: "SonyLIV & ZEE5",
    voice: "Data Only",
    sms: "NA",
    ottBenefits: ["SonyLIV", "ZEE5", "JioCinema"],
    details: "10GB high speed data + 28 days of SonyLIV and ZEE5 access.",
    planStatus: "Active"
  },
  {
    planName: "Jio Prime Video ₹1029",
    price: 1029,
    dataLimit: "2GB/day",
    validity: 84,
    category: "entertainment",
    tag: "Amazon Prime Video",
    voice: "Truly Unlimited Calls",
    sms: "100 SMS/day",
    ottBenefits: ["Amazon Prime Video", "JioCinema Premium", "JioTV"],
    details: "84 days unlimited data + Amazon Prime Video Mobile Edition included.",
    planStatus: "Active"
  },

  // Data Booster / Add-ons
  {
    planName: "4G/5G Booster ₹19",
    price: 19,
    dataLimit: "1GB",
    validity: 1,
    category: "booster",
    tag: "Add-on",
    voice: "Existing Pack",
    sms: "NA",
    ottBenefits: ["JioCloud"],
    details: "Instant 1GB high speed data booster valid till active base plan.",
    planStatus: "Active"
  },
  {
    planName: "4G/5G Booster ₹29",
    price: 29,
    dataLimit: "2GB",
    validity: 1,
    category: "booster",
    tag: "Add-on",
    voice: "Existing Pack",
    sms: "NA",
    ottBenefits: ["JioCloud"],
    details: "Instant 2GB high speed data booster valid till active base plan.",
    planStatus: "Active"
  },
  {
    planName: "Bulk Data Booster ₹69",
    price: 69,
    dataLimit: "6GB",
    validity: 7,
    category: "booster",
    tag: "Best Value Add-on",
    voice: "Existing Pack",
    sms: "NA",
    ottBenefits: ["JioCloud"],
    details: "6GB high speed data booster for seamless streaming and gaming.",
    planStatus: "Active"
  },

  // Annual Value Range
  {
    planName: "Jio Annual Dhamaka ₹2999",
    price: 2999,
    dataLimit: "2.5GB/day",
    validity: 365,
    category: "annual",
    tag: "Annual Saver",
    voice: "Truly Unlimited Calls",
    sms: "100 SMS/day",
    ottBenefits: ["JioCinema", "JioTV", "JioCloud", "True 5G Unlimited"],
    details: "Full 365 days peace of mind with 912.5GB total data & unlimited 5G.",
    planStatus: "Active"
  },
  {
    planName: "Jio Annual VIP ₹3599",
    price: 3599,
    dataLimit: "2.5GB/day",
    validity: 365,
    category: "annual",
    tag: "VIP All-Access",
    voice: "Truly Unlimited Calls",
    sms: "100 SMS/day",
    ottBenefits: ["Disney+ Hotstar (1 Year)", "Prime Video", "JioCinema Premium"],
    details: "1 Year of nonstop data + all major OTT entertainment subscriptions.",
    planStatus: "Active"
  },

  // Top-up
  {
    planName: "Jio Talktime ₹50",
    price: 50,
    dataLimit: "No Data",
    validity: 999,
    category: "topup",
    tag: "Talktime",
    voice: "₹39.37 Talktime",
    sms: "Standard Rates",
    ottBenefits: [],
    details: "Unlimited validity talktime balance for calls, international roaming, and VAS.",
    planStatus: "Active"
  },
  {
    planName: "Jio Talktime ₹100",
    price: 100,
    dataLimit: "No Data",
    validity: 999,
    category: "topup",
    tag: "Talktime",
    voice: "₹81.75 Talktime",
    sms: "Standard Rates",
    ottBenefits: [],
    details: "Unlimited validity talktime balance with ₹81.75 value.",
    planStatus: "Active"
  }
];

// In-Memory resilient state
const memoryStore = {
  users: new Map(),
  plans: defaultJioPlans.map((p, index) => ({ ...p, _id: 'mem_plan_' + (index + 1), id: index + 1 })),
  subscriptions: [],
  supportTickets: [],
  notifications: [],
  refunds: [],
  settings: new Map()
};

// Seed default plans into DB or Memory
const initializePlans = async () => {
  try {
    const planCount = await Plan.countDocuments();
    if (planCount < defaultJioPlans.length) {
      await Plan.deleteMany({});
      await Plan.insertMany(defaultJioPlans);
      console.log('Jio range plans updated in MongoDB (' + defaultJioPlans.length + ' plans)');
    }
  } catch (error) {
    console.log('MongoDB plan seeding skipped, using memory store');
  }
};
setTimeout(initializePlans, 1500);

// OTP Store (temporary memory cache)
const otpStore = new Map();

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    brand: 'Jio Smart Recharge',
    version: '2.5.0',
    timestamp: new Date().toISOString()
  });
});

// System Status Endpoint
app.get('/system/status', (req, res) => {
  res.json({
    success: true,
    server: 'Operational',
    recharge: 'Operational',
    network: 'Jio True 5G Active',
    maintenance: false,
    lastUpdated: new Date().toISOString()
  });
});

// ================= AUTH ROUTES =================

// Send OTP
app.post('/auth/send-otp', async (req, res) => {
  const { mobile } = req.body;

  if (!mobile || mobile.length !== 10) {
    return res.status(400).json({ success: false, message: 'Invalid 10-digit mobile number' });
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(mobile, { otp, expires: Date.now() + 5 * 60 * 1000 });

  console.log(`[Jio Auth] OTP for ${mobile}: ${otp}`);

  // Check if existing user
  let isNewUser = false;
  try {
    const existing = await User.findOne({ mobile });
    isNewUser = !existing;
  } catch (_) {
    isNewUser = !memoryStore.users.has(mobile);
  }

  res.json({
    success: true,
    message: 'OTP sent successfully to ' + mobile,
    otp, // Returned for testing / demo evaluation
    isNewUser
  });
});

// Verify OTP & Login
app.post('/auth/verify-otp', async (req, res) => {
  const { mobile, otp } = req.body;
  const DEMO_OTP = '123456';

  let isValid = false;
  if (otp === DEMO_OTP) {
    isValid = true;
  } else {
    const stored = otpStore.get(mobile);
    if (stored && stored.expires > Date.now() && stored.otp === otp) {
      isValid = true;
      otpStore.delete(mobile);
    }
  }

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired OTP. Use demo OTP: 123456'
    });
  }

  // Determine role: Admin mobile 6360603552 or demo role
  const role = (mobile === '6360603552') ? 'admin' : 'user';

  // Save or retrieve user
  let userRecord = {
    mobile,
    role,
    name: 'Jio User (' + mobile.slice(-4) + ')',
    simType: 'Prepaid',
    telecomCircle: 'National - India'
  };

  try {
    let dbUser = await User.findOne({ mobile });
    if (!dbUser) {
      dbUser = await User.create(userRecord);
    }
    userRecord = {
      mobile: dbUser.mobile,
      role: dbUser.role || role,
      name: dbUser.name,
      simType: dbUser.simType || 'Prepaid',
      telecomCircle: dbUser.telecomCircle || 'National - India'
    };
  } catch (_) {
    if (!memoryStore.users.has(mobile)) {
      memoryStore.users.set(mobile, userRecord);
    } else {
      userRecord = memoryStore.users.get(mobile);
    }
  }

  const token = jwt.sign(
    { mobile: userRecord.mobile, role: userRecord.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Send a welcome notification if none exists
  try {
    const notifCount = await Notification.countDocuments({ mobile });
    if (notifCount === 0) {
      await Notification.create({
        mobile,
        type: 'system',
        title: 'Welcome to Jio Smart Recharge!',
        message: 'Experience True 5G speeds, best-in-class entertainment packs, and seamless instant recharges.',
        priority: 'high'
      });
    }
  } catch (_) {}

  res.json({
    success: true,
    token,
    user: userRecord,
    message: 'Login successful'
  });
});

// Register User
app.post('/auth/register', async (req, res) => {
  const { name, mobile, address, pincode } = req.body;

  if (!mobile || !name) {
    return res.status(400).json({ success: false, message: 'Name and mobile number are required' });
  }

  const role = (mobile === '6360603552') ? 'admin' : 'user';
  const userData = {
    mobile,
    name,
    address: address || '',
    pincode: pincode || '',
    role,
    simType: 'Prepaid',
    telecomCircle: 'National - India'
  };

  try {
    await User.findOneAndUpdate({ mobile }, userData, { upsert: true, new: true });
  } catch (_) {
    memoryStore.users.set(mobile, userData);
  }

  res.json({
    success: true,
    message: 'Registration complete. Please verify OTP to proceed.'
  });
});

// Logout
app.post('/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// ================= USER & PLANS ROUTES =================

// Get all active plans
app.get('/user/plans', authenticateToken, async (req, res) => {
  try {
    let plans = [];
    try {
      plans = await Plan.find({ planStatus: 'Active' });
    } catch (_) {}

    if (!plans || plans.length === 0) {
      plans = memoryStore.plans.filter(p => p.planStatus === 'Active');
    }

    res.json({ success: true, plans });
  } catch (error) {
    res.json({ success: true, plans: memoryStore.plans });
  }
});

// Subscribe / Recharge
app.post('/subscribe', authenticateToken, async (req, res) => {
  try {
    const { username, planname, subscriptionDuration, paymentMethod = 'JioPay UPI' } = req.body;
    const mobile = username || req.user.mobile;

    if (!mobile || !planname || !subscriptionDuration) {
      return res.status(400).json({ success: false, message: 'Plan details and mobile number are required' });
    }

    // Determine plan metadata
    const planObj = defaultJioPlans.find(p => p.planName.toLowerCase() === planname.toLowerCase()) || {
      price: planname.includes('199') ? 199 : planname.includes('299') ? 299 : planname.includes('349') ? 349 : planname.includes('399') ? 399 : 699,
      dataLimit: planname.includes('2GB') ? '2GB/day' : planname.includes('3GB') ? '3GB/day' : '1.5GB/day'
    };

    const durationDays = parseInt(subscriptionDuration) || 28;
    const transactionId = 'JIO' + Date.now().toString().slice(-8);

    const subscriptionData = {
      username: mobile,
      planname,
      amount: planObj.price,
      dataLimit: planObj.dataLimit,
      subscriptionDuration: durationDays,
      status: 'Active',
      subscriptionDate: new Date(),
      expiryDate: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000),
      transactionId,
      paymentMethod
    };

    let savedSub = subscriptionData;
    try {
      const sub = new Subscription(subscriptionData);
      savedSub = await sub.save();
    } catch (dbErr) {
      savedSub._id = 'mem_sub_' + Date.now();
      memoryStore.subscriptions.unshift(savedSub);
    }

    // Auto-create confirmation Notification
    try {
      await Notification.create({
        mobile,
        type: 'recharge',
        title: 'Recharge Successful! 🎉',
        message: `Your Jio recharge for ${planname} (₹${planObj.price}) is successful. Txn ID: #${transactionId}. Validity: ${durationDays} days.`,
        priority: 'high'
      });
    } catch (_) {
      memoryStore.notifications.unshift({
        _id: 'mem_notif_' + Date.now(),
        mobile,
        type: 'recharge',
        title: 'Recharge Successful! 🎉',
        message: `Your Jio recharge for ${planname} (₹${planObj.price}) is successful. Txn ID: #${transactionId}. Validity: ${durationDays} days.`,
        priority: 'high',
        isRead: false,
        createdAt: new Date()
      });
    }

    res.json({
      success: true,
      subscription: savedSub,
      transactionId,
      message: 'Recharge successful!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Recharge failed: ' + error.message });
  }
});

// Get user active subscription
app.get('/user/subscription/:mobile', authenticateToken, async (req, res) => {
  try {
    const mobile = req.params.mobile;
    let subscription = null;

    try {
      subscription = await Subscription.findOne({
        username: mobile,
        status: { $in: ['Active', 'Prepaid'] }
      }).sort({ subscriptionDate: -1 });
    } catch (_) {}

    if (!subscription) {
      subscription = memoryStore.subscriptions
        .filter(s => s.username === mobile && ['Active', 'Prepaid'].includes(s.status))
        .sort((a, b) => new Date(b.subscriptionDate) - new Date(a.subscriptionDate))[0];
    }

    if (subscription) {
      const expDate = new Date(subscription.expiryDate || Date.now() + (subscription.subscriptionDuration || 28) * 86400000);
      const remainingDays = Math.max(0, Math.ceil((expDate - new Date()) / (1000 * 60 * 60 * 24)));

      const formatted = {
        mobile: subscription.username,
        planName: subscription.planname,
        amount: subscription.amount || 299,
        dataLimit: subscription.dataLimit || '1.5GB/day',
        validity: subscription.subscriptionDuration,
        status: remainingDays > 0 ? subscription.status : 'Expired',
        transactionId: subscription.transactionId || 'JIO-TXN-849201',
        paymentMethod: subscription.paymentMethod || 'JioPay UPI',
        transactionTime: new Date(subscription.subscriptionDate).toLocaleString(),
        startDate: new Date(subscription.subscriptionDate).toLocaleDateString(),
        endDate: expDate.toLocaleDateString(),
        expiryDate: expDate.toLocaleDateString(),
        remainingDays
      };
      return res.json({ success: true, subscription: formatted });
    }

    // Default active demo subscription if brand new user
    const defaultExp = new Date(Date.now() + 24 * 86400000);
    const demoSub = {
      mobile,
      planName: 'Jio True 5G ₹349',
      amount: 349,
      dataLimit: '2GB/day',
      validity: 28,
      status: 'Active',
      transactionId: 'JIO' + Date.now().toString().slice(-8),
      paymentMethod: 'JioPay UPI',
      transactionTime: new Date(Date.now() - 4 * 86400000).toLocaleString(),
      startDate: new Date(Date.now() - 4 * 86400000).toLocaleDateString(),
      endDate: defaultExp.toLocaleDateString(),
      expiryDate: defaultExp.toLocaleDateString(),
      remainingDays: 24
    };

    res.json({ success: true, subscription: demoSub });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch subscription' });
  }
});

// Recharge History
app.get('/user/recharge-history/:mobile', authenticateToken, async (req, res) => {
  try {
    const mobile = req.params.mobile;
    let history = [];

    try {
      history = await Subscription.find({ username: mobile }).sort({ subscriptionDate: -1 }).lean();
    } catch (_) {}

    if (!history || history.length === 0) {
      history = memoryStore.subscriptions.filter(s => s.username === mobile);
    }

    if (!history || history.length === 0) {
      // Default initial history
      history = [
        {
          _id: 'hist_1',
          username: mobile,
          planname: 'Jio True 5G ₹349',
          amount: 349,
          subscriptionDuration: 28,
          status: 'Success',
          subscriptionDate: new Date(Date.now() - 4 * 86400000)
        },
        {
          _id: 'hist_2',
          username: mobile,
          planname: 'Jio Hero ₹299',
          amount: 299,
          subscriptionDuration: 28,
          status: 'Success',
          subscriptionDate: new Date(Date.now() - 32 * 86400000)
        }
      ];
    }

    const formattedHistory = history.map(item => ({
      id: item._id || item.id,
      date: item.subscriptionDate,
      planName: item.planname || item.planName,
      amount: item.amount || (item.planname && item.planname.includes('349') ? 349 : 299),
      validity: item.subscriptionDuration || 28,
      status: item.status === 'Active' || item.status === 'Success' ? 'Success' : item.status
    }));

    res.json({ success: true, history: formattedHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch history' });
  }
});

// Subscription history for refunds
app.get('/user/subscription-history/:mobile', authenticateToken, async (req, res) => {
  try {
    const mobile = req.params.mobile;
    let subscriptions = [];
    try {
      subscriptions = await Subscription.find({ username: mobile }).sort({ subscriptionDate: -1 });
    } catch (_) {}

    if (!subscriptions || subscriptions.length === 0) {
      subscriptions = memoryStore.subscriptions.filter(s => s.username === mobile);
    }

    res.json({ success: true, subscriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch subscription history' });
  }
});

// Usage Analytics
app.get('/usage/analytics/:mobile', authenticateToken, async (req, res) => {
  try {
    // Generate realistic, dynamic Jio usage data
    const analytics = {
      dailyLimit: 2048, // 2GB in MB
      usedToday: 1380, // 1.38GB used
      totalData: 56 * 1024, // 56GB
      totalUsed: 22 * 1024, // 22GB
      validityDays: 28,
      remainingDays: 24,
      networkSpeed: '1.2 Gbps (Jio True 5G)',
      currentNetwork: 'Jio True 5G SA',
      callsMadeToday: 14,
      callsDurationMins: 42,
      smsUsedToday: 4,
      dailyUsage: [1420, 1680, 1890, 1250, 1380] // last 5 days
    };

    res.json({ success: true, ...analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch usage analytics' });
  }
});

// Settings GET & PATCH
app.get('/settings/:mobile', authenticateToken, async (req, res) => {
  try {
    const mobile = req.params.mobile;
    let settings = null;
    try {
      settings = await UserSettings.findOne({ mobile });
    } catch (_) {}

    if (!settings) {
      settings = memoryStore.settings.get(mobile) || {
        notifications: true,
        language: 'en',
        sessionTimeout: 30,
        biometric: true,
        autoRecharge: false
      };
    }

    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
});

app.patch('/settings/:mobile', authenticateToken, async (req, res) => {
  try {
    const mobile = req.params.mobile;
    const updates = req.body;

    try {
      await UserSettings.findOneAndUpdate({ mobile }, updates, { upsert: true });
    } catch (_) {}

    const existing = memoryStore.settings.get(mobile) || {
      notifications: true,
      language: 'en',
      sessionTimeout: 30,
      biometric: false,
      autoRecharge: false
    };
    memoryStore.settings.set(mobile, { ...existing, ...updates });

    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
});

// Support Ticket Routes
app.post('/support/tickets', authenticateToken, async (req, res) => {
  try {
    const { mobile, issueType, description, lastRecharge } = req.body;
    const ticketId = 'JIO' + Date.now().toString().slice(-6);

    const ticketData = {
      ticketId,
      mobile: mobile || req.user.mobile,
      issueType: issueType || 'Other issue',
      description: description || 'No details provided',
      lastRecharge,
      status: 'Open'
    };

    let saved = ticketData;
    try {
      const ticket = new SupportTicket(ticketData);
      saved = await ticket.save();
    } catch (_) {
      saved._id = 'mem_sup_' + Date.now();
      memoryStore.supportTickets.unshift(saved);
    }

    // Auto notification
    try {
      await Notification.create({
        mobile: ticketData.mobile,
        type: 'support',
        title: 'Support Ticket Created',
        message: `Your ticket #${ticketId} regarding "${issueType}" is created. We will resolve it shortly.`,
        priority: 'high'
      });
    } catch (_) {}

    res.json({ success: true, ticketId, ticket: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create support ticket' });
  }
});

app.get('/support/tickets/:mobile', authenticateToken, async (req, res) => {
  try {
    const mobile = req.params.mobile;
    let tickets = [];
    try {
      tickets = await SupportTicket.find({ mobile }).sort({ createdAt: -1 });
    } catch (_) {}

    if (!tickets || tickets.length === 0) {
      tickets = memoryStore.supportTickets.filter(t => t.mobile === mobile);
    }

    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch tickets' });
  }
});

// Admin Support Routes
app.get('/admin/support/tickets', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    let tickets = [];
    try {
      tickets = await SupportTicket.find().sort({ createdAt: -1 });
    } catch (_) {}
    if (!tickets || tickets.length === 0) {
      tickets = memoryStore.supportTickets;
    }
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch support tickets' });
  }
});

app.patch('/admin/support/tickets/:ticketId', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, resolution } = req.body;

    let ticket = null;
    try {
      ticket = await SupportTicket.findOneAndUpdate(
        { ticketId },
        { status, resolution, updatedAt: new Date() },
        { new: true }
      );
    } catch (_) {}

    if (!ticket) {
      ticket = memoryStore.supportTickets.find(t => t.ticketId === ticketId);
      if (ticket) {
        ticket.status = status;
        ticket.resolution = resolution;
      }
    }

    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update ticket' });
  }
});

// Refund Routes
app.post('/refunds/request', authenticateToken, async (req, res) => {
  try {
    const { planId, mobile } = req.body;
    const refundId = 'REF' + Date.now().toString().slice(-6);

    const refundData = {
      ticketId: refundId,
      mobile: mobile || req.user.mobile,
      planName: 'Prepaid Plan Recharge',
      amount: 299,
      status: 'Pending',
      initiatedAt: new Date(),
      eta: new Date(Date.now() + 3 * 86400000)
    };

    let saved = refundData;
    try {
      const refund = new Refund(refundData);
      saved = await refund.save();
    } catch (_) {
      saved._id = 'mem_ref_' + Date.now();
      memoryStore.refunds.unshift(saved);
    }

    res.json({ success: true, refundId, refund: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create refund' });
  }
});

app.get('/refunds/:mobile', authenticateToken, async (req, res) => {
  try {
    const mobile = req.params.mobile;
    let refunds = [];
    try {
      refunds = await Refund.find(req.user.role === 'admin' ? {} : { mobile }).sort({ createdAt: -1 });
    } catch (_) {}

    if (!refunds || refunds.length === 0) {
      refunds = memoryStore.refunds.filter(r => req.user.role === 'admin' || r.mobile === mobile);
    }

    const formatted = refunds.map(r => ({
      id: r.ticketId || r._id,
      mobile: r.mobile,
      amount: r.amount,
      planName: r.planName,
      status: r.status,
      initiatedAt: r.initiatedAt,
      processedAt: r.processedAt,
      eta: r.eta
    }));

    res.json({ success: true, refunds: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch refunds' });
  }
});

app.get('/admin/refunds', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    let refunds = [];
    try {
      refunds = await Refund.find().sort({ createdAt: -1 });
    } catch (_) {}
    if (!refunds || refunds.length === 0) {
      refunds = memoryStore.refunds;
    }
    const formatted = refunds.map(r => ({
      id: r.ticketId || r._id,
      mobile: r.mobile,
      amount: r.amount,
      planName: r.planName,
      status: r.status,
      initiatedAt: r.initiatedAt,
      processedAt: r.processedAt,
      eta: r.eta
    }));
    res.json({ success: true, refunds: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch refunds' });
  }
});

app.patch('/admin/refunds/:id/:action', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    const { id, action } = req.params;
    const status = action === 'approve' ? 'Refunded' : 'Rejected';

    let refund = null;
    try {
      refund = await Refund.findOneAndUpdate(
        { ticketId: id },
        { status, processedAt: new Date() },
        { new: true }
      );
    } catch (_) {}

    if (!refund) {
      refund = memoryStore.refunds.find(r => r.ticketId === id || r.id === id);
      if (refund) {
        refund.status = status;
        refund.processedAt = new Date();
      }
    }

    res.json({ success: true, refund, action });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process refund' });
  }
});

// Notifications Routes
app.get('/notifications/:mobile', authenticateToken, async (req, res) => {
  try {
    const { mobile } = req.params;
    let notifications = [];

    try {
      notifications = await Notification.find({
        $or: [{ mobile }, { mobile: 'ALL_USERS' }]
      }).sort({ createdAt: -1 }).limit(50);
    } catch (_) {}

    if (!notifications || notifications.length === 0) {
      notifications = memoryStore.notifications.filter(n => n.mobile === mobile || n.mobile === 'ALL_USERS');
    }

    if (!notifications || notifications.length === 0) {
      // Default welcome alerts
      notifications = [
        {
          _id: 'notif_welcome',
          mobile,
          type: 'system',
          title: 'Welcome to Jio True 5G Network',
          message: 'Experience lightning fast speeds with Jio True 5G. Recharge with any eligible plan to activate unlimited 5G.',
          priority: 'high',
          isRead: false,
          createdAt: new Date()
        },
        {
          _id: 'notif_offer',
          mobile,
          type: 'expiry',
          title: 'Pack Validity Active',
          message: 'Your current pack has 24 days validity left. Check out trending entertainment and booster plans.',
          priority: 'medium',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000)
        }
      ];
    }

    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

app.patch('/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    try {
      await Notification.findByIdAndUpdate(req.params.id, { isRead: true, readAt: new Date() });
    } catch (_) {}

    const mem = memoryStore.notifications.find(n => n._id === req.params.id || n.id === req.params.id);
    if (mem) mem.isRead = true;

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark notification read' });
  }
});

app.delete('/notifications/:id', authenticateToken, async (req, res) => {
  try {
    try {
      await Notification.findByIdAndDelete(req.params.id);
    } catch (_) {}
    memoryStore.notifications = memoryStore.notifications.filter(n => n._id !== req.params.id && n.id !== req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete notification' });
  }
});

app.delete('/notifications/:mobile/clear-all', authenticateToken, async (req, res) => {
  try {
    const { mobile } = req.params;
    try {
      await Notification.deleteMany({ mobile });
    } catch (_) {}
    memoryStore.notifications = memoryStore.notifications.filter(n => n.mobile !== mobile);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to clear notifications' });
  }
});

// Admin Plan Management
app.get('/admin/plans', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    let plans = [];
    try {
      plans = await Plan.find();
    } catch (_) {}

    if (!plans || plans.length === 0) {
      plans = memoryStore.plans;
    }
    res.json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch plans' });
  }
});

app.post('/admin/plans', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    const { planName, price, dataLimit, validity, category = 'popular', tag = '' } = req.body;
    if (!planName || !price || !dataLimit || !validity) {
      return res.status(400).json({ success: false, message: 'All plan fields are required' });
    }

    const newPlan = {
      planName,
      price: parseInt(price),
      dataLimit,
      validity: parseInt(validity),
      category,
      tag,
      voice: 'Truly Unlimited Calls',
      sms: '100 SMS/day',
      ottBenefits: ['JioCinema', 'JioTV', 'JioCloud'],
      details: 'High-speed Jio data and unlimited calls.',
      planStatus: 'Active'
    };

    let saved = newPlan;
    try {
      const plan = new Plan(newPlan);
      saved = await plan.save();
    } catch (_) {
      saved._id = 'mem_plan_' + Date.now();
      memoryStore.plans.push(saved);
    }

    res.json({ success: true, plan: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create plan' });
  }
});

app.put('/admin/plans/:id', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    let plan = null;
    try {
      plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    } catch (_) {}

    if (!plan) {
      const idx = memoryStore.plans.findIndex(p => p._id === req.params.id || p.id === req.params.id);
      if (idx !== -1) {
        memoryStore.plans[idx] = { ...memoryStore.plans[idx], ...req.body };
        plan = memoryStore.plans[idx];
      }
    }

    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update plan' });
  }
});

app.patch('/admin/plans/:id/status', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    let plan = null;
    try {
      plan = await Plan.findByIdAndUpdate(req.params.id, { planStatus: status }, { new: true });
    } catch (_) {}

    if (!plan) {
      const mem = memoryStore.plans.find(p => p._id === req.params.id || p.id === req.params.id);
      if (mem) {
        mem.planStatus = status;
        plan = mem;
      }
    }

    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update plan status' });
  }
});

app.delete('/admin/plans/:id', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    try {
      await Plan.findByIdAndDelete(req.params.id);
    } catch (_) {}
    memoryStore.plans = memoryStore.plans.filter(p => p._id !== req.params.id && p.id !== req.params.id);
    res.json({ success: true, message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete plan' });
  }
});

app.get('/admin/subscriptions', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    let subscriptions = [];
    try {
      subscriptions = await Subscription.find().sort({ createdAt: -1 }).limit(100);
    } catch (_) {}
    if (!subscriptions || subscriptions.length === 0) {
      subscriptions = memoryStore.subscriptions;
    }
    res.json({ success: true, subscriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch subscriptions' });
  }
});

// Test Database Connection
app.get('/test-db', async (req, res) => {
  try {
    const planCount = await Plan.countDocuments();
    const subscriptionCount = await Subscription.countDocuments();
    res.json({
      success: true,
      message: 'Database operational',
      data: { plans: planCount, subscriptions: subscriptionCount }
    });
  } catch (error) {
    res.json({
      success: true,
      message: 'Running in resilient memory mode',
      data: { plans: memoryStore.plans.length, subscriptions: memoryStore.subscriptions.length }
    });
  }
});

// Serve static React build files
app.use(express.static(path.join(__dirname, '../frontend/build')));

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Jio Smart Recharge Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
