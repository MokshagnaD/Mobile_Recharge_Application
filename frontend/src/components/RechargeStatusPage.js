import React from 'react';

const RechargeStatusPage = ({ user, rechargeData, onBack, onLogout }) => {
  const data = rechargeData || {
    planName: 'Jio True 5G ₹349',
    price: 349,
    validity: 28,
    dataLimit: '2GB/day',
    transactionId: 'JIO' + Date.now().toString().slice(-8),
    paymentMethod: 'JioPay UPI',
    timestamp: new Date().toLocaleString(),
    success: true
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="app-container">
      {/* Brand Header */}
      <header className="jio-navbar">
        <div className="jio-nav-inner">
          <div className="jio-brand" onClick={onBack}>
            <div className="jio-logo-badge">Jio</div>
            <div className="jio-brand-text">
              <h1>Transaction Receipt</h1>
              <div className="jio-brand-tagline">
                <span>Instant Confirmation</span>
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
        <div className="jio-receipt-card">
          <div className="jio-success-icon">✓</div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginBottom: '4px' }}>
            Recharge Successful!
          </h2>
          <p style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.95rem', marginBottom: '20px' }}>
            Your Jio plan benefits have been activated immediately.
          </p>

          <div style={{
            background: '#f8fafc',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            marginBottom: '24px'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>AMOUNT PAID</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0050d5', margin: '4px 0 12px' }}>
              ₹{data.price || 349}
            </div>

            <div className="jio-receipt-table">
              <div className="jio-receipt-row">
                <span style={{ color: '#64748b' }}>Mobile Number</span>
                <strong style={{ color: '#0f172a' }}>+91 {user.mobile}</strong>
              </div>
              <div className="jio-receipt-row">
                <span style={{ color: '#64748b' }}>Plan Subscribed</span>
                <strong style={{ color: '#0f172a' }}>{data.planName}</strong>
              </div>
              <div className="jio-receipt-row">
                <span style={{ color: '#64748b' }}>Transaction ID</span>
                <strong style={{ color: '#0050d5', letterSpacing: '0.5px' }}>#{data.transactionId}</strong>
              </div>
              <div className="jio-receipt-row">
                <span style={{ color: '#64748b' }}>High Speed Data</span>
                <strong>{data.dataLimit} + Unlimited 5G Data</strong>
              </div>
              <div className="jio-receipt-row">
                <span style={{ color: '#64748b' }}>Pack Validity</span>
                <strong>{data.validity} Days</strong>
              </div>
              <div className="jio-receipt-row">
                <span style={{ color: '#64748b' }}>Voice & SMS</span>
                <strong>Truly Unlimited Calls • 100 SMS/day</strong>
              </div>
              <div className="jio-receipt-row">
                <span style={{ color: '#64748b' }}>Payment Mode</span>
                <strong>{data.paymentMethod || 'JioPay UPI'}</strong>
              </div>
              <div className="jio-receipt-row">
                <span style={{ color: '#64748b' }}>Date & Time</span>
                <span style={{ color: '#475569' }}>{data.timestamp || new Date().toLocaleString()}</span>
              </div>
            </div>

            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '0.8rem',
              color: '#065f46',
              fontWeight: 600,
              textAlign: 'left'
            }}>
              ✨ SMS confirmation has been sent to +91 {user.mobile}. Unlimited 5G Data is now ready to use on your 5G device.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={onBack}
              className="jio-btn-primary"
              style={{ flex: '1 1 200px', margin: 0 }}
            >
              Explore More Plans
            </button>
            <button
              onClick={handlePrint}
              className="jio-btn-secondary"
              style={{ flex: '1 1 140px', margin: 0 }}
            >
              🖨️ Print Receipt
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RechargeStatusPage;
