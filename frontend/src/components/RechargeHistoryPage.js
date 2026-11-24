import React, { useState, useEffect, useMemo } from 'react';

const RechargeHistoryPage = ({ user, onBack, onLogout }) => {
  const [loading, setLoading] = useState(true);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [rechargeHistory, setRechargeHistory] = useState([]);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchAccountData();
  }, [onLogout]);

  const fetchAccountData = async () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Session expired. Please login again.');
      onLogout();
      return;
    }

    try {
      // Fetch Active Subscription
      const subRes = await fetch(`/user/subscription/${user.mobile}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (subRes.ok) {
        const subData = await subRes.json();
        if (subData.subscription) {
          setActiveSubscription(subData.subscription);
        }
      }

      // Fetch Recharge History
      const histRes = await fetch(`/user/recharge-history/${user.mobile}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (histRes.ok) {
        const histData = await histRes.json();
        if (histData.history) {
          setRechargeHistory(histData.history);
        }
      }
    } catch (err) {
      setError('Unable to load history records.');
    }
    setLoading(false);
  };

  // Filter and sort loops
  const filteredHistory = useMemo(() => {
    return rechargeHistory.filter((item) => {
      if (filterStatus === 'all') return true;
      return item.status.toLowerCase() === filterStatus.toLowerCase();
    });
  }, [rechargeHistory, filterStatus]);

  const sortedHistory = useMemo(() => {
    return [...filteredHistory].sort((a, b) => {
      switch (sortBy) {
        case 'amount-high':
          return b.amount - a.amount;
        case 'amount-low':
          return a.amount - b.amount;
        case 'validity':
          return b.validity - a.validity;
        case 'latest':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });
  }, [filteredHistory, sortBy]);

  return (
    <div className="app-container">
      {/* Brand Header */}
      <header className="jio-navbar">
        <div className="jio-nav-inner">
          <div className="jio-brand" onClick={onBack}>
            <div className="jio-logo-badge">Jio</div>
            <div className="jio-brand-text">
              <h1>My Recharge History</h1>
              <div className="jio-brand-tagline">
                <span>Account Statements & Recharges</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onBack} className="jio-logout-btn">
              ← Dashboard
            </button>
            <button onClick={onLogout} className="jio-logout-btn">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '12px 18px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Current Active Pack Card */}
        <div className="jio-balance-widget" style={{ marginBottom: '24px' }}>
          <div className="jio-widget-header">
            <div className="jio-widget-title">
              <h3>
                <span>⭐</span> Active Plan: {activeSubscription?.planName || 'Jio True 5G ₹349'}
              </h3>
              <p>Mobile: +91 {user.mobile} • Validity ending on {activeSubscription?.endDate || 'in 24 days'}</p>
            </div>
            <span style={{
              background: '#10b981',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: '9999px'
            }}>
              🟢 Active
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            marginTop: '12px'
          }}>
            <div style={{ background: '#fff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>REMAINING DAYS</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0050d5' }}>
                {activeSubscription?.remainingDays !== undefined ? activeSubscription.remainingDays : 24} Days
              </div>
            </div>
            <div style={{ background: '#fff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>DAILY DATA LIMIT</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {activeSubscription?.dataLimit || '2GB/day'}
              </div>
            </div>
            <div style={{ background: '#fff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>5G SERVICE</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a' }}>
                Unlimited 5G Data
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 14px rgba(10, 40, 133, 0.08)',
          border: '1px solid #e2e8f0'
        }}>
          {/* Controls Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Past Transactions ({sortedHistory.length})
            </h3>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  outline: 'none'
                }}
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  outline: 'none'
                }}
              >
                <option value="latest">Latest First</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
                <option value="validity">Longest Validity</option>
              </select>
            </div>
          </div>

          {/* History Items Loop */}
          {sortedHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📜</div>
              <p style={{ fontWeight: 600 }}>No transaction history found for this selection.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {sortedHistory.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                        {item.planName}
                      </span>
                      <span style={{
                        background: item.status === 'Success' ? '#dcfce7' : '#fee2e2',
                        color: item.status === 'Success' ? '#15803d' : '#b91c1c',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 800
                      }}>
                        {item.status === 'Success' ? '✓ Successful' : '✕ Failed'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString()} • Validity: {item.validity} Days
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0050d5' }}>
                        ₹{item.amount}
                      </div>
                      <small style={{ color: '#64748b', fontSize: '0.75rem' }}>JioPay UPI</small>
                    </div>

                    <button
                      onClick={onBack}
                      className="jio-btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '0.8rem', margin: 0, width: 'auto' }}
                    >
                      Recharge Again
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RechargeHistoryPage;
