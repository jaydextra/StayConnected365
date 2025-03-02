import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { esimApi } from '../config/api'
import './Products.css'
import { FiSearch, FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { countryNames, getCountryName } from '../data/countryNames'
import { formatPlanName, formatPrice, formatDataAmount, formatDuration } from '../data/planFormatters'

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

  // Add region search state
  const [regionSearch, setRegionSearch] = useState('')

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
    if (loading || initialized) return
    setLoading(true)
    try {
      console.log('Making API request...');
      
      // Make multiple requests for different types of plans
      const requests = [
        // Global plans
        fetch('https://us-central1-stayconnected365-73277.cloudfunctions.net/packageList', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'BASE', locationCode: '!GL' })
        }),
        // Regional plans
        fetch('https://us-central1-stayconnected365-73277.cloudfunctions.net/packageList', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'BASE', locationCode: '!RG' })
        }),
        // Some specific regions (example)
        fetch('https://us-central1-stayconnected365-73277.cloudfunctions.net/packageList', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'BASE', locationCode: 'US' })
        })
      ];

      const responses = await Promise.all(requests);
      const jsonResponses = await Promise.all(responses.map(r => r.json()));
      
      // Use a Map to deduplicate packages by packageCode
      const packagesMap = new Map();
      jsonResponses.forEach(response => {
        if (response.success && response.obj?.packageList) {
          response.obj.packageList.forEach(pkg => {
            if (pkg.packageCode) {
              packagesMap.set(pkg.packageCode, pkg);
            }
          });
        }
      });

      // Convert Map back to array
      const allPackages = Array.from(packagesMap.values());

      console.log('Combined packages:', {
        total: allPackages.length,
        types: allPackages.map(p => p.name.split(' ')[0]).filter((v, i, a) => a.indexOf(v) === i)
      });

      // Transform the API response into the format your component expects
      const formattedProducts = allPackages.map(pkg => {
        if (!pkg) return null;
        
        try {
          // Extract duration from package name
          let duration = null;
          
          // Check for specific duration patterns in name
          if (pkg.name.toLowerCase().includes('/day')) {
            duration = 1;
          } else if (pkg.name.match(/\b1\s*day\b/i)) {
            duration = 1;
          } else if (pkg.name.match(/\b7\s*days?\b/i)) {
            duration = 7;
          } else if (pkg.name.match(/\b30\s*days?\b/i)) {
            duration = 30;
          } else if (pkg.name.match(/\b365\s*days?\b/i)) {
            duration = 365;
          } else if (pkg.name.match(/\b15\s*days?\b/i)) {
            duration = 15;
          } else if (pkg.name.match(/\b180\s*days?\b/i)) {
            duration = 180;
          } else if (pkg.name.match(/\b90\s*days?\b/i)) {
            duration = 90;
          } else {
            // Try to extract any number followed by "days"
            const durationMatch = pkg.name.match(/(\d+)\s*days?/i);
            if (durationMatch) {
              duration = parseInt(durationMatch[1]);
            }
          }

          // If no duration found in name, use API value
          duration = duration || pkg.unusedValidTime || 30;

          return {
            id: pkg.packageCode || '',
            name: pkg.name || 'Unnamed Package',
            price: (typeof pkg.price === 'number' ? pkg.price : 0) / 100000,
            data: (typeof pkg.volume === 'number' ? pkg.volume : 0) / (1024 * 1024 * 1024),
            duration: duration,
            validity: duration,
            speed: pkg.speed || '4G',
            smsSupported: pkg.smsStatus === 1,
            coverage: Array.isArray(pkg.locationNetworkList) 
              ? pkg.locationNetworkList.map(loc => loc.locationCode || '').filter(Boolean)
              : [],
            networks: Array.isArray(pkg.locationNetworkList)
              ? pkg.locationNetworkList.map(loc => ({
                  country: loc.locationName || '',
                  operators: Array.isArray(loc.operatorList) ? loc.operatorList : []
                }))
              : []
          };
        } catch (e) {
          console.error('Error processing package:', e, pkg);
          return null;
        }
      }).filter(Boolean); // Remove any null entries

      console.log('Formatted Products:', {
        count: formattedProducts.length,
        regions: [...new Set(formattedProducts.map(p => p.region))],
        firstFewProducts: formattedProducts.slice(0, 3)
      });

      if (formattedProducts.length === 0) {
        throw new Error('No valid products found in response');
      }

      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
      setLocations(groupLocationsByRegion(formattedProducts));
      setInitialized(true);
    } catch (err) {
      console.error('Error details:', err);
      setError(`Failed to fetch products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

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
    console.log('Initial products count:', filtered.length);

    // Search filter - check both country names and plan names/regions
    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(product => {
        // Check plan name and region
        const { displayName, region, coverage } = formatPlanName(product.name)
        if (displayName.toLowerCase().includes(search)) return true
        if (region.toLowerCase().includes(search)) return true
        if (coverage.toLowerCase().includes(search)) return true

        // Check coverage countries
        return product.coverage.some(code => {
          const countryName = getCountryName(code)
          return countryName.toLowerCase().includes(search)
        })
      })
      console.log('After search filter:', filtered.length);
    }

    // Data filter - handle both GB and MB values
    if (filters.minData > 0 || filters.maxData < ranges.data.max) {
      filtered = filtered.filter(product => {
        const dataInGB = product.data < 1 ? product.data : product.data
        return dataInGB >= filters.minData && dataInGB <= filters.maxData
      })
      console.log('After data filter:', filtered.length);
    }

    // Price filter - ensure we're comparing in the same currency unit
    if (filters.minPrice > 0 || filters.maxPrice < ranges.price.max) {
      filtered = filtered.filter(product => 
        product.price >= filters.minPrice && 
        product.price <= filters.maxPrice
      )
      console.log('After price filter:', filtered.length);
    }

    // Log duration values to debug
    if (filters.duration !== 'all') {
      console.log('Duration values:', filtered.map(p => ({
        name: p.name,
        validity: p.validity,
        duration: p.duration
      })));
    }

    // Duration filter
    if (filters.duration !== 'all') {
      filtered = filtered.filter(product => {
        const duration = product.duration;
        
        switch(filters.duration) {
          case '1 Day':
            return duration === 1 || product.name.toLowerCase().includes('/day');
          case '7 Days':
            return duration === 7 || (duration > 1 && duration <= 7);
          case '30 Days':
            return duration === 30 || (duration > 7 && duration <= 30);
          case '365 Days':
            return duration === 365 || duration > 180;
          default:
            return true;
        }
      });
      
      console.log('After duration filter:', {
        duration: filters.duration,
        count: filtered.length,
        plans: filtered.map(p => ({
          name: p.name,
          duration: p.duration,
          matched: true
        }))
      });
    }

    // Sort results
    filtered.sort((a, b) => {
      // First sort by region type (Global > Regional > Country)
      const { planType: typeA } = formatPlanName(a.name)
      const { planType: typeB } = formatPlanName(b.name)
      
      const typeOrder = { 'International': 0, 'Regional': 1, 'Country': 2, 'Other': 3 }
      if (typeOrder[typeA] !== typeOrder[typeB]) {
        return typeOrder[typeA] - typeOrder[typeB]
      }
      
      // Then sort by price
      return a.price - b.price
    })

    setFilteredProducts(filtered)
  }, [products, filters, ranges])

  // Update handleSearch to be more comprehensive
  const handleSearch = (input) => {
    setSearchInput(input)
    setRegionSearch(input)
    
    // Only load products if input looks like a region/country and we haven't loaded yet
    if (!initialized && input.length >= 2) {
      // Check if input matches any country names, regions, or plan types
      const matchesCountry = Object.values(countryNames).some(name => 
        name.toLowerCase().includes(input.toLowerCase())
      )
      
      const matchesRegion = [
        'global', 'europe', 'asia', 'north america', 'south america',
        'africa', 'middle east', 'caribbean', 'central america',
        'gulf states', 'united states', 'china', 'singapore'
      ].some(region => region.includes(input.toLowerCase()))
      
      if (matchesCountry || matchesRegion) {
        loadProducts()
      }
    }

    if (input.length > 1) {
      // Get suggestions from both countries and regions
      const countrySuggestions = Object.values(countryNames)
        .filter(name => name.toLowerCase().includes(input.toLowerCase()))
      
      const regionSuggestions = [
        'Global Coverage', 'Europe', 'Asia Pacific',
        'North America', 'South America', 'Africa',
        'Middle East', 'Caribbean', 'Central America',
        'Gulf States', 'United States', 'China', 'Singapore'
      ].filter(region => region.toLowerCase().includes(input.toLowerCase()))
      
      const allSuggestions = [...new Set([...regionSuggestions, ...countrySuggestions])]
      setSearchSuggestions(allSuggestions.slice(0, 5))
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
        <h1>eSIM Data Plans</h1>
        <p>Enter your destination to find available plans.</p>
      </div>

      <div className="filters-and-search">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Enter a country or region..."
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchInput && (
            <button 
              className="clear-search" 
              onClick={() => handleSearch('')}
            >
              <FiX />
            </button>
          )}
        </div>
        {searchSuggestions.length > 0 && (
          <div className="search-suggestions">
            {searchSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSearch(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}

        {/* Always visible filters */}
        <div className="filters-section">
          {/* Single row with all filters */}
          <div className="filter-row">
            <div className="filter-group">
              <h3>Duration</h3>
              <div className="filter-options">
                {[
                  {value: 'all', label: 'All'},
                  {value: '1 Day', label: '1 Day'},
                  {value: '7 Days', label: '7 Days'},
                  {value: '30 Days', label: '30 Days'},
                  {value: '365 Days', label: '365 Days'}
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
        <div className="no-results search-prompt">
          <FiSearch className="large-search-icon" />
          <h2>Where are you traveling?</h2>
          <p>Enter your destination to find the perfect eSIM plan.</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="no-results">
          No plans found for {regionSearch}
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const { displayName, region, formattedName, planType, coverage } = formatPlanName(product.name)
            
            return (
              <div key={product.id} className="product-card">
                <div className="card-header">
                  <div className="plan-title">
                    <span className={`plan-type ${planType.toLowerCase()}`}>{region}</span>
                    <h3>{displayName}</h3>
                  </div>
                  <span className="price">{formatPrice(product.price)}</span>
                </div>
                
                <div className="plan-specs">
                  <div className="data-badge">
                    {formatDataAmount(product.data)}
                  </div>
                  <div className="duration-badge">
                    {formatDuration(`${product.validity}Days`)}
                  </div>
                  {product.smsSupported && (
                    <div className="feature-badge">SMS Included</div>
                  )}
                </div>

                <div className="coverage-info">
                  <span className="coverage-label">Coverage:</span>
                  <span className="coverage-value">{coverage}</span>
                </div>

                <div className="plan-details">
                  <div className="detail-item">
                    <span className="label">Speed</span>
                    <span className="value">{product.speed}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Validity</span>
                    <span className="value">{formatDuration(`${product.validity}Days`)}</span>
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