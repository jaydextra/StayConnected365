import { useState } from 'react'
import { FaMobileAlt, FaQrcode, FaGlobe, FaCheckCircle } from 'react-icons/fa'
import './HowItWorks.css'

function HowItWorks() {
  const [activeDevice, setActiveDevice] = useState(null)

  const compatibleDevices = [
    {
      type: 'iPhone',
      models: ['iPhone XS', 'iPhone XS Max', 'iPhone XR', 'iPhone 11', 'iPhone 11 Pro', 'iPhone 12', 'iPhone 12 Pro', 'iPhone 13', 'iPhone 13 Pro', 'iPhone 14', 'iPhone 14 Pro', 'iPhone 15', 'iPhone 15 Pro']
    },
    {
      type: 'Samsung',
      models: ['Galaxy S20', 'Galaxy S21', 'Galaxy S22', 'Galaxy S23', 'Galaxy Note 20', 'Galaxy Z Fold', 'Galaxy Z Flip']
    },
    {
      type: 'Google',
      models: ['Pixel 3', 'Pixel 4', 'Pixel 5', 'Pixel 6', 'Pixel 7', 'Pixel 8']
    },
    {
      type: 'Other',
      models: ['iPad Pro', 'iPad Air', 'Motorola Razr', 'Huawei P40', 'OnePlus 8']
    }
  ]

  const steps = [
    {
      icon: <FaMobileAlt />,
      title: "Check Compatibility",
      description: "Verify your device supports eSIM technology using our device checker below.",
      detail: "Most modern smartphones support eSIM technology. It's built right into your device, requiring no physical SIM card."
    },
    {
      icon: <FaGlobe />,
      title: "Choose Your Plan",
      description: "Select from our range of regional or global data plans that best fit your needs.",
      detail: "We offer flexible plans for 190+ countries. Choose based on your destination, duration, and data needs."
    },
    {
      icon: <FaQrcode />,
      title: "Scan & Activate",
      description: "Receive your eSIM QR code instantly via email and scan it with your device.",
      detail: "Installation takes less than 5 minutes. Simply scan the QR code and follow the on-screen instructions."
    },
    {
      icon: <FaCheckCircle />,
      title: "Connect & Go",
      description: "Your eSIM is now ready to use! Enable it in your device settings when you need it.",
      detail: "Switch between your regular SIM and eSIM easily. Your eSIM activates instantly when you arrive at your destination."
    }
  ]

  return (
    <div className="how-it-works-page">
      <div className="hero-section">
        <div className="content-wrapper">
          <h1>How eSIM Works</h1>
          <p className="hero-description">
            Get connected in minutes with our simple eSIM activation process.
            No physical SIM card needed.
          </p>
        </div>
      </div>

      <section className="steps-section">
        <div className="content-wrapper">
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div className="step-card" key={index}>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <div className="step-detail">{step.detail}</div>
                <div className="step-number">{index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="compatibility-section">
        <div className="content-wrapper">
          <h2>Device Compatibility</h2>
          <p className="section-description">
            Check if your device is compatible with our eSIM service
          </p>

          <div className="device-grid">
            {compatibleDevices.map((device, index) => (
              <div 
                key={index}
                className={`device-card ${activeDevice === index ? 'active' : ''}`}
                onClick={() => setActiveDevice(activeDevice === index ? null : index)}
              >
                <h3>{device.type}</h3>
                <div className="models-list">
                  {device.models.map((model, modelIndex) => (
                    <span key={modelIndex} className="model-tag">{model}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="benefits-section">
        <div className="content-wrapper">
          <h2>Why Choose eSIM?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <h3>Instant Activation</h3>
              <p>No waiting for physical delivery. Get connected immediately after purchase.</p>
            </div>
            <div className="benefit-card">
              <h3>Dual SIM Capability</h3>
              <p>Keep your home number while using local data abroad.</p>
            </div>
            <div className="benefit-card">
              <h3>Easy Switching</h3>
              <p>Switch between different eSIM profiles with a few taps.</p>
            </div>
            <div className="benefit-card">
              <h3>Eco-Friendly</h3>
              <p>No plastic SIM cards needed, reducing environmental impact.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HowItWorks