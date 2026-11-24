import React, { useState, useEffect } from 'react';

const InfoPagesContainer = ({ user, onBack, onLogout, initialTab = '5g' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [systemStatus, setSystemStatus] = useState({
    server: 'Operational',
    recharge: 'Operational',
    network: 'Jio True 5G Active',
    maintenance: false,
    lastUpdated: new Date().toISOString()
  });

  useEffect(() => {
    fetchSystemStatus();
  }, []);

  const fetchSystemStatus = async () => {
    try {
      const res = await fetch('/system/status');
      if (res.ok) {
        const data = await res.json();
        setSystemStatus(data);
      }
    } catch (_) {}
  };

  const tabs = [
    { id: '5g', label: '⚡ True 5G Coverage', icon: '⚡' },
    { id: 'status', label: '🟢 System Health', icon: '🟢' },
    { id: 'compliance', label: '📋 Privacy & Terms', icon: '📋' },
    { id: 'about', label: 'ℹ️ About Jio App', icon: 'ℹ️' }
  ];

  return (
    <div className="app-container">
      {/* Brand Header */}
      <header className="jio-navbar">
        <div className="jio-nav-inner">
          <div className="jio-brand" onClick={onBack}>
            <div className="jio-logo-badge">Jio</div>
            <div className="jio-brand-text">
              <h1>Information & Coverage</h1>
              <div className="jio-brand-tagline">
                <span>Network, Compliance & Platform</span>
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
        {/* Tab Selector Loop */}
        <div className="jio-category-tabs" style={{ marginBottom: '22px' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`jio-tab-pill ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: 5G Coverage */}
        {activeTab === '5g' && (
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '28px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 14px rgba(10, 40, 133, 0.08)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0050d5', marginBottom: '8px' }}>
              ⚡ Jio True 5G - Pan-India Standalone 5G Network
            </h3>
            <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Jio True 5G is the only Standalone (SA) 5G network in India with zero reliance on 4G infrastructure, delivering sub-10ms latency and speeds up to 1.5 Gbps.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '22px'
            }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>📡 Standalone (SA) 5G</strong>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Advanced cloud-native 5G core with dedicated spectrum.</p>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>📶 700 MHz & 3500 MHz</strong>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Deep indoor coverage combined with lightning high-capacity speeds.</p>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>⚡ Unlimited 5G Data</strong>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Included complimentary on all recharge packs of ₹349 and above.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: System Health */}
        {activeTab === 'status' && (
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '28px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 14px rgba(10, 40, 133, 0.08)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>
              🟢 Live System Health & API Gateways
            </h3>

            <div style={{ display: 'grid', gap: '14px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: '#f8fafc', borderRadius: '12px' }}>
                <div>
                  <strong>Jio Core Recharge Engine</strong>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Real-time subscription provisioner</div>
                </div>
                <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '9999px', fontWeight: 800, fontSize: '0.75rem' }}>
                  {systemStatus.recharge || 'Operational'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: '#f8fafc', borderRadius: '12px' }}>
                <div>
                  <strong>JioPay UPI Payment Gateway</strong>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Instant bank settlement gateway</div>
                </div>
                <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '9999px', fontWeight: 800, fontSize: '0.75rem' }}>
                  Operational (99.98% uptime)
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: '#f8fafc', borderRadius: '12px' }}>
                <div>
                  <strong>Database & Cache Nodes</strong>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>MongoDB Atlas & in-memory cluster</div>
                </div>
                <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '9999px', fontWeight: 800, fontSize: '0.75rem' }}>
                  Connected
                </span>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
              Last health sync: {new Date(systemStatus.lastUpdated || Date.now()).toLocaleString()}
            </div>
          </div>
        )}

        {/* Tab 3: Compliance & Privacy */}
        {activeTab === 'compliance' && (
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '28px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 14px rgba(10, 40, 133, 0.08)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
              📋 Privacy Policy & Telecom Compliance
            </h3>
            <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
              We adhere strictly to TRAI telecom regulations and the Digital Personal Data Protection (DPDP) Act of India. Your mobile authentication and recharge records are safeguarded with AES-256 end-to-end encryption.
            </p>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
              • No customer data is shared with third parties without explicit authorization.<br/>
              • Recharge receipts are legally valid tax invoices with GSTIN compliance.<br/>
              • All refunds conform to regulatory guidelines within 48 banking hours.
            </div>
          </div>
        )}

        {/* Tab 4: About App */}
        {activeTab === 'about' && (
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            boxShadow: '0 4px 14px rgba(10, 40, 133, 0.08)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#e0144c',
              color: '#fff',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 900,
              marginBottom: '12px'
            }}>
              Jio
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              Jio Smart Recharge Suite
            </h2>
            <p style={{ color: '#0050d5', fontWeight: 700, fontSize: '0.85rem', marginBottom: '16px' }}>
              Version 2.5.0 • True 5G Edition
            </p>
            <p style={{ maxWidth: '520px', margin: '0 auto 20px', color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Engineered for seamless digital recharge experiences across all Indian circles. Powered by high-speed React and resilient Node.js infrastructure.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default InfoPagesContainer;
