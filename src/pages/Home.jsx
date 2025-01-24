function Home() {
  return (
    <div className="home">
      <h1>Welcome to StayConnected365</h1>
      <section className="hero">
        <h2>Stay Connected Worldwide</h2>
        <p>Get instant mobile data access in 190+ countries</p>
        <div className="cta-buttons">
          <button className="primary">View Plans</button>
          <button className="secondary">How It Works</button>
        </div>
      </section>
      <section className="features">
        <h2>Why Choose Us</h2>
        <div className="feature-grid">
          <div className="feature">
            <h3>Instant Activation</h3>
            <p>Get connected within minutes of purchase</p>
          </div>
          <div className="feature">
            <h3>Global Coverage</h3>
            <p>Stay connected in 190+ countries</p>
          </div>
          <div className="feature">
            <h3>24/7 Support</h3>
            <p>Get help whenever you need it</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home