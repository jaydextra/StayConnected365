function Products() {
  return (
    <div className="products">
      <h1>Our eSIM Plans</h1>
      <section className="plans">
        <div className="plan-filters">
          <button>Regional</button>
          <button>Global</button>
          <button>Data Only</button>
        </div>
        <div className="plan-grid">
          {/* Plan cards will be mapped here */}
          <div className="plan-card">
            <h3>Europe Travel</h3>
            <p className="price">$29.99</p>
            <ul>
              <li>10GB Data</li>
              <li>30 Days Validity</li>
              <li>42 Countries</li>
            </ul>
            <button>Select Plan</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Products