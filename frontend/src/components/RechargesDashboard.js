import React, { useState, useEffect, useMemo } from 'react';

const RechargesDashboard = ({
  user,
  onLogout,
  onSelectPlan,
  onViewHistory,
  onViewAdmin,
  onViewSupport,
  onViewNotifications,
  onViewUsage,
  onViewRefunds,
  onViewSettings,
  onViewInfo
}) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedPlanForModal, setSelectedPlanForModal] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Category Tabs Configuration
  const categories = [
    { id: 'all', label: 'All Plans', icon: '📱' },
    { id: '5g', label: 'True 5G Unlimited', icon: '⚡' },
    { id: 'popular', label: 'Popular Plans', icon: '⭐' },
    { id: 'entertainment', label: 'Entertainment & OTT', icon: '🎬' },
    { id: 'booster', label: 'Data Booster', icon: '🚀' },
    { id: 'annual', label: 'Annual Value', icon: '📅' },
    { id: 'topup', label: 'Top-up & ISD', icon: '📞' }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Session expired. Please login again.');
      setTimeout(() => onLogout(), 1500);
      return;
    }

    try {
      // 1. Fetch Plans
      const plansRes = await fetch('/user/plans', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (plansRes.status === 401) {
        onLogout();
        return;
      }
      const plansData = await plansRes.json();
      if (plansData.plans && plansData.plans.length > 0) {
        setPlans(plansData.plans);
      }

      // 2. Fetch Active Subscription
      const subRes = await fetch(`/user/subscription/${user.mobile}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (subRes.ok) {
        const subData = await subRes.json();
        if (subData.subscription) {
          setActiveSubscription(subData.subscription);
        }
      }

      // 3. Fetch Notification Unread Count
      const notifRes = await fetch(`/notifications/${user.mobile}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        const unread = (notifData.notifications || []).filter(n => !n.isRead).length;
        setUnreadNotifications(unread);
      }
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
    }
    setLoading(false);
  };

  const handleRechargeClick = (plan) => {
    setSelectedPlanForModal(plan);
    setShowCheckoutModal(true);
  };

  const proceedToPlanDetails = () => {
    setShowCheckoutModal(false);
    onSelectPlan(selectedPlanForModal);
  };

  // Filter & Sort Logic using functional loops
  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
      const matchesCategory = activeCategory === 'all' || plan.category === activeCategory;
      const matchesSearch = !searchQuery ||
        plan.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.price.toString().includes(searchQuery) ||
        plan.dataLimit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (plan.tag && plan.tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [plans, activeCategory, searchQuery]);

  const sortedPlans = useMemo(() => {
    return [...filteredPlans].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'validity-high':
          return b.validity - a.validity;
        case 'validity-low':
          return a.validity - b.validity;
        default:
          return 0; // default natural order
      }
    });
  }, [filteredPlans, sortBy]);

  return (
    <div className="app-container">
      {/* Top Brand Navbar */}
      <header className="jio-navbar">
        <div className="jio-nav-inner">
          <div className="jio-brand">
            <div className="jio-logo-badge">Jio</div>
            <div className="jio-brand-text">
              <h1>Smart Recharge</h1>
              <div className="jio-brand-tagline">
                <span>India's #1 True 5G Network</span>
                <span className="jio-5g-tag">True 5G</span>
              </div>
            </div>
          </div>

          <div className="jio-user-status">
            <div className="jio-user-meta">
              <span className="jio-user-phone">+91 {user.mobile}</span>
              <span className="jio-user-sim">
                <span className="jio-status-dot"></span>
                <span>Prepaid • 5G Active</span>
              </span>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="jio-logout-btn"
              title="Logout"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Quick Navigation Strip */}
      <nav className="jio-subnav">
        <div className="jio-subnav-inner">
          <button className="jio-nav-item active">
            <span>📱</span> Plans & Recharge
          </button>
          <button onClick={onViewUsage} className="jio-nav-item">
            <span>📊</span> Usage & Balance
          </button>
          <button onClick={onViewHistory} className="jio-nav-item">
            <span>📜</span> My Recharges
          </button>
          <button onClick={onViewNotifications} className="jio-nav-item">
            <span>🔔</span> Alerts
            {unreadNotifications > 0 && (
              <span className="jio-nav-badge">{unreadNotifications}</span>
            )}
          </button>
          <button onClick={onViewRefunds} className="jio-nav-item">
            <span>💰</span> Refunds
          </button>
          <button onClick={onViewSupport} className="jio-nav-item">
            <span>💬</span> Jio Care
          </button>
          <button onClick={onViewSettings} className="jio-nav-item">
            <span>⚙️</span> Settings
          </button>
          <button onClick={onViewInfo} className="jio-nav-item">
            <span>ℹ️</span> 5G Coverage
          </button>
          {user.role === 'admin' && (
            <button onClick={onViewAdmin} className="jio-nav-item" style={{ background: '#fef3c7', color: '#92400e' }}>
              <span>🔐</span> Admin Portal
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Active Pack Status Banner Widget */}
        <div className="jio-balance-widget">
          <div className="jio-widget-header">
            <div className="jio-widget-title">
              <h3>
                <span>📶</span> Current Active Pack: {activeSubscription?.planName || 'Jio True 5G ₹349'}
              </h3>
              <p>Mobile: +91 {user.mobile} • Validity ending on {activeSubscription?.endDate || 'in 24 days'}</p>
            </div>
            <div className="jio-5g-welcome-badge">
              <span>⚡</span> Unlimited 5G Data Active
            </div>
          </div>

          <div className="jio-balance-grid">
            <div className="jio-meter-card">
              <div className="jio-meter-label">
                <span>Daily High-Speed Data</span>
                <span>72% Left</span>
              </div>
              <div className="jio-meter-value">1.44 GB / 2.0 GB</div>
              <div className="jio-meter-bar-bg">
                <div className="jio-meter-bar-fill" style={{ width: '72%' }}></div>
              </div>
            </div>

            <div className="jio-meter-card">
              <div className="jio-meter-label">
                <span>Pack Validity</span>
                <span style={{ color: '#0050d5' }}>Active</span>
              </div>
              <div className="jio-meter-value">
                {activeSubscription?.remainingDays !== undefined ? activeSubscription.remainingDays : 24} Days Left
              </div>
              <div className="jio-meter-bar-bg">
                <div className="jio-meter-bar-fill" style={{ width: '85%', background: '#0050d5' }}></div>
              </div>
            </div>

            <div className="jio-meter-card">
              <div className="jio-meter-label">
                <span>Voice & SMS Benefits</span>
                <span>Included</span>
              </div>
              <div className="jio-meter-value" style={{ fontSize: '1.1rem', color: '#166534' }}>
                Unlimited Calls • 100 SMS/day
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                JioCinema & JioTV subscriptions active
              </div>
            </div>
          </div>
        </div>

        {/* Search & Sort Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          {/* Search Input */}
          <div style={{ flex: '1 1 280px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search plans by price (e.g. 349), data, or benefits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 16px 11px 40px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                outline: 'none',
                background: '#ffffff',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748b' }}>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="popular">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="validity-high">Validity: Longest First</option>
              <option value="validity-low">Validity: Shortest First</option>
            </select>
          </div>
        </div>

        {/* Category Tabs Loop */}
        <div className="jio-category-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`jio-tab-pill ${activeCategory === cat.id ? 'active' : ''}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              {cat.id !== 'all' && (
                <span style={{
                  fontSize: '0.72rem',
                  opacity: 0.85,
                  marginLeft: '2px'
                }}>
                  ({plans.filter(p => p.category === cat.id).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '12px 18px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading State Skeleton */}
        {loading && (
          <div className="jio-plans-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} style={{
                background: '#fff',
                borderRadius: '16px',
                height: '240px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                animation: 'pulse 1.5s infinite'
              }}></div>
            ))}
          </div>
        )}

        {/* Plans Grid Loop */}
        {!loading && (
          <>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
              color: '#64748b',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              <span>Showing {sortedPlans.length} recharge plan{sortedPlans.length !== 1 ? 's' : ''}</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#0050d5', cursor: 'pointer', fontWeight: 700 }}
                >
                  Clear Search
                </button>
              )}
            </div>

            <div className="jio-plans-grid">
              {sortedPlans.map((plan) => (
                <div key={plan._id || plan.id || plan.planName} className="jio-plan-card">
                  {/* Tag Badge */}
                  {plan.tag && (
                    <span className={`jio-card-tag ${
                      plan.category === '5g' ? 'true5g' :
                      plan.category === 'entertainment' ? 'ott' : 'bestseller'
                    }`}>
                      {plan.tag}
                    </span>
                  )}

                  {/* Price & Validity */}
                  <div className="jio-plan-price-block">
                    <span className="jio-currency">₹</span>
                    <span className="jio-price-val">{plan.price}</span>
                    <span className="jio-validity-badge">{plan.validity} Days</span>
                  </div>

                  {/* Plan Name */}
                  <div className="jio-plan-name">{plan.planName}</div>

                  {/* Features Box */}
                  <div className="jio-features-box">
                    <div className="jio-feature-item">
                      <span className="jio-feature-title">Data</span>
                      <span className="jio-feature-value">{plan.dataLimit}</span>
                    </div>
                    <div className="jio-feature-item">
                      <span className="jio-feature-title">Calls</span>
                      <span className="jio-feature-value">{plan.voice || 'Truly Unlimited'}</span>
                    </div>
                    <div className="jio-feature-item">
                      <span className="jio-feature-title">SMS</span>
                      <span className="jio-feature-value">{plan.sms || '100 SMS/day'}</span>
                    </div>
                    <div className="jio-feature-item">
                      <span className="jio-feature-title">True 5G</span>
                      <span className="jio-feature-value" style={{ color: '#0050d5' }}>
                        {plan.category === '5g' || plan.price >= 349 ? 'Unlimited 5G' : 'Standard'}
                      </span>
                    </div>
                  </div>

                  {/* OTT Benefits Loop */}
                  {plan.ottBenefits && plan.ottBenefits.length > 0 && (
                    <div className="jio-ott-pills">
                      {plan.ottBenefits.map((ott, i) => (
                        <span key={i} className="jio-ott-pill">
                          <span>📺</span> {ott}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Recharge Button */}
                  <button
                    onClick={() => handleRechargeClick(plan)}
                    className="jio-recharge-btn"
                  >
                    <span>⚡</span> Recharge Now
                  </button>
                </div>
              ))}
            </div>

            {sortedPlans.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>No Plans Found</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '18px' }}>
                  No recharge plans match your search or filter selection.
                </p>
                <button
                  onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                  className="jio-btn-primary"
                  style={{ maxWidth: '200px', margin: '0 auto' }}
                >
                  View All Plans
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Quick Plan Confirmation Modal */}
      {showCheckoutModal && selectedPlanForModal && (
        <div className="jio-modal-backdrop">
          <div className="jio-modal-card">
            <div className="jio-modal-head">
              <h3>Confirm Jio Recharge</h3>
              <button onClick={() => setShowCheckoutModal(false)} className="jio-modal-close">✕</button>
            </div>
            <div className="jio-modal-body">
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{selectedPlanForModal.planName}</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0050d5' }}>₹{selectedPlanForModal.price}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', gap: '14px' }}>
                  <span>📅 Validity: <strong>{selectedPlanForModal.validity} Days</strong></span>
                  <span>📶 Data: <strong>{selectedPlanForModal.dataLimit}</strong></span>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '18px', lineHeight: 1.5 }}>
                {selectedPlanForModal.details || 'Recharge will be activated instantly on your mobile number.'}
              </div>

              <div style={{
                background: '#eff6ff',
                padding: '12px 14px',
                borderRadius: '8px',
                fontSize: '0.825rem',
                color: '#1d4ed8',
                marginBottom: '20px'
              }}>
                📱 Recharging for Mobile: <strong>+91 {user.mobile}</strong> (Prepaid)
              </div>

              <button
                onClick={proceedToPlanDetails}
                className="jio-btn-primary"
              >
                Proceed to Payment • ₹{selectedPlanForModal.price}
              </button>

              <button
                onClick={() => setShowCheckoutModal(false)}
                className="jio-btn-secondary"
                style={{ marginTop: '10px' }}
              >
                Choose Another Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="jio-modal-backdrop">
          <div className="jio-modal-card" style={{ maxWidth: '400px' }}>
            <div className="jio-modal-head">
              <h3>Confirm Sign Out</h3>
              <button onClick={() => setShowLogoutModal(false)} className="jio-modal-close">✕</button>
            </div>
            <div className="jio-modal-body" style={{ textAlign: 'center' }}>
              <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '22px' }}>
                Are you sure you want to sign out from your Jio account?
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="jio-btn-secondary"
                  style={{ flex: 1, margin: 0 }}
                >
                  Cancel
                </button>
                <button
                  onClick={onLogout}
                  className="jio-btn-primary"
                  style={{ flex: 1, margin: 0, background: '#e0144c' }}
                >
                  Yes, Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RechargesDashboard;
