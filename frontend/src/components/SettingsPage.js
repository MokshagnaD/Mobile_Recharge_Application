import React, { useState, useEffect } from 'react';

const SettingsPage = ({ user, onBack, onLogout }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    language: 'en',
    sessionTimeout: 30,
    biometric: false,
    autoRecharge: false,
    fiveGStandalone: true
  });

  useEffect(() => {
    fetchSettings();
  }, [onLogout]);

  const fetchSettings = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      onLogout();
      return;
    }

    try {
      const response = await fetch(`/settings/${user.mobile}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const result = await response.json();
        if (result.settings) {
          setSettings((prev) => ({ ...prev, ...result.settings }));
        }
      }
    } catch (_) {}
    setLoading(false);
  };

  const updateSetting = async (key, val) => {
    const updated = { ...settings, [key]: val };
    setSettings(updated);
    setSaving(true);
    setSaveSuccess(false);

    try {
      const token = localStorage.getItem('token');
      await fetch(`/settings/${user.mobile}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ [key]: val })
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (_) {}
    setSaving(false);
  };

  return (
    <div className="app-container">
      {/* Brand Header */}
      <header className="jio-navbar">
        <div className="jio-nav-inner">
          <div className="jio-brand" onClick={onBack}>
            <div className="jio-logo-badge">Jio</div>
            <div className="jio-brand-text">
              <h1>Settings & Preferences</h1>
              <div className="jio-brand-tagline">
                <span>Account, Network & Language</span>
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

      <main className="main-content" style={{ maxWidth: '640px' }}>
        {saveSuccess && (
          <div style={{
            background: '#ecfdf5',
            color: '#065f46',
            padding: '10px 16px',
            borderRadius: '10px',
            marginBottom: '18px',
            fontSize: '0.85rem',
            fontWeight: 700
          }}>
            ✓ Settings saved successfully
          </div>
        )}

        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '24px 28px',
          boxShadow: '0 4px 14px rgba(10, 40, 133, 0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
            Preferences for +91 {user.mobile}
          </h3>

          {/* Setting 1: Notifications */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 0',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                🔔 Plan Expiry & Recharge Reminders
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Receive timely alerts 3 days before your pack expires
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => updateSetting('notifications', e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: '#0050d5', cursor: 'pointer' }}
            />
          </div>

          {/* Setting 2: Language */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 0',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                🌐 Preferred Language
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Display UI in your regional language
              </div>
            </div>
            <select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          </div>

          {/* Setting 3: True 5G SA */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 0',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                ⚡ True 5G Standalone (SA) Optimization
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Enable high-speed True 5G SA carrier aggregation
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.fiveGStandalone}
              onChange={(e) => updateSetting('fiveGStandalone', e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: '#0050d5', cursor: 'pointer' }}
            />
          </div>

          {/* Setting 4: Auto Recharge */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 0',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                🔄 Auto-Recharge on Expiry
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Automatically recharge your favorite plan via JioPay UPI
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoRecharge}
              onChange={(e) => updateSetting('autoRecharge', e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: '#0050d5', cursor: 'pointer' }}
            />
          </div>

          {/* Setting 5: Session Timeout */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 0'
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                ⏰ Session Inactivity Timeout
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Auto logout after inactivity for security
              </div>
            </div>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={60}>1 Hour</option>
              <option value={120}>2 Hours</option>
            </select>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
