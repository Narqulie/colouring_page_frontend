interface GradientColors {
  primary: string
  secondary: string
  gradientOpacity: number
  backgroundOpacity: number
}

const DEBUG_HOUR: number | null = null  // Set to a number 0-23 to test specific times

const updateGradientsByTime = (): void => {
  const hour = DEBUG_HOUR !== null ? DEBUG_HOUR : new Date().getHours()
  const root = document.documentElement

  const setThemeColors = (colors: GradientColors) => {
    console.log(`[Theme Debug] Updating colors at ${hour}:00`)
    console.log('[Theme Debug] New colors:', colors)
    
    root.style.setProperty('--gradient-primary', colors.primary)
    root.style.setProperty('--gradient-secondary', colors.secondary)
    root.style.setProperty('--gradient-opacity', colors.gradientOpacity.toString())
    root.style.setProperty('--background-opacity', colors.backgroundOpacity.toString())
    
    // Verify the values were set correctly
    console.log('[Theme Debug] Current CSS Variables:', {
      primary: root.style.getPropertyValue('--gradient-primary'),
      secondary: root.style.getPropertyValue('--gradient-secondary'),
      gradientOpacity: root.style.getPropertyValue('--gradient-opacity'),
      backgroundOpacity: root.style.getPropertyValue('--background-opacity')
    })
  }

  // Early morning (5-8)
  if (hour >= 5 && hour < 8) {
    setThemeColors({
      primary: '173, 216, 230',    // Light blue
      secondary: '255, 218, 185',  // Peach
      gradientOpacity: 0.8,
      backgroundOpacity: 0.6
    })
  }
  // Morning (8-11)
  else if (hour >= 8 && hour < 11) {
    setThemeColors({
      primary: '255, 179, 64',     // Warm orange
      secondary: '195, 226, 204',  // Soft green
      gradientOpacity: 1,
      backgroundOpacity: 0.5
    })
  }
  // Midday (11-15)
  else if (hour >= 11 && hour < 15) {
    setThemeColors({
      primary: '255, 223, 186',    // Light orange
      secondary: '173, 216, 230',  // Light blue
      gradientOpacity: 1,
      backgroundOpacity: 0.4
    })
  }
  // Afternoon (15-18)
  else if (hour >= 15 && hour < 18) {
    setThemeColors({
      primary: '221, 160, 221',    // Plum
      secondary: '176, 196, 222',  // Light steel blue
      gradientOpacity: 0.9,
      backgroundOpacity: 0.5
    })
  }
  // Evening (18-21)
  else if (hour >= 18 && hour < 21) {
    setThemeColors({
      primary: '233, 150, 122',    // Dark salmon
      secondary: '147, 112, 219',  // Medium purple
      gradientOpacity: 0.8,
      backgroundOpacity: 0.4
    })
  }
  // Night (21-5)
  else {
    setThemeColors({
      primary: '70, 130, 180',     // Steel blue
      secondary: '72, 61, 139',    // Dark slate blue
      gradientOpacity: 0.7,
      backgroundOpacity: 0.3
    })
  }
}

export const initializeTimeBasedTheme = (): void => {
  updateGradientsByTime();
  
  // Calculate time until next hour
  const now = new Date();
  const minutesToNext = 60 - now.getMinutes();
  const msToNext = minutesToNext * 60 * 1000;
  
  // Initial timeout to sync with hour changes
  setTimeout(() => {
    updateGradientsByTime();
    // Then update hourly
    setInterval(updateGradientsByTime, 3600000);
  }, msToNext);
} 