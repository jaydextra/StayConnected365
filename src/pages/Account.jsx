import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
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
  FaLock
} from 'react-icons/fa'
import './Account.css'

function Account() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

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
                    <button className="action-btn">
                      <FaDownload />
                      <span>Buy Data</span>
                    </button>
                    <button className="action-btn">
                      <FaChartLine />
                      <span>Usage Stats</span>
                    </button>
                    <button className="action-btn">
                      <FaHistory />
                      <span>History</span>
                    </button>
                    <button className="action-btn">
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
    </div>
  )
}

export default Account