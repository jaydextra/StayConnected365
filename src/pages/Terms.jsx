import '../styles/Legal.css'

function Terms() {
  return (
    <div className="legal-page">
      <div className="content-wrapper">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

        <div className="legal-intro">
          <p>Welcome to StayConnected365. Please read these terms carefully before using our services.</p>
        </div>

        <section>
          <h2>1. Agreement to Terms</h2>
          <p>By accessing and using StayConnected365's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our services.</p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>StayConnected365 provides eSIM services for international mobile connectivity across 190+ countries. Our services include:</p>
          <ul>
            <li>Digital eSIM delivery and activation</li>
            <li>Global mobile data connectivity</li>
            <li>Customer support services</li>
            <li>Online account management</li>
          </ul>
        </section>

        <section>
          <h2>3. User Responsibilities</h2>
          <h3>3.1 Account Creation and Security</h3>
          <ul>
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the confidentiality of your account credentials</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Take responsibility for all activities under your account</li>
          </ul>

          <h3>3.2 Acceptable Use</h3>
          <ul>
            <li>Use the service only with compatible devices</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Respect network policies and fair usage guidelines</li>
            <li>Not engage in any unauthorized or illegal activities</li>
          </ul>
        </section>

        <section>
          <h2>4. Service Availability and Network Coverage</h2>
          <p>While we strive for optimal service availability:</p>
          <ul>
            <li>Network coverage depends on local carrier partnerships</li>
            <li>Service quality may vary by location and technical conditions</li>
            <li>We do not guarantee uninterrupted or error-free service</li>
            <li>Maintenance and updates may cause temporary service interruptions</li>
          </ul>
        </section>

        <section>
          <h2>5. Payments and Billing</h2>
          <h3>5.1 Pricing and Payment Terms</h3>
          <ul>
            <li>All prices are in USD unless otherwise specified</li>
            <li>Payment is required before service activation</li>
            <li>We accept major credit cards and specified payment methods</li>
            <li>Prices may change with prior notice</li>
          </ul>

          <h3>5.2 Refunds and Cancellations</h3>
          <p>Our refund policy includes:</p>
          <ul>
            <li>Refunds for unused eSIMs within 24 hours of purchase</li>
            <li>No refunds for partially used data plans</li>
            <li>Case-by-case evaluation for service issues</li>
            <li>Processing time of 5-10 business days for approved refunds</li>
          </ul>
        </section>

        <section>
          <h2>6. Data Usage and Fair Use</h2>
          <p>To ensure quality service for all users:</p>
          <ul>
            <li>Fair usage policies apply to all plans</li>
            <li>Speed may be reduced after exceeding plan limits</li>
            <li>No sharing or reselling of services is permitted</li>
            <li>We monitor usage patterns for service optimization</li>
          </ul>
        </section>

        <section>
          <h2>7. Intellectual Property</h2>
          <p>All content and materials available through our service are protected by:</p>
          <ul>
            <li>Copyright laws</li>
            <li>Trademark rights</li>
            <li>Other proprietary rights</li>
          </ul>
        </section>

        <section>
          <h2>8. Limitation of Liability</h2>
          <p>StayConnected365 shall not be liable for:</p>
          <ul>
            <li>Indirect or consequential damages</li>
            <li>Service interruptions or data loss</li>
            <li>Issues caused by third-party carriers</li>
            <li>Force majeure events</li>
          </ul>
        </section>

        <section>
          <h2>9. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Changes will be effective upon posting to the website. Continued use of our services constitutes acceptance of modified terms.</p>
        </section>

        <section>
          <h2>10. Contact Information</h2>
          <div className="contact-info">
            <p>For any questions regarding these terms, please contact us at:</p>
            <p className="email">Email: <a href="mailto:support@stayconnected365.com">support@stayconnected365.com</a></p>
            <p>Response Time: Within 24 hours</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Terms