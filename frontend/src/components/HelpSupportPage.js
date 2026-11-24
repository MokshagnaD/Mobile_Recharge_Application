import React, { useState, useEffect } from 'react';

const HelpSupportPage = ({ user, onBack, onLogout }) => {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('new'); // 'new', 'tickets', 'faqs'
  const [selectedIssue, setSelectedIssue] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const issueCategories = [
    { id: 'benefits_not_received', label: 'Recharge successful but data/calls not activated' },
    { id: 'recharge_pending', label: 'Payment deducted but recharge status is pending' },
    { id: '5g_activation', label: 'Jio True 5G welcome offer not working on 5G phone' },
    { id: 'wrong_plan', label: 'Recharged wrong plan or wrong mobile number' },
    { id: 'ott_activation', label: 'JioCinema / Hotstar / Prime subscription access issue' },
    { id: 'other', label: 'Other network or billing queries' }
  ];

  const faqs = [
    { q: 'How do I activate Jio True 5G Unlimited data?', a: 'Customers on active packs of ₹349 or above automatically receive the Jio True 5G Welcome Offer. Ensure 5G is enabled in your phone mobile network settings.' },
    { q: 'What happens if I recharge while an existing plan is active?', a: 'Your new recharge queues automatically and will activate immediately when your current plan validity finishes, without any loss of days.' },
    { q: 'How to claim Disney+ Hotstar or OTT subscriptions?', a: 'Download the partner app (e.g. Disney+ Hotstar) and sign in using the same Jio mobile number. Your subscription will be detected automatically.' }
  ];

  useEffect(() => {
    fetchTickets();
  }, [onLogout]);

  const fetchTickets = async () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      onLogout();
      return;
    }

    try {
      const response = await fetch(`/support/tickets/${user.mobile}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const result = await response.json();
        setTickets(result.tickets || []);
      }
    } catch (_) {}
    setLoading(false);
  };

  const submitTicket = async () => {
    if (!selectedIssue) {
      alert('Please select an issue category');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mobile: user.mobile,
          issueType: issueCategories.find((c) => c.id === selectedIssue)?.label || selectedIssue,
          description: description || 'Issue reported via Jio Care Portal'
        })
      });

      const result = await response.json();
      if (result.success) {
        setSuccessMessage(`Ticket #${result.ticketId} created successfully. Our Jio Care team will respond within 24 hours.`);
        setSelectedIssue('');
        setDescription('');
        fetchTickets();
        setActiveTab('tickets');
      }
    } catch (err) {
      alert('Failed to submit ticket. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="app-container">
      {/* Brand Header */}
      <header className="jio-navbar">
        <div className="jio-nav-inner">
          <div className="jio-brand" onClick={onBack}>
            <div className="jio-logo-badge">Jio</div>
            <div className="jio-brand-text">
              <h1>Jio Care Support</h1>
              <div className="jio-brand-tagline">
                <span>24x7 Customer Assistance</span>
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
        {successMessage && (
          <div style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '14px 18px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontWeight: 600
          }}>
            ✓ {successMessage}
          </div>
        )}

        {/* Tab Selector */}
        <div className="jio-category-tabs" style={{ marginBottom: '22px' }}>
          <button
            onClick={() => setActiveTab('new')}
            className={`jio-tab-pill ${activeTab === 'new' ? 'active' : ''}`}
          >
            <span>✍️</span> Report an Issue
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`jio-tab-pill ${activeTab === 'tickets' ? 'active' : ''}`}
          >
            <span>🎫</span> My Tickets ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`jio-tab-pill ${activeTab === 'faqs' ? 'active' : ''}`}
          >
            <span>❓</span> Quick FAQs
          </button>
        </div>

        {/* Tab 1: Report Issue */}
        {activeTab === 'new' && (
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '26px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 14px rgba(10, 40, 133, 0.08)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
              Select Your Issue
            </h3>

            <div style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
              {issueCategories.map((cat) => (
                <label
                  key={cat.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: selectedIssue === cat.id ? '2px solid #0050d5' : '1px solid #e2e8f0',
                    background: selectedIssue === cat.id ? '#eff6ff' : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="radio"
                    name="issue"
                    checked={selectedIssue === cat.id}
                    onChange={() => setSelectedIssue(cat.id)}
                    style={{ accentColor: '#0050d5', width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                    {cat.label}
                  </span>
                </label>
              ))}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Additional Details (Optional)
              </label>
              <textarea
                placeholder="Describe your query in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <button
              onClick={submitTicket}
              disabled={submitting || !selectedIssue}
              className="jio-btn-primary"
            >
              {submitting ? 'Submitting Ticket...' : 'Submit Support Ticket'}
            </button>
          </div>
        )}

        {/* Tab 2: My Tickets Loop */}
        {activeTab === 'tickets' && (
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '26px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 14px rgba(10, 40, 133, 0.08)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              Support Ticket History
            </h3>

            {tickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎫</div>
                <p>No support tickets raised yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {tickets.map((t) => (
                  <div
                    key={t._id || t.ticketId}
                    style={{
                      background: '#f8fafc',
                      borderRadius: '14px',
                      padding: '16px 20px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0050d5' }}>
                        #{t.ticketId || t._id}
                      </span>
                      <span style={{
                        background: t.status === 'Resolved' ? '#dcfce7' : '#fef3c7',
                        color: t.status === 'Resolved' ? '#15803d' : '#b45309',
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 800
                      }}>
                        {t.status}
                      </span>
                    </div>

                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', marginBottom: '4px' }}>
                      {t.issueType}
                    </div>

                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>
                      {t.description}
                    </p>

                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '8px' }}>
                      Raised on: {new Date(t.createdAt || Date.now()).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: FAQs Loop */}
        {activeTab === 'faqs' && (
          <div style={{ display: 'grid', gap: '14px' }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(10, 40, 133, 0.05)'
                }}
              >
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0050d5', marginBottom: '8px' }}>
                  Q: {faq.q}
                </h4>
                <p style={{ margin: 0, color: '#334155', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Helpline Contact Footer */}
        <div style={{
          marginTop: '28px',
          background: '#eff6ff',
          borderRadius: '16px',
          padding: '18px 22px',
          border: '1px solid #bfdbfe',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <strong style={{ color: '#1e40af' }}>📞 Jio Care Helpline: 199 (From Jio SIM)</strong>
            <div style={{ fontSize: '0.8rem', color: '#3b82f6' }}>General Helpline: 1800-889-9999 • Email: care@jio.com</div>
          </div>
          <span style={{ background: '#0050d5', color: '#fff', padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
            24x7 Available
          </span>
        </div>
      </main>
    </div>
  );
};

export default HelpSupportPage;
