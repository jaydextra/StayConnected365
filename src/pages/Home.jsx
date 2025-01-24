import './Home.css'

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Global Connectivity Made Simple</h1>
          <p className="hero-subtitle">
            Stay connected in 190+ countries with instant eSIM activation
          </p>
          <div className="cta-buttons">
            <button className="cta-primary">View Plans</button>
            <button className="cta-secondary">How It Works</button>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="content-wrapper">
          <h2>Why Choose StayConnected365</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Global Coverage</h3>
              <p>Connect instantly in over 190 countries worldwide</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Activation</h3>
              <p>Get connected within minutes of purchase</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Cost Effective</h3>
              <p>Save up to 70% on international roaming fees</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Connection</h3>
              <p>Enterprise-grade security for your mobile data</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="content-wrapper">
          <h2>Get Started in 3 Easy Steps</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Choose Your Plan</h3>
              <p>Select from our range of regional or global data plans</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Receive eSIM</h3>
              <p>Get your eSIM delivered instantly via email</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Connect & Go</h3>
              <p>Scan, install, and stay connected wherever you are</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home