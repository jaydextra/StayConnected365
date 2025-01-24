import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { esimApi } from '../config/api'
import './Products.css'
import { FiSearch, FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { countryNames, getCountryName } from '../data/countryNames'
import { formatPlanName, formatPrice } from '../data/planFormatters'

function Products() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  
  // Simplified filter state
  const [filters, setFilters] = useState({
    region: 'all',
    minData: 0,
    maxData: 1000,
    minPrice: 0,
    maxPrice: 1000,
    duration: 'all',
    searchTerm: ''
  })

  // Remove unused states
  const [locations, setLocations] = useState({})
  const [sortBy, setSortBy] = useState('price')

  // Add state for search suggestions
  const [searchSuggestions, setSearchSuggestions] = useState([])

  // Add initialized state to track if products have been loaded
  const [initialized, setInitialized] = useState(false)

  // Add state for search input separate from filters
  const [searchInput, setSearchInput] = useState('')

  // Initialize with all product IDs collapsed
  const [collapsedCoverage, setCollapsedCoverage] = useState(() => {
    // Start with all collapsed
    return new Set(['all'])
  })

  // Add state for actual data and price ranges
  const [ranges, setRanges] = useState({
    data: { min: 0, max: 1000 },
    price: { min: 0, max: 1000 }
  })

  // Group locations by region when products are fetched
  const groupLocationsByRegion = (products) => {
    const regions = {}
    
    // Helper function to check country names
    const isInRegion = (country, keywords) => {
      return keywords.some(keyword => 
        country.toLowerCase().includes(keyword.toLowerCase())
      )
    }

    products.forEach(product => {
      product.networks?.forEach(network => {
        // Determine region based on country name
        let region = 'Other'
        const country = network.country

        if (isInRegion(country, ['united states', 'usa', 'us'])) {
          region = 'North America'
        } else if (isInRegion(country, ['canada', 'mexico'])) {
          region = 'North America'
        } else if (isInRegion(country, [
          'brazil', 'argentina', 'chile', 'peru', 'colombia', 
          'venezuela', 'ecuador', 'bolivia', 'paraguay', 'uruguay'
        ])) {
          region = 'South America'
        } else if (isInRegion(country, [
          'costa rica', 'panama', 'honduras', 'guatemala', 
          'el salvador', 'nicaragua', 'belize'
        ])) {
          region = 'Central America'
        } else if (isInRegion(country, [
          'jamaica', 'bahamas', 'barbados', 'trinidad', 'dominican',
          'haiti', 'cuba', 'puerto rico', 'caribbean'
        ])) {
          region = 'Caribbean'
        } else if (isInRegion(country, [
          'china', 'japan', 'korea', 'taiwan', 'hong kong', 'macau'
        ])) {
          region = 'East Asia'
        } else if (isInRegion(country, [
          'thailand', 'vietnam', 'cambodia', 'laos', 'myanmar',
          'malaysia', 'singapore', 'indonesia', 'philippines',
          'brunei'
        ])) {
          region = 'Southeast Asia'
        } else if (isInRegion(country, [
          'india', 'pakistan', 'bangladesh', 'sri lanka', 
          'nepal', 'bhutan', 'maldives'
        ])) {
          region = 'South Asia'
        } else if (isInRegion(country, [
          'uk', 'england', 'scotland', 'wales', 'ireland',
          'france', 'germany', 'italy', 'spain', 'portugal',
          'netherlands', 'belgium', 'luxembourg', 'switzerland',
          'austria', 'denmark', 'norway', 'sweden', 'finland',
          'iceland'
        ])) {
          region = 'Europe'
        } else if (isInRegion(country, [
          'russia', 'ukraine', 'belarus', 'poland', 'czech',
          'slovakia', 'hungary', 'romania', 'bulgaria', 'moldova',
          'estonia', 'latvia', 'lithuania'
        ])) {
          region = 'Eastern Europe'
        } else if (isInRegion(country, [
          'turkey', 'israel', 'saudi', 'uae', 'qatar', 'kuwait',
          'bahrain', 'oman', 'jordan', 'lebanon', 'iraq', 'iran'
        ])) {
          region = 'Middle East'
        } else if (isInRegion(country, [
          'egypt', 'morocco', 'algeria', 'tunisia', 'libya',
          'sudan', 'ethiopia', 'kenya', 'tanzania', 'uganda',
          'nigeria', 'ghana', 'ivory coast', 'senegal', 'south africa'
        ])) {
          region = 'Africa'
        } else if (isInRegion(country, [
          'australia', 'new zealand', 'fiji', 'samoa', 'tonga',
          'papua new guinea', 'solomon'
        ])) {
          region = 'Oceania'
        }

        // Add to regions
        if (!regions[region]) {
          regions[region] = new Set()
        }
        regions[region].add(country)
      })
    })

    // Sort regions alphabetically
    const sortedRegions = Object.keys(regions)
      .sort()
      .reduce((acc, region) => {
        acc[region] = Array.from(regions[region]).sort()
        return acc
      }, {})

    console.log('Grouped locations:', sortedRegions)
    return sortedRegions
  }

  // Update loadProducts function
  const loadProducts = async () => {
    if (loading || initialized) return // Don't load if already loaded
    setLoading(true)
    try {
      const data = await esimApi.getProducts()
      setProducts(data)
      setFilteredProducts(data)
      setLocations(groupLocationsByRegion(data))
      setInitialized(true) // Mark as initialized
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  // Load products on mount
  useEffect(() => {
    loadProducts()
  }, []) // Only run once on mount

  // Update ranges when products load
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map(p => p.price)
      const data = products.map(p => p.data)
      
      setRanges({
        price: {
          min: Math.min(...prices),
          max: Math.max(...prices)
        },
        data: {
          min: Math.min(...data),
          max: Math.max(...data)
        }
      })

      // Update filter ranges
      setFilters(prev => ({
        ...prev,
        maxData: Math.max(...data),
        maxPrice: Math.max(...prices)
      }))
    }
  }, [products])

  // Update filter logic
  useEffect(() => {
    if (!products.length) return

    let filtered = [...products]

    // Search filter
    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(product => {
        if (product.name.toLowerCase().includes(search)) return true
        return product.coverage.some(code => 
          getCountryName(code).toLowerCase().includes(search)
        )
      })
    }

    // Data filter
    if (filters.minData > 0 || filters.maxData < ranges.data.max) {
      filtered = filtered.filter(product => 
        product.data >= filters.minData && 
        product.data <= filters.maxData
      )
    }

    // Price filter
    if (filters.minPrice > 0 || filters.maxPrice < ranges.price.max) {
      filtered = filtered.filter(product => 
        product.price >= filters.minPrice && 
        product.price <= filters.maxPrice
      )
    }

    // Duration filter
    if (filters.duration !== 'all') {
      filtered = filtered.filter(product => {
        const days = product.duration
        switch(filters.duration) {
          case 'daily': return days === 1
          case 'weekly': return days > 1 && days <= 7
          case 'monthly': return days > 7 && days <= 30
          case 'yearly': return days > 30
          default: return true
        }
      })
    }

    // Sort products
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'price': return a.price - b.price
        case 'data': return b.data - a.data
        default: return 0
      }
    })

    setFilteredProducts(filtered)
  }, [products, filters, sortBy, ranges])

  // Update search handling
  const handleSearch = (input) => {
    setSearchInput(input)
    
    // Start loading products if not initialized
    if (!initialized) {
      loadProducts()
    }

    if (input.length > 1) {
      // Get unique countries from all products
      const allCountries = new Set()
      products.forEach(product => {
        product.coverage.forEach(code => {
          const countryName = getCountryName(code)
          if (countryName.toLowerCase().includes(input.toLowerCase())) {
            allCountries.add(countryName)
          }
        })
      })

      setSearchSuggestions(Array.from(allCountries).slice(0, 5))
    } else {
      setSearchSuggestions([])
    }
  }

  // Debounced filter update
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({...prev, searchTerm: searchInput}))
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput])

  const handlePurchase = async (product) => {
    try {
      // Navigate to checkout with product details
      navigate('/checkout', { state: { product } })
    } catch (error) {
      console.error('Purchase error:', error)
      setError('Failed to process purchase')
    }
  }

  // Toggle coverage collapse
  const toggleCoverage = (productId) => {
    setCollapsedCoverage(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  // When products are loaded, add their IDs to collapsed set
  useEffect(() => {
    if (products.length > 0) {
      setCollapsedCoverage(prev => {
        const newSet = new Set(prev)
        products.forEach(product => newSet.add(product.id))
        return newSet
      })
    }
  }, [products])

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Global eSIM Plans</h1>
        <p>Stay connected worldwide with our flexible data plans.</p>
      </div>

      <div className="filters-and-search">
        {/* Search bar */}
        <div className="search-section">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Type a country name..."
              value={searchInput}
              onChange={e => handleSearch(e.target.value)}
            />
            {searchInput && (
              <FiX 
                className="clear-icon"
                onClick={() => {
                  setSearchInput('')
                  setSearchSuggestions([])
                  setFilters(prev => ({...prev, searchTerm: ''}))
                }}
              />
            )}
          </div>
          {searchSuggestions.length > 0 && (
            <div className="search-suggestions">
              {searchSuggestions.map((country, idx) => (
                <div
                  key={idx}
                  className="suggestion-item"
                  onClick={() => {
                    setSearchInput(country)
                    setFilters(prev => ({...prev, searchTerm: country}))
                    setSearchSuggestions([])
                  }}
                >
                  {country}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Always visible filters */}
        <div className="filters-section">
          {/* Single row with all filters */}
          <div className="filter-row">
            <div className="filter-group">
              <h3>Duration</h3>
              <div className="filter-options">
                {[
                  {value: 'all', label: 'All'},
                  {value: 'daily', label: '1 Day'},
                  {value: 'weekly', label: '7 Days'},
                  {value: 'monthly', label: '30 Days'},
                  {value: 'yearly', label: '365 Days'}
                ].map(({value, label}) => (
                  <button
                    key={value}
                    className={`filter-chip ${filters.duration === value ? 'active' : ''}`}
                    onClick={() => setFilters(prev => ({...prev, duration: value}))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3>Data Amount</h3>
              <div className="range-slider">
                <input
                  type="range"
                  min={ranges.data.min}
                  max={ranges.data.max}
                  step={0.5}
                  value={filters.maxData}
                  onChange={e => {
                    const target = e.target
                    const progress = ((target.value - target.min) / (target.max - target.min)) * 100
                    target.style.setProperty('--range-progress', `${progress}%`)
                    setFilters(prev => ({
                      ...prev,
                      maxData: Number(target.value)
                    }))
                  }}
                  style={{ '--range-progress': `${((filters.maxData - ranges.data.min) / (ranges.data.max - ranges.data.min)) * 100}%` }}
                />
                <div className="range-labels">
                  <span>{ranges.data.min} GB</span>
                  <span>{filters.maxData} GB</span>
                </div>
              </div>
            </div>

            <div className="filter-group">
              <h3>Price Range</h3>
              <div className="range-slider">
                <input
                  type="range"
                  min={ranges.price.min}
                  max={ranges.price.max}
                  step={0.5}
                  value={filters.maxPrice}
                  onChange={e => {
                    const target = e.target
                    const progress = ((target.value - target.min) / (target.max - target.min)) * 100
                    target.style.setProperty('--range-progress', `${progress}%`)
                    setFilters(prev => ({
                      ...prev,
                      maxPrice: Number(target.value)
                    }))
                  }}
                  style={{ '--range-progress': `${((filters.maxPrice - ranges.price.min) / (ranges.price.max - ranges.price.min)) * 100}%` }}
                />
                <div className="range-labels">
                  <span>{formatPrice(ranges.price.min)}</span>
                  <span>{formatPrice(filters.maxPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="loading">Loading plans...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : !initialized ? (
        <div className="no-results">
          Start typing to search plans...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="no-results">
          No plans found matching your criteria
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const { displayName, region, formattedName } = formatPlanName(product.name)
            
            return (
              <div key={product.id} className="product-card">
                <div className="card-header">
                  <div className="plan-title">
                    <span className="plan-region">{region}</span>
                    <h3>{formattedName}</h3>
                  </div>
                  <span className="price">{formatPrice(product.price)}</span>
                </div>
                
                <div className="plan-specs">
                  <div className="data-badge">
                    {product.data} GB
                  </div>
                  <div className="duration-badge">
                    {product.duration} {product.durationUnit}s
                  </div>
                  {product.smsSupported && (
                    <div className="feature-badge">SMS</div>
                  )}
                </div>

                <div className="plan-details">
                  <div className="detail-item">
                    <span className="label">Speed</span>
                    <span className="value">{product.speed}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Validity</span>
                    <span className="value">{product.validity} days</span>
                  </div>
                </div>

                <div className="coverage-section">
                  <div 
                    className="coverage-header"
                    onClick={() => toggleCoverage(product.id)}
                  >
                    <div className="coverage-title">
                      <span>Coverage</span>
                      <span className="coverage-count">
                        {product.coverage.length} countries
                      </span>
                    </div>
                    <button className="collapse-button">
                      {collapsedCoverage.has(product.id) ? (
                        <FiChevronDown />
                      ) : (
                        <FiChevronUp />
                      )}
                    </button>
                  </div>
                  <div className={`coverage-list ${
                    collapsedCoverage.has(product.id) ? 'collapsed' : ''
                  }`}>
                    {product.coverage.map((code, idx) => (
                      <span 
                        key={idx}
                        className={`country-tag ${
                          filters.searchTerm && 
                          getCountryName(code).toLowerCase().includes(filters.searchTerm.toLowerCase())
                            ? 'highlighted'
                            : ''
                        }`}
                      >
                        {getCountryName(code)}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => handlePurchase(product)}
                  className="select-plan-btn"
                >
                  Select Plan
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Products