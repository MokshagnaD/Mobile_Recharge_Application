import React, { useState, useEffect } from 'react';

const UsageAnalyticsPage = ({ user, onBack, onLogout }) => {
  const [loading, setLoading] = useState(true);
  const [usageData, setUsageData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsageData();
  }, [onLogout]);

  const fetchUsageData = async () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Session expired. Please sign in again.');
      onLogout();
      return;
    }

    try {
      const response = await fetch(`/usage/analytics/${user.mobile}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 401) {
        onLogout();
        return;
      }

      const result = await response.json();
      setUsageData(result);
    } catch (err) {
      setError('Unable to load real-time analytics data.');
    }
    setLoading(false);
  };

  const formatMb = (mb) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
    return `${mb} MB`;
  };

  const data = usageData || {
    dailyLimit: 2048,
    usedToday: 1380,
    totalData: 57344,
    totalUsed: 22528,
    validityDays: 28,
    remainingDays: 24,
    networkSpeed: '1.2 Gbps (Jio True 5G)',
    currentNetwork: 'Jio True 5G SA',
    callsMadeToday: 14,
    callsDurationMins: 42,
    smsUsedToday: 4,
    dailyUsage: [1420, 1680, 1890, 1250, 1380]
  };

  const dailyPercent = Math.min(100, Math.round((data.usedToday / data.dailyLimit) * 100));
  const totalPercent = Math.min(100, Math.round((data.totalUsed / data.totalData) * 100));

  return (
    <div className="app-container">
      {/* Brand Header */}
      <header className="jio-navbar">
        <div className="jio-nav-inner">
          <div className="jio-brand" onClick={onBack}>
            <div className="jio-logo-badge">Jio</div>
            <div className="jio-brand-text">
              <h1>Usage & Analytics</h1>
              <div className="jio-brand-tagline">
                <span>Real-Time 5G Network Telemetry</span>
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

        {/* 5G Live Telemetry Card */}
        <div style={{
          background: 'linear-gradient(135deg, #071e68 0%, #0050d5 100%)',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 8px 24px rgba(0, 80, 213, 0.25)',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ background: '#ffc107', color: '#000', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                5G SA LIVE
              </span>
              <span style={{ fontSize: '0.85rem', color: '#bfdbfe' }}>Current Network Connection</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
              {data.networkSpeed || '1.2 Gbps (Jio True 5G)'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#93c5fd', marginTop: '4px' }}>
              Tower: Jio SA-5G Tower #402 • Latency: 9ms • Jitter: 1.1ms
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '12px 20px',
            borderRadius: '14px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#dbeafe', fontWeight: 600 }}>SIM PHONE</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>+91 {user.mobile}</div>
            <div style={{ fontSize: '0.7rem', color: '#86efac' }}>🟢 5G Standalone Active</div>
          </div>
        </div>

        {/* Metric Meters Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '24px'
        }}>
          {/* Today's Data Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            padding: '22px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(10, 40, 133, 0.06)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                📶 Today's High-Speed Data
              </h3>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0050d5' }}>{dailyPercent}% Used</span>
            </div>

            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginBottom: '6px' }}>
              {formatMb(data.usedToday)}
              <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}> / {formatMb(data.dailyLimit)}</span>
            </div>

            <div className="jio-meter-bar-bg" style={{ height: '10px', marginBottom: '8px' }}>
              <div
                className="jio-meter-bar-fill"
                style={{
                  width: `${dailyPercent}%`,
                  background: dailyPercent > 90 ? '#e0144c' : 'linear-gradient(90deg, #10b981 0%, #0050d5 100%)'
                }}
              ></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
              <span>Remaining: <strong>{formatMb(Math.max(0, data.dailyLimit - data.usedToday))}</strong></span>
              <span>Resets at 12:00 AM</span>
            </div>
          </div>

          {/* Pack Validity Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            padding: '22px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(10, 40, 133, 0.06)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                ⏰ Plan Validity
              </h3>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#16a34a' }}>Active</span>
            </div>

            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0050d5', marginBottom: '6px' }}>
              {data.remainingDays} Days Left
              <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}> / {data.validityDays} Days</span>
            </div>

            <div className="jio-meter-bar-bg" style={{ height: '10px', marginBottom: '8px' }}>
              <div
                className="jio-meter-bar-fill"
                style={{ width: `${Math.round((data.remainingDays / data.validityDays) * 100)}%`, background: '#0050d5' }}
              ></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
              <span>Pack: Jio True 5G ₹349</span>
              <span>Includes 5G Unlimited</span>
            </div>
          </div>
        </div>

        {/* 5-Day Consumption Trend Bar Chart Loop */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(10, 40, 133, 0.06)',
          marginBottom: '24px'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
            📊 Daily Consumption Pattern (Last 5 Days)
          </h3>

          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '16px',
            height: '180px',
            padding: '10px 0 20px',
            borderBottom: '2px solid #e2e8f0'
          }}>
            {data.dailyUsage.map((usageMb, idx) => {
              const maxMb = Math.max(...data.dailyUsage, 2048);
              const heightPercent = Math.max(15, Math.round((usageMb / maxMb) * 100));
              const isToday = idx === data.dailyUsage.length - 1;

              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isToday ? '#0050d5' : '#64748b', marginBottom: '6px' }}>
                    {formatMb(usageMb)}
                  </span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '48px',
                      height: `${heightPercent}%`,
                      background: isToday ? 'linear-gradient(180deg, #0050d5 0%, #0a2885 100%)' : '#cbd5e1',
                      borderRadius: '8px 8px 0 0',
                      transition: 'height 0.4s ease'
                    }}
                  ></div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isToday ? '#0050d5' : '#475569', marginTop: '8px' }}>
                    {isToday ? 'Today' : `Day -${data.dailyUsage.length - 1 - idx}`}
                  </span>
                </div>
              );
            })}
          </div>

          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '12px', textAlign: 'center' }}>
            Unlimited True 5G data consumption is excluded from the daily 2GB quota.
          </p>
        </div>

        {/* Voice and SMS Telemetry */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '18px 22px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>VOICE CALLS (TODAY)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>
              {data.callsMadeToday} Calls • {data.callsDurationMins} Mins
            </div>
            <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
              ✓ Truly Unlimited (HD VoLTE / VoNR)
            </span>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '18px 22px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>SMS CONSUMPTION</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>
              {data.smsUsedToday} / 100 Sent
            </div>
            <span style={{ fontSize: '0.75rem', color: '#0050d5', fontWeight: 700 }}>
              96 SMS Remaining Today
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UsageAnalyticsPage;
