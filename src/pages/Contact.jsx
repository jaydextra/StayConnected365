function Contact() {
  return (
    <div className="contact">
      <h1>Contact & Support</h1>
      <section className="contact-form">
        <h2>Get in Touch</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Your name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Your email" />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <select id="subject">
              <option value="">Select a topic</option>
              <option value="support">Technical Support</option>
              <option value="billing">Billing</option>
              <option value="general">General Inquiry</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" rows="5" placeholder="How can we help?"></textarea>
          </div>
          <button type="submit">Send Message</button>
        </form>
      </section>
    </div>
  )
}

export default Contact