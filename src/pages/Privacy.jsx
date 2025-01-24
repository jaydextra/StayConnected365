import '../styles/Legal.css'

function Privacy() {
  return (
    <div className="legal-page">
      <div className="content-wrapper">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

        <div className="legal-intro">
          <p>At StayConnected365, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.</p>
        </div>

        <section>
          <h2>1. Information We Collect</h2>
          <h3>1.1 Personal Information</h3>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>Name and contact details (email, phone number)</li>
            <li>Billing and payment information</li>
            <li>Device information (IMEI, EID)</li>
            <li>Service preferences and settings</li>
          </ul>

          <h3>1.2 Usage Information</h3>
          <p>We automatically collect certain information when you use our services:</p>
          <ul>
            <li>Data usage patterns</li>
            <li>Connection timestamps</li>
            <li>Network performance metrics</li>
            <li>Device type and operating system</li>
            <li>IP address and location data</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <h3>2.1 Primary Purposes</h3>
          <ul>
            <li>Providing and maintaining our eSIM services</li>
            <li>Processing your payments and transactions</li>
            <li>Sending service notifications and updates</li>
            <li>Responding to your inquiries and support requests</li>
          </ul>

          <h3>2.2 Secondary Purposes</h3>
          <ul>
            <li>Improving and optimizing our services</li>
            <li>Analyzing usage patterns and trends</li>
            <li>Preventing fraud and ensuring security</li>
            <li>Complying with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2>3. Data Security</h2>
          <p>We implement industry-standard security measures to protect your data:</p>
          <ul>
            <li>Encryption of sensitive information</li>
            <li>Secure server infrastructure</li>
            <li>Regular security audits and updates</li>
            <li>Restricted access to personal information</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Sharing and Disclosure</h2>
          <h3>4.1 Third-Party Service Providers</h3>
          <p>We may share your information with:</p>
          <ul>
            <li>Mobile network operators</li>
            <li>Payment processors</li>
            <li>Customer support services</li>
            <li>Analytics providers</li>
          </ul>

          <h3>4.2 Legal Requirements</h3>
          <p>We may disclose information when required by law:</p>
          <ul>
            <li>Court orders and legal processes</li>
            <li>Government requests</li>
            <li>Protection of rights and safety</li>
          </ul>
        </section>

        <section>
          <h2>5. Data Retention</h2>
          <p>We retain your information for the following periods:</p>
          <ul>
            <li>Account information: Duration of account activity plus 2 years</li>
            <li>Transaction records: 7 years (legal requirement)</li>
            <li>Usage data: 12 months</li>
            <li>Support communications: 2 years</li>
          </ul>
        </section>

        <section>
          <h2>6. Your Privacy Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
            <li>Export your data</li>
            <li>Withdraw consent</li>
          </ul>
        </section>

        <section>
          <h2>7. Cookies and Tracking</h2>
          <p>Our website uses:</p>
          <ul>
            <li>Essential cookies for site functionality</li>
            <li>Analytics cookies to improve service</li>
            <li>Session cookies for security</li>
          </ul>
        </section>

        <section>
          <h2>8. International Data Transfers</h2>
          <p>Your data may be processed in different countries:</p>
          <ul>
            <li>We comply with international data protection laws</li>
            <li>We implement appropriate safeguards for transfers</li>
            <li>We ensure adequate protection standards</li>
          </ul>
        </section>

        <section>
          <h2>9. Children's Privacy</h2>
          <p>Our services are not intended for children under 13. We do not knowingly collect information from children under 13 years old.</p>
        </section>

        <section>
          <h2>10. Changes to Privacy Policy</h2>
          <p>We may update this policy periodically. We will notify you of any material changes via email or website notice.</p>
        </section>

        <section>
          <h2>11. Contact Us</h2>
          <div className="contact-info">
            <p>For privacy-related inquiries or to exercise your rights:</p>
            <p className="email">Email: <a href="mailto:support@stayconnected365.com">support@stayconnected365.com</a></p>
            <p>Response Time: Within 24 hours</p>
            <p className="note">Please include "Privacy Request" in your subject line for faster processing.</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Privacy