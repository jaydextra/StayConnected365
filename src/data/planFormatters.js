// Helper functions to format plan names and details
export const formatPlanName = (name) => {
  if (!name) return { region: '', formattedName: '', displayName: '' }

  try {
    // Extract the base plan type and region info
    let planType = ''
    let region = ''
    let displayName = ''
    let coverage = ''

    // Map plan types to proper display names and coverage info
    const planTypes = {
      'Global': {
        planType: 'International',
        region: 'Worldwide',
        displayName: 'Global eSIM',
        coverage: '130+ Countries'
      },
      'Europe': {
        planType: 'Regional',
        region: 'Europe',
        displayName: 'European Multi-Country',
        coverage: '30+ European Countries'
      },
      'Asia': {
        planType: 'Regional',
        region: 'Asia',
        displayName: 'Asia Pacific',
        coverage: '20+ Asian Countries'
      },
      'North': {
        planType: 'Regional',
        region: 'North America',
        displayName: 'North America',
        coverage: 'USA, Canada & Mexico'
      },
      'South': {
        planType: 'Regional',
        region: 'South America',
        displayName: 'South America',
        coverage: '15+ Countries in South America'
      },
      'Africa': {
        planType: 'Regional',
        region: 'Africa',
        displayName: 'Africa Multi-Country',
        coverage: '25+ African Nations'
      },
      'Middle': {
        planType: 'Regional',
        region: 'Middle East',
        displayName: 'Middle East',
        coverage: '10+ Middle Eastern Countries'
      },
      'Caribbean': {
        planType: 'Regional',
        region: 'Caribbean',
        displayName: 'Caribbean Islands',
        coverage: '25+ Caribbean Destinations'
      },
      'Central': {
        planType: 'Regional',
        region: 'Central America',
        displayName: 'Central America',
        coverage: '5 Central American Countries'
      },
      'Gulf': {
        planType: 'Regional',
        region: 'Gulf States',
        displayName: 'Gulf Cooperation Council',
        coverage: '6 GCC Member States'
      },
      'United': {
        planType: 'Country',
        region: 'United States',
        displayName: 'United States',
        coverage: 'Nationwide US Coverage'
      },
      'China': {
        planType: 'Country',
        region: 'China',
        displayName: 'China',
        coverage: 'Mainland China Coverage'
      },
      'Singapore': {
        planType: 'Country',
        region: 'Singapore',
        displayName: 'Singapore',
        coverage: 'Singapore Coverage'
      }
    }

    // Find matching plan type
    const planKey = Object.keys(planTypes).find(key => name.startsWith(key))
    if (planKey) {
      const plan = planTypes[planKey]
      planType = plan.planType
      region = plan.region
      displayName = plan.displayName
      coverage = plan.coverage
    } else {
      planType = 'Other'
      region = 'Unknown'
      displayName = name
      coverage = 'Coverage details unavailable'
    }

    // Extract data amount for the formatted name
    const dataMatch = name.match(/(\d+(?:\.\d+)?)\s*(?:GB|MB)/i)
    const data = dataMatch ? dataMatch[1] + ' GB' : ''

    return {
      planType,
      region,
      displayName,
      formattedName: data,
      coverage
    }
  } catch (error) {
    console.warn('Error formatting plan name:', name, error)
    return {
      planType: 'Other',
      region: 'Unknown',
      displayName: name,
      formattedName: name,
      coverage: 'Coverage details unavailable'
    }
  }
}

export const formatDuration = (duration) => {
  if (!duration) return '';
  
  // Handle formats like "7Days", "30Days", etc.
  const match = duration.match(/(\d+)(?:Days?)/i);
  if (match) {
    const days = parseInt(match[1]);
    if (days === 1) return '1 day';
    if (days === 7) return '1 week';
    if (days === 30) return '1 month';
    if (days === 365) return '1 year';
    return `${days} days`;
  }
  return duration;
};

export const formatDataAmount = (amount) => {
  if (!amount) return '0 MB';

  try {
    // If amount is already a string, try to parse it
    if (typeof amount === 'string') {
      const match = amount.match(/(\d+)([GMK]B)/i);
      if (match) {
        const [_, number, unit] = match;
        const formattedUnit = unit.toUpperCase();
        return `${number} ${formattedUnit}`;
      }
    }
    
    // Handle numeric values (in GB)
    const numAmount = Number(amount);
    if (isNaN(numAmount)) return '0 MB';
    
    if (numAmount >= 1) {
      return `${numAmount} GB`;
    } else {
      return `${numAmount * 1000} MB`;
    }
  } catch (error) {
    console.warn('Error formatting data amount:', amount, error);
    return `${amount} GB`;
  }
};

export const formatPrice = (price) => {
  if (typeof price !== 'number') return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}; 