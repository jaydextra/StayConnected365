// Parse the CSV data into a structured format
export const plans = [
  {
    type: 'Single',
    region: 'Argentina',
    name: 'Argentina 1GB/Day',
    price: 3.40,
    code: 'AR',
    data: 1,
    validity: 1,
    slug: 'AR_1_Daily',
    coverage: ['AR'],
    id: 'P0VDPD9F2',
    billingStart: 'First Network Connection',
    preInstallDays: 30,
    speed: '3G/4G/5G',
    topupType: 'Non-reloadable',
    breakoutIp: 'UK/NO'
  },
  // Add all other plans from CSV...
]

// Get unique regions from plans
export const regions = [...new Set(plans.map(plan => plan.region))]

// Helper functions for filtering and sorting
export const filterPlans = (plans, filters) => {
  return plans.filter(plan => {
    if (filters.region && filters.region !== 'all') {
      if (plan.region !== filters.region) return false
    }
    if (filters.type && filters.type !== 'all') {
      if (plan.type !== filters.type) return false
    }
    if (filters.minData && plan.data < filters.minData) return false
    if (filters.maxData && plan.data > filters.maxData) return false
    if (filters.minPrice && plan.price < filters.minPrice) return false
    if (filters.maxPrice && plan.price > filters.maxPrice) return false
    if (filters.validity && plan.validity !== filters.validity) return false
    return true
  })
}

export const sortPlans = (plans, sortBy) => {
  return [...plans].sort((a, b) => {
    switch(sortBy) {
      case 'price':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price  
      case 'data':
        return b.data - a.data
      case 'data-asc':
        return a.data - b.data
      case 'validity':
        return b.validity - a.validity
      case 'validity-asc':
        return a.validity - b.validity
      default:
        return 0
    }
  })
}

// Helper to get price ranges
export const getPriceRange = (plans) => {
  const prices = plans.map(p => p.price)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  }
}

// Helper to get data ranges
export const getDataRange = (plans) => {
  const data = plans.map(p => p.data)
  return {
    min: Math.min(...data),
    max: Math.max(...data)
  }
}

// Import the CSV data for reference
export const planReference = {
  regions: {
    'Global': ['!GL'],
    'North America': ['US', 'CA', 'MX'],
    'East Asia': ['JP', 'KR', 'CN', 'HK', 'TW'],
    'Southeast Asia': ['TH', 'VN', 'MY', 'SG', 'ID', 'PH'],
    'Europe': ['GB', 'FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'CH'],
    // Add other regions...
  },
  
  // Helper to get region from country codes
  getRegion(countryCodes) {
    if (countryCodes === '!GL') return 'Global'
    const codes = countryCodes.split(',')
    
    for (const [region, regionCodes] of Object.entries(this.regions)) {
      if (codes.some(code => regionCodes.includes(code))) {
        return region
      }
    }
    return 'Other'
  },

  // Helper to get proper name for a country code
  getCountryName(code) {
    const names = {
      'US': 'United States',
      'GB': 'United Kingdom',
      'CN': 'China',
      // Add all country names from CSV...
    }
    return names[code] || code
  }
} 