import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ user, onBack, onLogout }) => {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('plans'); // 'plans', 'subscriptions', 'failures', 'support'
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);

  const [newPlan, setNewPlan] = useState({
    planName: '',
    price: '',
    dataLimit: '',
    validity: '',
    category: 'popular',
    tag: ''
  });

  const [editForm, setEditForm] = useState({
    planName: '',
    price: '',
    dataLimit: '',
    validity: '',
    category: 'popular',
    tag: ''
  });

  useEffect(() => {
    if (user.role !== 'admin') {
      alert('Access denied: Admin privileges required.');
      onBack();
      return;
    }
    fetchAdminData();
  }, [user, onLogout]);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');

    if (!token) {
      onLogout();
      return;
    }

    try {
      // 1. Fetch Plans
      const plansRes = await fetch('/admin/plans', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (plansRes.status === 401 || plansRes.status === 403) {
        onLogout();
        return;
      }
      const plansData = await plansRes.json();
      setPlans(plansData.plans || []);

      // 2. Fetch Subscriptions
      const subsRes = await fetch('/admin/subscriptions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (subsRes.ok) {
        const subsData = await subsRes.json();
        setSubscriptions(subsData.subscriptions || []);
      }

      // 3. Fetch Support Tickets
      const ticketsRes = await fetch('/admin/support/tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (ticketsRes.ok) {
        const ticketsData = await ticketsRes.json();
        setSupportTickets(ticketsData.tickets || []);
      }
    } catch (err) {
      setError('Unable to load admin telemetry records.');
    }
    setLoading(false);
  };

  const handleAddPlan = async () => {
    if (!newPlan.planName || !newPlan.price || !newPlan.dataLimit || !newPlan.validity) {
      alert('Please fill all required plan fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/admin/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPlan)
      });

      if (response.ok) {
        setShowAddModal(false);
        setNewPlan({ planName: '', price: '', dataLimit: '', validity: '', category: 'popular', tag: '' });
        fetchAdminData();
      }
    } catch (_) {}
  };

  const handleUpdatePlan = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/admin/plans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      setEditingPlanId(null);
      fetchAdminData();
    } catch (_) {}
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Expired' : 'Active';
    try {
      const token = localStorage.getItem('token');
      await fetch(`/admin/plans/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchAdminData();
    } catch (_) {}
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Delete this plan permanently?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`/admin/plans/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdminData();
    } catch (_) {}
  };

  const handleResolveTicket = async (ticketId) => {
    const resolution = prompt('Enter resolution notes for customer:', 'Issue verified and resolved by Jio Support Engineer');
    if (!resolution) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`/admin/support/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Resolved', resolution })
      });
      fetchAdminData();
    } catch (_) {}
  };

  return (
    <div className="app-container">
      {/* Brand Header */}
      <header className="jio-navbar">
        <div className="jio-nav-inner">
          <div className="jio-brand" onClick={onBack}>
            <div className="jio-logo-badge">Jio</div>
            <div className="jio-brand-text">
              <h1>Admin Operations Console</h1>
              <div className="jio-brand-tagline">
                <span>Telecom Network Operations & Plans</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onBack} className="jio-logout-btn">
              ← Subscriber View
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

        {/* Tab Navigation */}
        <div className="jio-category-tabs" style={{ marginBottom: '22px' }}>
          <button
            onClick={() => setActiveTab('plans')}
            className={`jio-tab-pill ${activeTab === 'plans' ? 'active' : ''}`}
          >
            <span>📋</span> Plan Management ({plans.length})
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`jio-tab-pill ${activeTab === 'subscriptions' ? 'active' : ''}`}
          >
            <span>📊</span> Subscriptions ({subscriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`jio-tab-pill ${activeTab === 'support' ? 'active' : ''}`}
          >
            <span>💬</span> Support Tickets ({supportTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('failures')}
            className={`jio-tab-pill ${activeTab === 'failures' ? 'active' : ''}`}
          >
            <span>⚠️</span> Failure Tracking
          </button>
        </div>

        {/* Tab 1: Plan Management */}
        {activeTab === 'plans' && (
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 14px rgba(10, 40, 133, 0.08)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Jio Mobile Recharge Plans Catalog
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  Add, edit, expire, or delete active recharge denominations
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="jio-btn-primary"
                style={{ width: 'auto', padding: '10px 20px', margin: 0 }}
              >
                ➕ Add New Jio Plan
              </button>
            </div>

            <div style={{ display: 'grid', gap: '14px' }}>
              {plans.map((plan) => {
                const planId = plan._id || plan.id;
                const isEditing = editingPlanId === planId;

                return (
                  <div
                    key={planId}
                    style={{
                      background: '#f8fafc',
                      borderRadius: '14px',
                      padding: '18px 20px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    {isEditing ? (
                      /* Inline Edit Form */
                      <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '12px' }}>
                          <input
                            type="text"
                            placeholder="Plan Name"
                            value={editForm.planName}
                            onChange={(e) => setEditForm({ ...editForm, planName: e.target.value })}
                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                          />
                          <input
                            type="number"
                            placeholder="Price (₹)"
                            value={editForm.price}
                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                          />
                          <input
                            type="text"
                            placeholder="Data Limit"
                            value={editForm.dataLimit}
                            onChange={(e) => setEditForm({ ...editForm, dataLimit: e.target.value })}
                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                          />
                          <input
                            type="number"
                            placeholder="Validity (Days)"
                            value={editForm.validity}
                            onChange={(e) => setEditForm({ ...editForm, validity: e.target.value })}
                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleUpdatePlan(planId)}
                            style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingPlanId(null)}
                            style={{ background: '#64748b', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Normal View */
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>{plan.planName}</strong>
                            <span style={{
                              background: plan.planStatus === 'Active' ? '#dcfce7' : '#fee2e2',
                              color: plan.planStatus === 'Active' ? '#15803d' : '#b91c1c',
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              fontSize: '0.72rem',
                              fontWeight: 800
                            }}>
                              {plan.planStatus}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                            Price: <strong>₹{plan.price}</strong> • Data: <strong>{plan.dataLimit}</strong> • Validity: <strong>{plan.validity} Days</strong> • Category: <strong>{plan.category || 'popular'}</strong>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              setEditingPlanId(planId);
                              setEditForm({
                                planName: plan.planName,
                                price: plan.price,
                                dataLimit: plan.dataLimit,
                                validity: plan.validity,
                                category: plan.category || 'popular',
                                tag: plan.tag || ''
                              });
                            }}
                            style={{ background: '#0050d5', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(planId, plan.planStatus)}
                            style={{
                              background: plan.planStatus === 'Active' ? '#f59e0b' : '#10b981',
                              color: '#fff',
                              border: 'none',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {plan.planStatus === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeletePlan(planId)}
                            style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Subscription Monitoring */}
        {activeTab === 'subscriptions' && (
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 14px rgba(10, 40, 133, 0.08)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              Real-Time Customer Subscriptions
            </h3>

            <div style={{ display: 'grid', gap: '10px' }}>
              {subscriptions.map((sub, i) => (
                <div
                  key={sub._id || i}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>
                      +91 {sub.username} • {sub.planname}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Date: {new Date(sub.subscriptionDate).toLocaleString()} • Duration: {sub.subscriptionDuration} Days
                    </div>
                  </div>
                  <span style={{
                    background: '#dcfce7',
                    color: '#15803d',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}>
                    {sub.status || 'Active'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Support Tickets Management */}
        {activeTab === 'support' && (
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 14px rgba(10, 40, 133, 0.08)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              Subscriber Support Ticket Queue
            </h3>

            <div style={{ display: 'grid', gap: '12px' }}>
              {supportTickets.map((ticket) => (
                <div
                  key={ticket._id || ticket.ticketId}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <strong style={{ color: '#0050d5' }}>#{ticket.ticketId}</strong> • Mobile: <strong>+91 {ticket.mobile}</strong>
                    </div>
                    <span style={{
                      background: ticket.status === 'Resolved' ? '#dcfce7' : '#fef3c7',
                      color: ticket.status === 'Resolved' ? '#15803d' : '#b45309',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 800
                    }}>
                      {ticket.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                    {ticket.issueType}
                  </div>
                  <p style={{ margin: '4px 0 10px', fontSize: '0.85rem', color: '#64748b' }}>
                    {ticket.description}
                  </p>

                  {ticket.status !== 'Resolved' && (
                    <button
                      onClick={() => handleResolveTicket(ticket.ticketId)}
                      style={{
                        background: '#16a34a',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Resolve & Notify Customer
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Failure Tracking */}
        {activeTab === 'failures' && (
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 14px rgba(10, 40, 133, 0.08)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              Failed / Reversal Transactions Tracking
            </h3>

            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🟢</div>
              <p style={{ fontWeight: 700, color: '#16a34a' }}>All systems healthy. No unresolved recharge failures.</p>
              <small>Auto-reversals are handled directly by the JioPay engine.</small>
            </div>
          </div>
        )}

        {/* Add Plan Modal */}
        {showAddModal && (
          <div className="jio-modal-backdrop">
            <div className="jio-modal-card">
              <div className="jio-modal-head">
                <h3>Add New Jio Recharge Plan</h3>
                <button onClick={() => setShowAddModal(false)} className="jio-modal-close">✕</button>
              </div>

              <div className="jio-modal-body">
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Plan Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Jio True 5G ₹499"
                      value={newPlan.planName}
                      onChange={(e) => setNewPlan({ ...newPlan, planName: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Price (₹)</label>
                      <input
                        type="number"
                        placeholder="499"
                        value={newPlan.price}
                        onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Validity (Days)</label>
                      <input
                        type="number"
                        placeholder="28"
                        value={newPlan.validity}
                        onChange={(e) => setNewPlan({ ...newPlan, validity: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Data Allowance</label>
                    <input
                      type="text"
                      placeholder="e.g. 2GB/day + Unlimited 5G"
                      value={newPlan.dataLimit}
                      onChange={(e) => setNewPlan({ ...newPlan, dataLimit: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Category</label>
                      <select
                        value={newPlan.category}
                        onChange={(e) => setNewPlan({ ...newPlan, category: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                      >
                        <option value="5g">True 5G</option>
                        <option value="popular">Popular</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="booster">Data Booster</option>
                        <option value="annual">Annual</option>
                        <option value="topup">Top-up</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Tag Badge</label>
                      <input
                        type="text"
                        placeholder="e.g. Trending"
                        value={newPlan.tag}
                        onChange={(e) => setNewPlan({ ...newPlan, tag: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleAddPlan}
                    className="jio-btn-primary"
                    style={{ marginTop: '12px' }}
                  >
                    Publish Jio Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
