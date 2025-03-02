import { useState, useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'
import { useAuth } from '../context/AuthContext'
import { 
  FaUser, 
  FaSignOutAlt, 
  FaChartLine, 
  FaCog, 
  FaHistory,
  FaDownload,
  FaLock,
  FaEnvelope,
  FaBell,
  FaKey
} from 'react-icons/fa'
import './Account.css'
import { esimApi } from '../config/api'

function Account() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const navigate = useNavigate()
  const [userEsims, setUserEsims] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleBuyData = () => {
    navigate('/products')
  }

  const handleSettings = () => {
    setActiveTab('settings')
  }

  const fetchUserEsims = async () => {
    try {
      setLoading(true);
      
      // First get all available packages
      console.log('Fetching available packages...');
      const packagesResponse = await fetch('https://us-central1-stayconnected365-73277.cloudfunctions.net/packageList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'BASE' // Remove locationCode: '!GL' to get all packages
        })
      });

      if (!packagesResponse.ok) {
        throw new Error('Failed to fetch packages');
      }

      const packagesData = await packagesResponse.json();
      console.log('Packages Response:', packagesData);
      
      // Then get user's purchased eSIMs
      console.log('Fetching user eSIMs...');
      const userResponse = await fetch('https://us-central1-stayconnected365-73277.cloudfunctions.net/getUserEsims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.uid,
          pager: {
            pageNum: 1,
            pageSize: 20
          }
        })
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user eSIMs');
      }

      const userData = await userResponse.json();
      console.log('User eSIMs Response:', userData);
      
      if (!userData.success) {
        throw new Error(userData.errorMsg || 'Failed to fetch user eSIMs');
      }

      // Get the user's purchased eSIMs
      const userEsims = userData.obj?.esimList || [];
      console.log('User eSIMs:', userEsims);

      // Combine package info with user eSIM data
      const enrichedEsims = userEsims.map(esim => {
        console.log('Processing eSIM:', esim);
        const packageInfo = packagesData.obj?.packageList?.find(
          pkg => pkg.packageCode === esim.packageList[0]?.packageCode
        );
        console.log('Found package info:', packageInfo);
        
        return {
          ...esim,
          ...packageInfo,
          // Keep both original and enriched package data
          packageDetails: packageInfo,
          // Format data values
          totalDataGB: ((esim.totalVolume || 0) / (1024 * 1024 * 1024)).toFixed(1),
          usedDataGB: ((esim.orderUsage || 0) / (1024 * 1024 * 1024)).toFixed(2),
          status: esim.esimStatus,
          validUntil: esim.expiredTime ? new Date(esim.expiredTime).toLocaleDateString() : 'Not activated'
        };
      });

      console.log('Enriched eSIMs:', enrichedEsims);
      setUserEsims(enrichedEsims);
    } catch (err) {
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEsim = async (esimTranNo) => {
    try {
      setLoading(true);
      const response = await fetch('https://us-central1-stayconnected365-73277.cloudfunctions.net/cancelEsim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ esimTranNo })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel eSIM');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.errorMsg || 'Failed to cancel eSIM');
      }

      // Refresh the list after cancellation
      await fetchUserEsims();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'plans' || activeTab === 'usage') {
      fetchUserEsims()
    }
  }, [activeTab])

  // If not authenticated, show login prompt
  if (!user) {
    return (
      <div className="account-page">
        <div className="login-prompt">
          <div className="login-card">
            <div className="lock-icon">
              <FaLock />
            </div>
            <h2>Account Access</h2>
            <p>Please log in to view your account details and manage your eSIM plans.</p>
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">Log In</Link>
              <Link to="/signup" className="signup-btn">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If authenticated, show account dashboard
  return (
    <div className="account-page">
      <div className="account-header">
        <div className="content-wrapper">
          <div className="user-info">
            <div className="user-avatar">
              <FaUser />
            </div>
            <div className="user-details">
              <h2>{user.displayName || user.email}</h2>
              <p>{user.email}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="account-content">
        <div className="content-wrapper">
          <nav className="account-nav">
            <button 
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`nav-btn ${activeTab === 'plans' ? 'active' : ''}`}
              onClick={() => setActiveTab('plans')}
            >
              My Plans
            </button>
            <button 
              className={`nav-btn ${activeTab === 'usage' ? 'active' : ''}`}
              onClick={() => setActiveTab('usage')}
            >
              Data Usage
            </button>
            <button 
              className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </nav>

          {activeTab === 'dashboard' && (
            <div className="dashboard-content">
              <div className="dashboard-grid">
                <div className="quick-actions-card">
                  <h3>Quick Actions</h3>
                  <div className="actions-grid">
                    <button className="action-btn" onClick={handleBuyData}>
                      <FaDownload />
                      <span>Buy Data</span>
                    </button>
                    <button className="action-btn" onClick={() => setActiveTab('usage')}>
                      <FaChartLine />
                      <span>Usage Stats</span>
                    </button>
                    <button className="action-btn" onClick={() => setActiveTab('plans')}>
                      <FaHistory />
                      <span>History</span>
                    </button>
                    <button className="action-btn" onClick={handleSettings}>
                      <FaCog />
                      <span>Settings</span>
                    </button>
                  </div>
                </div>

                <div className="recent-activity-card">
                  <h3>Recent Activity</h3>
                  <p>No recent activity to display.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {activeTab === 'settings' && (
        <div className="settings-content">
          <h3>Account Settings</h3>
          <div className="settings-grid">
            {/* Profile Section */}
            <div className="settings-card">
              <div className="settings-card-header">
                <FaUser className="settings-icon" />
                <h4>Profile Information</h4>
              </div>
              <div className="settings-card-content">
                <form className="settings-form">
                  <div className="form-group">
                    <label>Display Name</label>
                    <input 
                      type="text" 
                      defaultValue={user.displayName || ''} 
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      defaultValue={user.email} 
                      disabled 
                    />
                  </div>
                  <button type="submit" className="save-btn">Save Changes</button>
                </form>
              </div>
            </div>

            {/* Security Section */}
            <div className="settings-card">
              <div className="settings-card-header">
                <FaKey className="settings-icon" />
                <h4>Security</h4>
              </div>
              <div className="settings-card-content">
                <form className="settings-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" placeholder="Enter current password" />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" placeholder="Enter new password" />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" placeholder="Confirm new password" />
                  </div>
                  <button type="submit" className="save-btn">Update Password</button>
                </form>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="settings-card">
              <div className="settings-card-header">
                <FaBell className="settings-icon" />
                <h4>Notifications</h4>
              </div>
              <div className="settings-card-content">
                <div className="settings-toggles">
                  <div className="toggle-item">
                    <label>Email Notifications</label>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="toggle-item">
                    <label>Usage Alerts</label>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="toggle-item">
                    <label>Promotional Updates</label>
                    <input type="checkbox" />
                  </div>
                </div>
                <button className="save-btn">Save Preferences</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'usage' && (
        <div className="usage-content">
          <h3>Data Usage</h3>
          <div className="usage-section">
            {loading ? (
              <p>Loading usage data...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : userEsims.length === 0 ? (
              <p>No active plans to show usage for.</p>
            ) : (
              <div className="usage-grid">
                {userEsims.map(esim => (
                  <div key={esim.iccid || esim.packageCode} className="usage-card">
                    <div className="usage-card-header">
                      <h4>
                        {(() => {
                          const name = esim.name || '';
                          // Extract data and duration using regex
                          const match = name.match(/(\d+)GB\s+(\d+)Days/i);
                          if (match) {
                            const [_, data, days] = match;
                            return `${data}GB Global Plan`;
                          }
                          return name.replace(/Global\d+\s+/, 'Global Plan - ');
                        })()}
                      </h4>
                      <span className="plan-duration">
                        {esim.duration || 0} days
                      </span>
                    </div>
                    
                    <div className="usage-stats">
                      <div className="data-usage">
                        <div className="usage-bar-container">
                          <div className="usage-bar">
                            <div 
                              className="usage-fill" 
                              style={{ 
                                width: `${((esim.orderUsage || 0) / (esim.totalVolume || 1)) * 100}%` 
                              }}
                            />
                          </div>
                          <div className="usage-percentage">
                            {Math.round(((esim.orderUsage || 0) / (esim.totalVolume || 1)) * 100)}%
                          </div>
                        </div>
                        
                        <div className="usage-details">
                          <div className="usage-item">
                            <span className="label">Used</span>
                            <span className="value">{((esim.orderUsage || 0) / (1024 * 1024 * 1024)).toFixed(2)} GB</span>
                          </div>
                          <div className="usage-item">
                            <span className="label">Total</span>
                            <span className="value">{((esim.totalVolume || 0) / (1024 * 1024 * 1024)).toFixed(1)} GB</span>
                          </div>
                        </div>
                      </div>

                      <div className="plan-info">
                        <div className="info-item">
                          <span className="label">Valid until</span>
                          <span className="value">
                            {esim.expiredTime ? new Date(esim.expiredTime).toLocaleDateString() : 'Not activated'}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="label">Status</span>
                          <span className={`status-badge ${(esim.smdpStatus || esim.esimStatus || '').toLowerCase()}`}>
                            {esim.smdpStatus || esim.esimStatus || 'Not activated'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="plans-content">
          <h3>My eSIM Plans</h3>
          <div className="plans-section">
            {loading ? (
              <p>Loading your plans...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : userEsims.length === 0 ? (
              <div className="no-plans-message">
                <p>You haven't purchased any eSIM plans yet.</p>
                <p>Get started with your first eSIM data plan!</p>
                <button onClick={() => navigate('/products')} className="primary-btn">
                  Browse Plans
                </button>
              </div>
            ) : (
              <div className="esim-plans-grid">
                {userEsims.map(esim => {
                  // Format the plan name
                  const name = esim.name || '';
                  const match = name.match(/(\d+)GB\s+(\d+)Days/i);
                  const formattedName = match 
                    ? `${match[1]}GB Global Plan` 
                    : name.replace(/Global\d+\s+/, 'Global Plan - ');

                  // Calculate data in GB
                  const totalData = ((esim.totalVolume || 0) / (1024 * 1024 * 1024)).toFixed(1);
                  const usedData = ((esim.orderUsage || 0) / (1024 * 1024 * 1024)).toFixed(2);
                  
                  return (
                    <div key={esim.iccid || esim.packageCode} className="esim-plan-card">
                      <div className="plan-header">
                        <h4>{formattedName}</h4>
                        <span className={`status-badge ${(esim.esimStatus || '').toLowerCase()}`}>
                          {esim.esimStatus || 'Not Activated'}
                        </span>
                      </div>
                      
                      <div className="plan-details">
                        <div className="data-usage-section">
                          <div className="usage-bar">
                            <div 
                              className="usage-fill" 
                              style={{ 
                                width: `${((esim.orderUsage || 0) / (esim.totalVolume || 1)) * 100}%` 
                              }}
                            />
                          </div>
                          <div className="data-stats">
                            <span>{usedData} GB used of {totalData} GB</span>
                          </div>
                        </div>

                        <div className="plan-info-grid">
                          <div className="info-item">
                            <span className="label">Plan ID</span>
                            <span className="value">{esim.iccid || esim.packageCode || 'N/A'}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Duration</span>
                            <span className="value">{esim.totalDuration || esim.duration || 0} days</span>
                          </div>
                          <div className="info-item">
                            <span className="label">Expires</span>
                            <span className="value">
                              {esim.expiredTime ? new Date(esim.expiredTime).toLocaleDateString() : 'Not activated'}
                            </span>
                          </div>
                        </div>

                        {esim.msisdn && (
                          <div className="info-item">
                            <span className="label">Phone Number</span>
                            <span className="value">{esim.msisdn}</span>
                          </div>
                        )}
                      </div>

                      <div className="plan-actions">
                        {esim.esimStatus === 'GOT_RESOURCE' && (
                          <button 
                            onClick={() => handleCancelEsim(esim.esimTranNo)}
                            className="cancel-btn"
                          >
                            Cancel Plan
                          </button>
                        )}

                        {esim.qrCodeUrl && (
                          <a 
                            href={esim.qrCodeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="qr-btn"
                          >
                            View QR Code
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Account