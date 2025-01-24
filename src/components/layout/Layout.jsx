import { useState, useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { FaBars, FaTimes, FaEnvelope } from 'react-icons/fa'
import logo from '../../assets/images/logo.png'
import './Layout.css'

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = (e) => {
    e.stopPropagation() // Prevent event from bubbling
    setIsMenuOpen(!isMenuOpen)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.nav-container')) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isMenuOpen])

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location]) // Add location from useLocation if needed

  return (
    <div className="layout">
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="logo-link">
            <img src={logo} alt="StayConnected365" className="logo" />
          </Link>

          <button 
            className="mobile-menu-btn" 
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <Link to="/products" className="nav-link">Plans</Link>
            <Link to="/how-it-works" className="nav-link">How It Works</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/account" className="nav-link account-link">Account</Link>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Support</h3>
            <ul className="footer-links">
              <li><Link to="/faq" className="footer-link">FAQ</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Legal</h3>
            <ul className="footer-links">
              <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
              <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact</h3>
            <div className="contact-info">
              <a href="mailto:support@stayconnected365.com" className="contact-button">
                <FaEnvelope className="icon" />
                <span>support@stayconnected365.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} StayConnected365. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
