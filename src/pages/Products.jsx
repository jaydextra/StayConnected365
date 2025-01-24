import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { esimApi } from '../config/api'
import './Products.css'

function Products() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  
  // Filter states
  const [dataFilter, setDataFilter] = useState('all')
  const [durationFilter, setDurationFilter] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 100])

  // Add this function to calculate min/max prices
  const getPriceRange = (products) => {
    if (!products.length) return [0, 100]
    const prices = products.map(p => p.price)
    return [
      Math.floor(Math.min(...prices)),
      Math.ceil(Math.max(...prices))
    ]
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await esimApi.getProducts()
        setProducts(data)
        setFilteredProducts(data)
        // Set initial price range based on actual products
        const [min, max] = getPriceRange(data)
        setPriceRange([min, max])
      } catch (err) {
        setError('Failed to fetch products')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...products]

    // Data filter
    if (dataFilter !== 'all') {
      filtered = filtered.filter(product => {
        switch(dataFilter) {
          case 'small': return product.data <= 2
          case 'medium': return product.data > 2 && product.data <= 10
          case 'large': return product.data > 10
          default: return true
        }
      })
    }

    // Duration filter
    if (durationFilter !== 'all') {
      filtered = filtered.filter(product => {
        switch(durationFilter) {
          case 'week': return product.duration <= 7
          case 'month': return product.duration > 7 && product.duration <= 30
          case 'year': return product.duration > 30
          default: return true
        }
      })
    }

    // Price filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    setFilteredProducts(filtered)
  }, [products, dataFilter, durationFilter, priceRange])

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

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Data Amount:</label>
          <select value={dataFilter} onChange={(e) => setDataFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="small">1-2 GB</option>
            <option value="medium">2-10 GB</option>
            <option value="large">10+ GB</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Duration:</label>
          <select value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="week">7 days or less</option>
            <option value="month">8-30 days</option>
            <option value="year">30+ days</option>
          </select>
        </div>

        <div className="filter-group price-filter">
          <label>Price Range:</label>
          <div className="price-inputs">
            <input
              type="number"
              min={getPriceRange(products)[0]}
              max={getPriceRange(products)[1]}
              value={priceRange[0]}
              onChange={(e) => setPriceRange([
                Number(e.target.value),
                priceRange[1]
              ])}
            />
            <span>to</span>
            <input
              type="number"
              min={getPriceRange(products)[0]}
              max={getPriceRange(products)[1]}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([
                priceRange[0],
                Number(e.target.value)
              ])}
            />
          </div>
          <input
            type="range"
            min={getPriceRange(products)[0]}
            max={getPriceRange(products)[1]}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([
              priceRange[0],
              Number(e.target.value)
            ])}
            className="price-slider"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="results-count">
        Showing {filteredProducts.length} of {products.length} plans
      </div>

      {/* Product grid */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
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