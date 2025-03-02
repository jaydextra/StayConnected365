import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaBolt, 
  FaMobileAlt, 
  FaQrcode, 
  FaExchangeAlt,
  FaGlobeAmericas,
  FaShieldAlt,
  FaClock,
  FaPiggyBank,
  FaUsers,
  FaServer,
  FaHeadset
} from 'react-icons/fa'
import './Home.css'

function Home() {
  const [activeFeature, setActiveFeature] = useState(0)
  const navigate = useNavigate()

  const esimFeatures = [
    {
      title: "Instant Digital Delivery",
      description: "Get your eSIM delivered instantly to your email - no physical shipping needed.",
      icon: <FaBolt />,
      color: "var(--primary)"
    },
    {
      title: "Multiple Device Support",
      description: "Use one eSIM profile across multiple devices or store several profiles on one device.",
      icon: <FaMobileAlt />,
      color: "var(--primary)"
    },
    {
      title: "Easy Activation",
      description: "Simply scan a QR code to activate your eSIM - no phone calls or store visits required.",
      icon: <FaQrcode />,
      color: "var(--primary)"
    },
    {
      title: "Flexible Plans",
      description: "Switch between plans instantly without changing physical SIM cards.",
      icon: <FaExchangeAlt />,
      color: "var(--primary)"
    }
  ]

  const stats = [
    {
      number: "190+",
      label: "Countries Covered",
      icon: <FaGlobeAmericas />,
      duration: 2
    },
    {
      number: "100+",
      label: "Network Partners",
      icon: <FaUsers />,
      duration: 2.5
    },
    {
      number: "99.9%",
      label: "Uptime",
      icon: <FaServer />,
      duration: 3
    },
    {
      number: "24/7",
      label: "Support",
      icon: <FaHeadset />,
      duration: 1
    }
  ]

  const handleViewPlans = () => {
    navigate('/products')
  }

  const handleHowItWorks = () => {
    navigate('/how-it-works')
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Global Connectivity Made Simple</h1>
          <p className="hero-subtitle">
            Stay connected in 190+ countries with instant eSIM activation
          </p>
          <div className="cta-buttons">
            <button className="cta-primary" onClick={handleViewPlans}>View Plans</button>
            <button className="cta-secondary" onClick={handleHowItWorks}>How It Works</button>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="content-wrapper">
          <h2>Why Choose StayConnected365</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaGlobeAmericas />
              </div>
              <h3>Global Coverage</h3>
              <p>Connect instantly in over 190 countries worldwide</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaBolt />
              </div>
              <h3>Instant Activation</h3>
              <p>Get connected within minutes of purchase</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaPiggyBank />
              </div>
              <h3>Cost Effective</h3>
              <p>Save up to 70% on international roaming fees</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3>Secure Connection</h3>
              <p>Enterprise-grade security for your mobile data</p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      <section className="esim-features">
        <div className="content-wrapper">
          <h2>Why Choose eSIM Technology?</h2>
          <p className="section-subtitle">
            Experience the future of mobile connectivity with digital SIM cards
          </p>
          
          <div className="esim-features-container">
            <div className="feature-cards">
              {esimFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`feature-card-animated ${activeFeature === index ? 'active' : ''}`}
                  onClick={() => setActiveFeature(index)}
                  style={{
                    '--card-color': feature.color,
                    '--delay': `${index * 0.1}s`
                  }}
                >
                  <div className="feature-icon-large">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <div className="card-blur"></div>
                </div>
              ))}
            </div>
            
            <div className="esim-visual">
              <div className="phone-mockup">
                <div className="screen">
                  <div className="esim-animation">
                    <div className="signal-waves">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="connection-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" style={{ 
        background: 'linear-gradient(to right bottom, var(--secondary) 49.5%, var(--bg-secondary) 50%)' 
      }}></div>

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

      <section className="testimonials">
        <div className="content-wrapper">
          <h2>What Our Customers Say</h2>
          <div className="testimonials-grid">
            {[
              {
                name: "Sarah Johnson",
                role: "Digital Nomad",
                text: "StayConnected365 has been a game-changer for my remote work lifestyle. Seamless connectivity wherever I go!",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Business Traveler",
                text: "The best eSIM service I've used. Quick activation and reliable connection across multiple countries.",
                rating: 5
              },
              {
                name: "Emma Rodriguez",
                role: "Travel Blogger",
                text: "Finally, an affordable solution for staying connected while traveling. Love the flexible plans!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="stars">
                  {"★".repeat(testimonial.rating)}
                </div>
                <p className="quote">{testimonial.text}</p>
                <div className="author">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="content-wrapper">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card" style={{ '--delay': `${index * 0.2}s` }}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number" style={{ '--duration': `${stat.duration}s` }}>
                  {stat.number}
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home