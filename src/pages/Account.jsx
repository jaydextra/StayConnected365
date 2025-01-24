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
      setLoading(true)
      const response = await esimApi.queryEsims({
        pager: {
          pageNum: 1,
          pageSize: 20
        }
      })

      if (!response.obj?.esimList) {
        throw new Error('No eSIM data found')
      }

      // Filter out any cancelled or expired eSIMs if needed
      const activeEsims = response.obj.esimList.filter(esim => 
        !['CANCEL', 'USED_EXPIRED', 'UNUSED_EXPIRED'].includes(esim.esimStatus)
      )

      setUserEsims(activeEsims)
    } catch (err) {
      console.error('Error fetching eSIMs:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEsim = async (esimTranNo) => {
    try {
      setLoading(true)
      await esimApi.cancelEsim({ esimTranNo })
      // Refresh the list after cancellation
      await fetchUserEsims()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

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
                  <div key={esim.iccid} className="usage-card">
                    <h4>{esim.packageList[0]?.packageName}</h4>
                    <div className="usage-stats">
                      <div className="data-usage">
                        <div className="usage-bar">
                          <div 
                            className="usage-fill" 
                            style={{ 
                              width: `${(esim.orderUsage / esim.totalVolume) * 100}%` 
                            }}
                          />
                        </div>
                        <div className="usage-labels">
                          <span>
                            Used: {((esim.orderUsage) / (1024 * 1024 * 1024)).toFixed(2)}GB
                          </span>
                          <span>
                            Total: {(esim.totalVolume / (1024 * 1024 * 1024)).toFixed(1)}GB
                          </span>
                        </div>
                      </div>
                      <div className="validity-info">
                        <p>Valid until: {new Date(esim.expiredTime).toLocaleDateString()}</p>
                        <p>Status: {esim.smdpStatus}</p>
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
                {userEsims.map(esim => (
                  <div key={esim.iccid} className="esim-plan-card">
                    <div className="plan-header">
                      <h4>{esim.packageList[0]?.packageName || 'eSIM Plan'}</h4>
                      <span className={`status ${esim.esimStatus.toLowerCase()}`}>
                        {esim.esimStatus}
                      </span>
                    </div>
                    
                    <div className="plan-details">
                      <div className="detail-item">
                        <span>ICCID:</span>
                        <span>{esim.iccid}</span>
                      </div>
                      <div className="detail-item">
                        <span>Data:</span>
                        <span>{(esim.totalVolume / (1024 * 1024 * 1024)).toFixed(1)}GB</span>
                      </div>
                      <div className="detail-item">
                        <span>Used:</span>
                        <span>{((esim.orderUsage || 0) / (1024 * 1024 * 1024)).toFixed(2)}GB</span>
                      </div>
                      <div className="detail-item">
                        <span>Validity:</span>
                        <span>{esim.totalDuration} {esim.durationUnit}</span>
                      </div>
                      <div className="detail-item">
                        <span>Expires:</span>
                        <span>{new Date(esim.expiredTime).toLocaleDateString()}</span>
                      </div>
                      {esim.msisdn && (
                        <div className="detail-item">
                          <span>Phone Number:</span>
                          <span>{esim.msisdn}</span>
                        </div>
                      )}
                    </div>

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
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Account