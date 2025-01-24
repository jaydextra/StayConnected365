function HowItWorks() {
  return (
    <div className="how-it-works">
      <h1>How eSIM Works</h1>
      <section className="steps">
        <div className="step">
          <div className="step-number">1</div>
          <h3>Check Compatibility</h3>
          <p>Verify your device supports eSIM technology</p>
        </div>
        <div className="step">
          <div className="step-number">2</div>
          <h3>Choose Your Plan</h3>
          <p>Select the plan that fits your needs</p>
        </div>
        <div className="step">
          <div className="step-number">3</div>
          <h3>Install & Connect</h3>
          <p>Scan QR code and activate instantly</p>
        </div>
      </section>
      <section className="compatibility-checker">
        <h2>Check Your Device</h2>
        <div className="device-search">
          <input type="text" placeholder="Enter your device model..." />
          <button>Check</button>
        </div>
      </section>
    </div>
  )
}

export default HowItWorks