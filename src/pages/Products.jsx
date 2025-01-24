import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { esimApi } from '../config/api'
import './Products.css'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await esimApi.getProducts()
        setProducts(data)
      } catch (err) {
        setError('Failed to fetch products')
        console.error('Error in component:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handlePurchase = async (product) => {
    try {
      // Navigate to checkout with product details
      navigate('/checkout', { state: { product } })
    } catch (error) {
      console.error('Purchase error:', error)
      setError('Failed to process purchase')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="products-container">
      <h1>Available Plans</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h2>
              {product.name.includes('Global') ? (
                <>
                  <span className="plan-type">Global Plan</span>
                  <div className="plan-specs">
                    {product.data}GB for {product.duration} {product.durationUnit}s
                  </div>
                </>
              ) : (
                product.name
              )}
            </h2>
            <div className="product-details">
              <p>{product.data}GB Data</p>
              <p>Valid for {product.validityDays} days</p>
              <p>Speed: {product.speed}</p>
              {product.smsSupported && <p>SMS Supported</p>}
            </div>
            <div className="product-networks">
              {product.networks?.map((network) => (
                <div key={network.country} className="network-item">
                  {network.country}
                </div>
              ))}
            </div>
            <div className="product-price">
              <span className="price">
                ${product.price.toFixed(2)}
              </span>
              <span className="currency">{product.currencyCode}</span>
            </div>
            <button 
              onClick={() => handlePurchase(product)}
              className="select-plan-btn"
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products