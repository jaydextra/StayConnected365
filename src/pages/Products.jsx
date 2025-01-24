import { useState, useEffect } from 'react'
import { esimApi } from '../config/api'
import './Products.css'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await esimApi.getProducts()
        console.log('Fetched products:', data) // For debugging
        setProducts(data || [])
        setLoading(false)
      } catch (err) {
        console.error('Error in component:', err)
        setError(err.message || 'Failed to load products. Please try again later.')
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return <div className="loading">Loading available plans...</div>
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    )
  }

  return (
    <div className="products-page">
      <div className="content-wrapper">
        <h1>eSIM Plans</h1>
        <p className="intro">Choose your perfect eSIM plan for seamless connectivity worldwide.</p>
        
        <div className="products-grid">
          {products.map(product => (
            <div key={product.packageCode} className="product-card">
              <div className="product-header">
                <h2>{product.name}</h2>
                <span className="price">${(product.price / 10000).toFixed(2)}</span>
              </div>
              
              <div className="product-details">
                <p>{product.description}</p>
                <ul className="features">
                  <li>Data: {(product.volume / (1024 * 1024)).toFixed(0)}MB</li>
                  <li>Validity: {product.duration} {product.durationUnit.toLowerCase()}s</li>
                  <li>Coverage: {product.location}</li>
                  <li>Speed: {product.speed}</li>
                  {product.smsStatus > 0 && <li>SMS Support: Yes</li>}
                </ul>
              </div>

              <button 
                className="purchase-btn"
                onClick={() => handlePurchase(product.packageCode)}
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Products