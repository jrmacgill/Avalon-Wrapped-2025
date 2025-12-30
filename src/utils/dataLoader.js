export async function loadStats() {
  try {
    const response = await fetch('/data/stats.json')
    if (!response.ok) {
      throw new Error('Failed to load stats.json')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error loading stats:', error)
    throw error
  }
}


