import { Link } from 'react-router-dom'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Legal</h3>
            <ul>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact</h3>
            <div className="contact-info">
              <a href="mailto:support@stayconnected365.com">support@stayconnected365.com</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} StayConnected365. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
