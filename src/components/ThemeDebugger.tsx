import { useState, useEffect } from 'react'

export const ThemeDebugger = () => {
  const [themeState, setThemeState] = useState({
    currentHour: 0,
    gradientPrimary: '',
    gradientSecondary: '',
    gradientOpacity: '',
    backgroundOpacity: ''
  })

  useEffect(() => {
    const updateDebugInfo = () => {
      const root = document.documentElement
      setThemeState({
        currentHour: new Date().getHours(),
        gradientPrimary: root.style.getPropertyValue('--gradient-primary'),
        gradientSecondary: root.style.getPropertyValue('--gradient-secondary'),
        gradientOpacity: root.style.getPropertyValue('--gradient-opacity'),
        backgroundOpacity: root.style.getPropertyValue('--background-opacity')
      })
    }

    updateDebugInfo()
    const interval = setInterval(updateDebugInfo, 1000)
    return () => clearInterval(interval)
  }, [])

  if (process.env.NODE_ENV === 'production') return null

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '1rem',
        borderRadius: '0.5rem',
        fontSize: '0.8rem',
        zIndex: 9999
      }}
    >
      <h4 style={{ margin: '0 0 0.5rem' }}>Theme Debug</h4>
      <pre style={{ margin: 0 }}>
        {JSON.stringify(themeState, null, 2)}
      </pre>
    </div>
  )
} 