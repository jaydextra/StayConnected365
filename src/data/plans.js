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
    'South America': ['AR', 'BR', 'CL', 'CO', 'PE', 'UY', 'EC', 'PY', 'BO'],
    'Central America': ['CR', 'PA', 'HN', 'GT', 'SV', 'NI', 'BZ'],
    'Caribbean': ['DO', 'PR', 'JM', 'BS', 'BB', 'TT', 'HT', 'CU'],
    'East Asia': ['JP', 'KR', 'CN', 'HK', 'TW', 'MO'],
    'Southeast Asia': ['TH', 'VN', 'MY', 'SG', 'ID', 'PH', 'KH', 'LA', 'MM', 'BN'],
    'South Asia': ['IN', 'PK', 'BD', 'LK', 'NP', 'BT', 'MV'],
    'Europe': ['GB', 'FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'PT', 'IE', 'DK', 'NO', 'SE', 'FI', 'IS'],
    'Eastern Europe': ['RU', 'UA', 'PL', 'RO', 'CZ', 'HU', 'BG', 'SK', 'HR', 'RS', 'EE', 'LV', 'LT'],
    'Middle East': ['TR', 'IL', 'SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'JO', 'LB', 'IQ', 'IR'],
    'Africa': ['EG', 'ZA', 'MA', 'NG', 'KE', 'TN', 'GH', 'SN', 'CI', 'CM', 'UG', 'TZ'],
    'Oceania': ['AU', 'NZ', 'FJ', 'PG', 'SB', 'VU', 'NC', 'WS']
  },
  
  // Helper to get region from country codes
  getRegion(countryCodes) {
    if (!countryCodes) return 'Unknown';
    if (countryCodes === '!GL') return 'Global';
    if (countryCodes === '!RG') return 'Regional';
    
    const codes = countryCodes.split(',');
    
    // Check if codes match any specific region
    for (const [region, regionCodes] of Object.entries(this.regions)) {
      if (codes.some(code => regionCodes.includes(code))) {
        // If all codes are from the same region, return that region
        if (codes.every(code => regionCodes.includes(code))) {
          return region;
        }
        // If codes span multiple regions, check for common groupings
        if (region === 'North America' && codes.every(code => ['US', 'CA', 'MX'].includes(code))) {
          return 'North America';
        }
        if (region === 'East Asia' && codes.every(code => ['JP', 'KR', 'CN', 'HK', 'TW'].includes(code))) {
          return 'East Asia';
        }
      }
    }
    
    // If codes span multiple regions
    if (codes.length > 1) {
      return 'Multi-Region';
    }
    
    return 'Other';
  },

  // Helper to get proper name for a country code
  getCountryName(code) {
    const names = {
      '!GL': 'Global',
      '!RG': 'Regional',
      'US': 'United States',
      'CA': 'Canada',
      'MX': 'Mexico',
      'GB': 'United Kingdom',
      'FR': 'France',
      'DE': 'Germany',
      'IT': 'Italy',
      'ES': 'Spain',
      'JP': 'Japan',
      'KR': 'South Korea',
      'CN': 'China',
      'HK': 'Hong Kong',
      'TW': 'Taiwan',
      'SG': 'Singapore',
      'MY': 'Malaysia',
      'TH': 'Thailand',
      'VN': 'Vietnam',
      'ID': 'Indonesia',
      'PH': 'Philippines',
      'IN': 'India',
      'AU': 'Australia',
      'NZ': 'New Zealand',
      'BR': 'Brazil',
      'AR': 'Argentina',
      'CL': 'Chile',
      'AE': 'United Arab Emirates',
      'SA': 'Saudi Arabia',
      'TR': 'Turkey',
      'RU': 'Russia',
      'ZA': 'South Africa',
      // Add more country codes and names as needed
    };
    return names[code] || code;
  }
}; 