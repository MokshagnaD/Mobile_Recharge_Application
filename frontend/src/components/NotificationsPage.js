import React, { useState, useEffect, useMemo } from 'react';

const NotificationsPage = ({ user, onBack, onLogout }) => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'All Alerts', icon: '🔔' },
    { id: 'recharge', label: 'Recharge', icon: '💳' },
    { id: 'expiry', label: 'Plan Expiry', icon: '⏰' },
    { id: 'usage', label: 'Usage Alerts', icon: '📊' },
    { id: 'security', label: 'Security', icon: '🔐' },
    { id: 'system', label: 'Jio 5G Updates', icon: '⚡' }
  ];

  useEffect(() => {
    fetchNotifications();
  }, [onLogout]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      onLogout();
      return;
    }

    try {
      const response = await fetch(`/notifications/${user.mobile}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 401) {
        onLogout();
        return;
      }

      const result = await response.json();
      setNotifications(result.notifications || []);
    } catch (err) {
      setError('Unable to load alerts.');
    }
    setLoading(false);
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications((prev) =>
        prev.map((n) => (n._id === id || n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (_) {}
  };

  const clearAllNotifications = async () => {
    if (!window.confirm('Clear all notifications?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`/notifications/${user.mobile}/clear-all`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications([]);
    } catch (_) {}
  };

  const filteredNotifications = useMemo(() => {
    if (filter === 'all') return notifications;
    return notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="app-container">
      {/* Brand Header */}
      <header className="jio-navbar">
        <div className="jio-nav-inner">
          <div className="jio-brand" onClick={onBack}>
            <div className="jio-logo-badge">Jio</div>
            <div className="jio-brand-text">
              <h1>Alerts & Notifications</h1>
              <div className="jio-brand-tagline">
                <span>Account Updates & Reminders</span>
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

        {/* Header Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Recent Alerts
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
              You have <strong>{unreadCount}</strong> unread message{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.825rem',
                fontWeight: 700,
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              🗑️ Clear All
            </button>
          )}
        </div>

        {/* Filter Categories Loop */}
        <div className="jio-category-tabs" style={{ marginBottom: '20px' }}>
          {categories.map((cat) => {
            const count = cat.id === 'all'
              ? notifications.length
              : notifications.filter((n) => n.type === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`jio-tab-pill ${filter === cat.id ? 'active' : ''}`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span style={{ fontSize: '0.72rem', opacity: 0.85 }}>({count})</span>
              </button>
            );
          })}
        </div>

        {/* Notifications List Loop */}
        <div style={{ display: 'grid', gap: '12px' }}>
          {filteredNotifications.map((n) => (
            <div
              key={n._id || n.id}
              style={{
                background: n.isRead ? '#ffffff' : '#f0f7ff',
                borderRadius: '16px',
                padding: '18px 22px',
                border: n.isRead ? '1px solid #e2e8f0' : '1px solid #bfdbfe',
                boxShadow: '0 2px 8px rgba(10, 40, 133, 0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '14px',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  {!n.isRead && (
                    <span style={{
                      width: '8px',
                      height: '8px',
                      background: '#0050d5',
                      borderRadius: '50%',
                      display: 'inline-block'
                    }}></span>
                  )}
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                    {n.title}
                  </h4>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: n.priority === 'high' ? '#fee2e2' : '#f1f5f9',
                    color: n.priority === 'high' ? '#b91c1c' : '#475569'
                  }}>
                    {n.type?.toUpperCase()}
                  </span>
                </div>

                <p style={{ margin: '4px 0 8px', fontSize: '0.875rem', color: '#334155', lineHeight: 1.5 }}>
                  {n.message}
                </p>

                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {new Date(n.createdAt || Date.now()).toLocaleString()}
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n._id || n.id)}
                  style={{
                    background: '#0050d5',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '50px 20px',
              background: '#ffffff',
              borderRadius: '16px',
              color: '#64748b',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔔</div>
              <p style={{ fontWeight: 600 }}>No notifications in this category.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;
