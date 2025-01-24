import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PaymentProcessor from '../components/PaymentProcessor'
import { esimApi } from '../config/api'
import './Checkout.css'

function Checkout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { product } = location.state || {}
  const [step, setStep] = useState('payment') // 'payment' or 'activation'
  const [esimDetails, setEsimDetails] = useState(null)
  const [error, setError] = useState(null)

  if (!product) {
    navigate('/products')
    return null
  }

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      // Process eSIM purchase after successful payment
      const esimResponse = await esimApi.purchaseEsim(product)
      
      // Log the response to see what we're getting
      console.log('eSIM Response:', esimResponse)

      // Make sure we're getting a valid QR code URL
      if (!esimResponse.qrCode) {
        throw new Error('No QR code received from eSIM provider')
      }

      setEsimDetails(esimResponse)
      setStep('activation')
    } catch (err) {
      setError('Failed to generate eSIM. Please contact support.')
      console.error('eSIM Error:', err)
    }
  }

  // Add minimum amount check before showing payment form
  const minimumAmount = 0.50
  const isValidAmount = product.price >= minimumAmount

  return (
    <div className="checkout-container">
      <div className="checkout-progress">
        <div className={`progress-step ${step === 'payment' ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <span>Payment</span>
        </div>
        <div className="progress-line" />
        <div className={`progress-step ${step === 'activation' ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <span>Activation</span>
        </div>
      </div>

      <div className="product-summary">
        <div className="summary-header">
          <h2>{product.name}</h2>
          <div className="price-tag">${product.price.toFixed(2)}</div>
        </div>
        <div className="summary-details">
          <div className="detail-item">
            <span className="detail-label">Data</span>
            <span className="detail-value">{product.data}GB</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Duration</span>
            <span className="detail-value">{product.duration} days</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Price</span>
            <span className="detail-value">${product.price.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {step === 'payment' && (
        <div className="payment-section">
          <h2>Payment Details</h2>
          {!isValidAmount ? (
            <div className="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="error-icon">
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              Sorry, minimum payment amount is ${minimumAmount.toFixed(2)} USD
            </div>
          ) : (
            <PaymentProcessor amount={product.price} onSuccess={handlePaymentSuccess} />
          )}
        </div>
      )}

      {step === 'activation' && esimDetails && (
        <div className="activation-section">
          <div className="success-header">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="success-icon">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
            <h2>Your eSIM is Ready!</h2>
          </div>

          <div className="esim-details">
            <div className="qr-section">
              {esimDetails.qrCode ? (
                <>
                  <div className="qr-container">
                    <img src={esimDetails.qrCode} alt="eSIM QR Code" />
                  </div>
                  <p className="expiry-info">Valid until: {new Date(esimDetails.expiryDate).toLocaleDateString()}</p>
                </>
              ) : (
                <div className="qr-error">QR Code not available</div>
              )}
            </div>

            <div className="activation-guide">
              <div className="guide-section">
                <h3>How to Activate Your eSIM</h3>
                <ol className="steps-list">
                  <li>Go to your phone's Settings</li>
                  <li>Select Mobile Data or Cellular</li>
                  <li>Add Data Plan</li>
                  <li>Scan QR Code</li>
                  <li>Follow on-screen instructions</li>
                </ol>
              </div>

              {esimDetails.activationCode && (
                <div className="manual-section">
                  <h4>Manual Activation</h4>
                  <p>If you can't scan the QR code, use this activation code:</p>
                  <div className="code-container">
                    <code>{esimDetails.activationCode}</code>
                    <button onClick={() => navigator.clipboard.writeText(esimDetails.activationCode)} className="copy-button">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="copy-icon">
                        <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0121 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 017.5 16.125V3.375z" />
                        <path d="M15 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0017.25 7.5h-1.875A.375.375 0 0115 7.125V5.25zM4.875 6H6v10.125A3.375 3.375 0 009.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V7.875C3 6.839 3.84 6 4.875 6z" />
                      </svg>
                      Copy
                    </button>
                  </div>
                </div>
              )}

              <div className="details-section">
                <h4>eSIM Details</h4>
                <div className="details-grid">
                  <div className="detail-row">
                    <label>ICCID</label>
                    <span>{esimDetails.iccid}</span>
                  </div>
                  <div className="detail-row">
                    <label>Status</label>
                    <span className="status-badge">{esimDetails.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="error-icon">
            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  )
}

export default Checkout 