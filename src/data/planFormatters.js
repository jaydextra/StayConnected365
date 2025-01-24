// Helper functions to format plan names and details
export const formatPlanName = (name) => {
  if (!name) return { region: '', formattedName: '', displayName: '' }

  try {
    const parts = name.split(' ')
    
    // Extract the region (everything before the data amount)
    const dataPartIndex = parts.findIndex(part => part.match(/\d+[GMK]B/i))
    if (dataPartIndex === -1) return { region: 'Global', formattedName: name, displayName: name }
    
    const region = parts.slice(0, dataPartIndex).join(' ')
    const dataAmount = parts[dataPartIndex]
    const planType = parts[dataPartIndex + 2]

    // Format the data amount
    const formattedData = formatDataAmount(dataAmount)
    
    return {
      region: region || 'Global',
      formattedName: formattedData, // Just show the data amount
      displayName: `${region} ${formattedData}${planType ? ` (${planType})` : ''}`,
      planType: planType || 'Standard'
    }
  } catch (error) {
    console.warn('Error formatting plan name:', name, error)
    return {
      region: 'Global',
      formattedName: name,
      displayName: name,
      planType: 'Standard'
    }
  }
}

export const formatDuration = (duration) => {
  if (!duration) return ''
  
  // Handle formats like "7Days", "30Days", etc.
  const match = duration.match(/(\d+)(\w+)/)
  if (match) {
    const [_, number, unit] = match
    const formattedUnit = unit.toLowerCase().replace(/s$/, '')
    return `${number} ${formattedUnit}${number > 1 ? 's' : ''}`
  }
  return duration
}

export const formatDataAmount = (amount) => {
  if (!amount) return '0 MB'

  try {
    // Convert "500MB" to "500 MB" or "1GB" to "1 GB"
    const match = amount.match(/(\d+)(\w+)/)
    if (match) {
      const [_, number, unit] = match
      return `${number} ${unit}`
    }
    return amount
  } catch (error) {
    console.warn('Error formatting data amount:', amount, error)
    return amount
  }
}

export const formatPrice = (price) => {
  if (typeof price !== 'number') return '$0.00'
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(price)
} 