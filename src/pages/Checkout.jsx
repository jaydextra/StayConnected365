import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { esimApi } from '../config/api'
import './Checkout.css'

function Checkout() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [esimDetails, setEsimDetails] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const product = location.state?.product

  const handlePayment = async () => {
    try {
      setLoading(true)
      setError(null)

      // 1. Process payment (integrate with Stripe/PayPal here)
      // const paymentResult = await processPayment(product.price)

      // 2. Order eSIM from provider
      const esimOrder = await esimApi.purchaseEsim(product)

      // 3. Show eSIM details
      setEsimDetails(esimOrder)

    } catch (err) {
      console.error('Checkout error:', err)
      setError('Failed to process payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!product) {
    return (
      <div className="checkout-error">
        <h2>No product selected</h2>
        <button onClick={() => navigate('/products')}>
          Return to Products
        </button>
      </div>
    )
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      
      <div className="order-summary">
        <h2>Order Summary</h2>
        <div className="product-info">
          <h3>{product.name}</h3>
          <div className="details">
            <p>{product.data}GB Data</p>
            <p>Valid for {product.validityDays} days</p>
            <p>Speed: {product.speed}</p>
            {product.smsSupported && <p>SMS Supported</p>}
          </div>
        </div>
        <div className="price-info">
          <div className="total">
            <span>Total:</span>
            <span>${product.price.toFixed(2)} {product.currencyCode}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {esimDetails && (
        <div className="esim-details">
          <h2>Your eSIM Details</h2>
          <div className="qr-code">
            <img src={esimDetails.qrCode} alt="eSIM QR Code" />
          </div>
          <div className="activation-info">
            <p>Activation Code: {esimDetails.activationCode}</p>
            <p>Manual Activation Instructions:</p>
            <ol>
              <li>Go to your phone's Settings</li>
              <li>Select Mobile Data > Add Data Plan</li>
              <li>Scan QR Code or enter activation code manually</li>
            </ol>
          </div>
        </div>
      )}

      <button 
        className="checkout-btn" 
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Proceed to Payment'}
      </button>
    </div>
  )
}

export default Checkout 