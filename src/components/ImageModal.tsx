import { ImageItem } from './imageGallery'
import { translations } from '../translations'

interface ImageModalProps {
  image: ImageItem | null
  onClose: () => void
  onDelete?: (image: ImageItem) => Promise<void>
  onReroll?: (prompt: string) => void
  language?: 'en' | 'fi'
}

export function ImageModal({
  image,
  onClose,
  onDelete,
  onReroll,
  language = 'en'
}: ImageModalProps) {
  if (!image) return null

  console.log('ImageModal props:', {
    hasOnReroll: !!onReroll,
    prompt: image.prompt,
  })

  const handleSave = () => {
    try {
      // Use prompt as filename, sanitize it and limit length
      const sanitizedPrompt = image.prompt
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase()
        .slice(0, 50)
      const fileName = `${sanitizedPrompt}.png`

      const fullUrl = image.url.startsWith('http')
        ? image.url
        : `http://localhost:8000${image.url}`

      const link = document.createElement('a')
      link.href = fullUrl
      link.download = fileName
      link.style.display = 'none'

      // Add to document, click, and remove
      document.body.appendChild(link)
      link.click()

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link)
      }, 100)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Ensure full URL for the image
    const fullUrl = image.url.startsWith('http') 
      ? image.url 
      : `${import.meta.env.VITE_API_URL}${image.url}`;

    // Write the print content
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${image.prompt}</title>
          <style>
            @media print {
              @page {
                size: auto;
                margin: 0mm;
              }
              body { 
                margin: 0; 
                padding: 0; 
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
              }
              img { 
                width: 100%;
                height: auto;
                max-height: 100vh;
                object-fit: contain;
                page-break-inside: avoid;
              }
              .watermark {
                position: fixed;
                bottom: 10px;
                right: 10px;
                font-size: 12px;
                color: #999;
                opacity: 0.7;
              }
            }
          </style>
        </head>
        <body>
          <img 
            src="${fullUrl}" 
            alt="${image.prompt}"
            onload="setTimeout(function() { window.print(); window.close(); }, 250);"
          />
          <div class="watermark">${image.prompt} - ColouringPageGenerator</div>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  const handleReroll = () => {
    if (!image?.prompt || !onReroll) return
    onReroll(image.prompt)
    onClose()
  }

  const handleDelete = async () => {
    if (!image || !onDelete) return

    if (window.confirm(translations[language].confirmDelete)) {
      try {
        await onDelete(image)
        onClose()
      } catch (error) {
        console.error('Error deleting image:', error)
      }
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: '90vh',  // Limit height to 90% of viewport
          overflowY: 'auto',  // Enable vertical scrolling
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        <img 
          src={image.url} 
          alt={image.prompt} 
          className="modal-image" 
          style={{ maxHeight: '70vh', objectFit: 'contain' }}  // Limit image height
        />
        <div className="modal-details" style={{ flexShrink: 0 }}>  {/* Prevent shrinking */}
          {image.timestamp && (
            <p className="modal-timestamp">{image.timestamp}</p>
          )}
          <p className="modal-prompt">{image.prompt}</p>
          <div className="modal-actions">
            <button className="modal-button" onClick={handleSave} type="button">
              {translations[language].saveImage}
            </button>
            <button
              className="modal-button"
              onClick={handlePrint}
              type="button"
            >
              {translations[language].print}
            </button>
            {onReroll && (
              <button
                className="modal-button"
                onClick={handleReroll}
                type="button"
              >
                {translations[language].reroll}
              </button>
            )}
            {onDelete && (
              <button
                className="modal-button modal-button-delete"
                onClick={handleDelete}
                type="button"
              >
                {translations[language].delete}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
