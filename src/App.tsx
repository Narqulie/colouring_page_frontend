// Import necessary dependencies from React
import { useState, useEffect } from 'react' // Allows us to use state in our component
import { PromptForm } from './components/promptForm' // Import our custom form component
import { ImageGallery } from './components/imageGallery' // Import our custom image gallery component
import './App.css' // Import styles for this component

// Define TypeScript interfaces for our data structures
interface Image {
  filename: string
  date: string
  url: string
  prompt?: string // Optional as it's not in your API response
}

// Main App component - the root component of our application
function App() {
  // State declarations using React's useState hook
  // Each useState creates a variable and a function to update it
  
  // Track loading state (true when processing, false when idle)
  const [isLoading, setIsLoading] = useState(false)
  
  // Store the generated image URL/data
  // null when no image exists, string when we have an image
  const [image, setImage] = useState<string | null>(null)
  
  // Store any error messages
  // null when no errors, string when we have an error message
  const [error, setError] = useState<string | null>(null)
  
  // Update image state to handle multiple images
  const [images, setImages] = useState<Image[]>([])
  
  // Add state for the currently selected/generated image
  const [currentImage, setCurrentImage] = useState<string | null>(null)

  // Fetch images when component mounts
  useEffect(() => {
    fetchImages()
  }, [])

  // Function to fetch images from the API
  const fetchImages = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/images')
      const data = await response.json()
      setImages(data.images)
    } catch (err) {
      setError('Failed to load images from gallery')
      console.error('Error fetching images:', err)
    }
  }

  // Updated handler for prompt submission
  const handlePromptSubmit = async (prompt: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('prompt', prompt)

      const response = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()
      setCurrentImage(data.url)
      await fetchImages()
      
    } catch (err) {
      setError('Failed generating the image. Please try again.')
      console.error('Error generating image:', err)
      
      // Automatically clear error after 10 seconds
      setTimeout(() => {
        setError(null)
      }, 10000)
      
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (image: Image) => {
    try {
      const response = await fetch(`http://localhost:8000/api/images/${image.filename}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete image')
      }
      
      // Refresh the images list after successful deletion
      await fetchImages()
      
    } catch (err) {
      setError('Failed to delete image')
      console.error('Error deleting image:', err)
      throw err
    }
  }

  // The JSX that gets rendered to the page
  return (
    // Main container with 'app' class for styling
    <div className="app">
      {/* Page title */}
      <h1>AI Coloring Page Generator</h1>
      
      {/* Custom form component that takes our handler and loading state */}
      <PromptForm onSubmit={handlePromptSubmit} isLoading={isLoading} />
      
      {/* Conditional rendering: Only show error div if there's an error */}
      {error && <div className="error-message">{error}</div>}
      

      
      <ImageGallery 
        images={images.map(img => ({
          id: img.filename,
          url: `http://localhost:8000${img.url}`,
          prompt: img.prompt || '',
          filename: img.filename,
          timestamp: new Date(img.date).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
        }))} 
        onImageSelect={(image) => setCurrentImage(image.url)}
        onReroll={handlePromptSubmit}
        onDelete={handleDelete}
      />
    </div>
  )
}

// Export the App component so it can be imported elsewhere
export default App
