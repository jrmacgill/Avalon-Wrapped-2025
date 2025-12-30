export async function loadStats() {
  try {
    // In production, account for the base path
    const basePath = import.meta.env.BASE_URL || '/'
    console.log('BASE_URL:', basePath)
    console.log('DEV:', import.meta.env.DEV)
    console.log('PROD:', import.meta.env.PROD)

    const statsPath = `${basePath}data/stats.json`.replace(/\/+/g, '/')
    console.log('Loading stats from:', statsPath)
    console.log('Full URL would be:', window.location.origin + statsPath)

    const response = await fetch(statsPath)
    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)

    if (!response.ok) {
      throw new Error(`Failed to load stats.json from ${statsPath} (status: ${response.status})`)
    }
    const data = await response.json()
    console.log('Stats loaded successfully!')
    return data
  } catch (error) {
    console.error('Error loading stats:', error)
    throw error
  }
}


