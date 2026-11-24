import React, { useState, useEffect } from 'react';

const RefundsPage = ({ user, onBack, onLogout }) => {
  const [loading, setLoading] = useState(true);
  const [refunds, setRefunds] = useState([]);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    fetchRefunds();
  }, [onLogout]);

  const fetchRefunds = async () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      onLogout();
      return;
    }

    try {
      const endpoint = user.role === 'admin' ? '/admin/refunds' : `/refunds/${user.mobile}`;
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 401) {
        onLogout();
        return;
      }

      const result = await response.json();
      setRefunds(result.refunds || []);
    } catch (err) {
      setError('Unable to load refunds data.');
    }
    setLoading(false);
  };

  const requestRefund = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/refunds/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mobile: user.mobile,
          reason: refundReason || 'Prepaid recharge cancellation requested'
        })
      });

      if (response.ok) {
        setShowRequestForm(false);
        setRefundReason('');
        fetchRefunds();
      }
    } catch (_) {}
  };

  const processAdminRefund = async (ticketId, action) => {
    setProcessingId(ticketId);
    try {
      const token = localStorage.getItem('token');
      await fetch(`/admin/refunds/${ticketId}/${action}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRefunds();
    } catch (_) {}
    setProcessingId(null);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Refunded':
        return { bg: '#dcfce7', text: '#15803d', icon: '✓' };
      case 'Pending':
        return { bg: '#fef3c7', text: '#b45309', icon: '⏳' };
      case 'Rejected':
        return { bg: '#fee2e2', text: '#b91c1c', icon: '✕' };
      default:
        return { bg: '#eff6ff', text: '#1d4ed8', icon: '•' };
    }
  };

  return (
    <div className="app-container">
      {/* Brand Header */}
      <header className="jio-navbar">
        <div className="jio-nav-inner">
          <div className="jio-brand" onClick={onBack}>
            <div className="jio-logo-badge">Jio</div>
            <div className="jio-brand-text">
              <h1>Refunds & Reversals</h1>
              <div className="jio-brand-tagline">
                <span>Failed Transactions & Claims</span>
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

        {/* Action Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {user.role === 'admin' ? 'Admin Refund Management' : 'Refund Claims & Status'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
              Instant reversal back to your original JioPay UPI or bank account
            </p>
          </div>

          {user.role !== 'admin' && (
            <button
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="jio-btn-primary"
              style={{ width: 'auto', padding: '10px 18px', margin: 0 }}
            >
              {showRequestForm ? 'Cancel Request' : '➕ Request Refund'}
            </button>
          )}
        </div>

        {/* Request Refund Form */}
        {showRequestForm && (
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '20px',
            border: '2px solid #0050d5',
            marginBottom: '20px',
            boxShadow: '0 4px 14px rgba(0, 80, 213, 0.1)'
          }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Initiate Refund Request for +91 {user.mobile}
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '14px' }}>
              Prepaid recharges that have not consumed any data are eligible for full refund within 48 hours.
            </p>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Reason for Refund Request
              </label>
              <textarea
                placeholder="e.g. Accidental recharge, recharged wrong denomination..."
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                rows="2"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <button
              onClick={requestRefund}
              className="jio-btn-primary"
              style={{ width: 'auto', padding: '10px 24px' }}
            >
              Submit Refund Request
            </button>
          </div>
        )}

        {/* Refunds List Loop */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 14px rgba(10, 40, 133, 0.08)'
        }}>
          {refunds.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>💰</div>
              <p style={{ fontWeight: 600 }}>No refund claims found for this account.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {refunds.map((ref) => {
                const style = getStatusStyle(ref.status);

                return (
                  <div
                    key={ref.id}
                    style={{
                      background: '#f8fafc',
                      borderRadius: '14px',
                      padding: '18px 22px',
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
                        <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                          Refund #{ref.id}
                        </span>
                        <span style={{
                          background: style.bg,
                          color: style.text,
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.72rem',
                          fontWeight: 800
                        }}>
                          {style.icon} {ref.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                        {ref.planName} {user.role === 'admin' && `• User: +91 ${ref.mobile}`}
                      </div>

                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                        Initiated: {new Date(ref.initiatedAt).toLocaleDateString()} • Expected by: {new Date(ref.eta || Date.now() + 3 * 86400000).toLocaleDateString()}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0050d5' }}>
                          ₹{ref.amount}
                        </div>
                        <small style={{ color: '#16a34a', fontSize: '0.75rem', fontWeight: 600 }}>
                          Original Source
                        </small>
                      </div>

                      {/* Admin Approve / Reject actions */}
                      {user.role === 'admin' && ref.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => processAdminRefund(ref.id, 'approve')}
                            disabled={processingId === ref.id}
                            style={{
                              background: '#16a34a',
                              color: '#fff',
                              border: 'none',
                              padding: '8px 14px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => processAdminRefund(ref.id, 'reject')}
                            disabled={processingId === ref.id}
                            style={{
                              background: '#dc2626',
                              color: '#fff',
                              border: 'none',
                              padding: '8px 14px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Policy Notice */}
        <div style={{
          marginTop: '24px',
          background: '#f8fafc',
          borderRadius: '14px',
          padding: '16px 20px',
          border: '1px solid #e2e8f0',
          fontSize: '0.825rem',
          color: '#64748b',
          lineHeight: 1.5
        }}>
          💡 <strong>Jio Refund Policy:</strong> In case of duplicate payments or deduction without plan activation, refunds are processed automatically within 24 to 48 hours to the original source account.
        </div>
      </main>
    </div>
  );
};

export default RefundsPage;
