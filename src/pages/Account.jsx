function Account() {
  return (
    <div className="account">
      <h1>My Account</h1>
      <section className="dashboard">
        <div className="active-plans">
          <h2>Active Plans</h2>
          <div className="plan-list">
            <div className="plan-item">
              <h3>Europe Travel</h3>
              <p>Valid until: March 24, 2024</p>
              <p>Data remaining: 7.5GB</p>
              <button>View Details</button>
            </div>
          </div>
        </div>
        <div className="usage-stats">
          <h2>Data Usage</h2>
          <div className="usage-chart">
            {/* Chart will go here */}
            <p>75% of data remaining</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Account