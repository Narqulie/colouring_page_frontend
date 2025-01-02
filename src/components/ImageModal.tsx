import { ImageItem } from './imageGallery'

interface ImageModalProps {
  image: ImageItem | null
  onClose: () => void
  onDelete?: (image: ImageItem) => void
  onReroll?: (prompt: string) => void
}

export function ImageModal({ image, onClose, onDelete, onReroll }: ImageModalProps) {
  if (!image) return null

  console.log('ImageModal props:', { 
    hasOnReroll: !!onReroll, 
    prompt: image.prompt 
  })

  const handleSave = () => {
    try {
      // Get the filename and ensure full URL
      const fileName = image.filename || 'image.png'
      const fullUrl = image.url.startsWith('http') 
        ? image.url 
        : `http://localhost:8000${image.url}`

      // Create a simple anchor element
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
    // Create a hidden iframe
    const printFrame = document.createElement('iframe')
    printFrame.style.position = 'fixed'
    printFrame.style.right = '0'
    printFrame.style.bottom = '0'
    printFrame.style.width = '0'
    printFrame.style.height = '0'
    printFrame.style.border = 'none'

    // Append iframe to document
    document.body.appendChild(printFrame)

    // Ensure we have access to the iframe's document
    const frameDoc = printFrame.contentWindow?.document
    if (!frameDoc) return

    // Write the print content
    frameDoc.open()
    frameDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            @media print {
              body { margin: 0; padding: 20px; }
              img { 
                max-width: 100%; 
                height: auto; 
                display: block; 
                margin: 0 auto;
              }
              .print-details { 
                margin-top: 20px; 
                font-family: Arial, sans-serif; 
                text-align: left;
              }
            }
          </style>
        </head>
        <body>
          <img src="${image.url}" alt="${image.prompt}" />
          <div class="print-details">
            ${image.filename ? `<p>Filename: ${image.filename}</p>` : ''}
            ${image.timestamp ? `<p>Date: ${image.timestamp}</p>` : ''}
            <p>Prompt: ${image.prompt}</p>
          </div>
          <script>
            // Wait for all content to load
            window.onload = function() {
              setTimeout(() => {
                window.print();
                setTimeout(() => {
                  document.body.parentNode.removeChild(document.body);
                }, 100);
              }, 500);
            };
          </script>
        </body>
      </html>
    `)
    frameDoc.close()

    // Remove the iframe after printing
    printFrame.onload = () => {
      setTimeout(() => {
        document.body.removeChild(printFrame)
      }, 2000)
    }
  }

  const handleReroll = () => {
    if (!image?.prompt || !onReroll) return
    onReroll(image.prompt)
    onClose()
  }

  const handleDelete = async () => {
    if (!image || !onDelete) return
    
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await onDelete(image)
        onClose() // Close modal after successful deletion
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close" 
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        <img src={image.url} alt={image.prompt} className="modal-image" />
        <div className="modal-details">
          {image.filename && <p className="modal-filename">{image.filename}</p>}
          {image.timestamp && (
            <p className="modal-timestamp">{image.timestamp}</p>
          )}
          <p className="modal-prompt">{image.prompt}</p>
          <div className="modal-actions">
            <button className="modal-button" onClick={handleSave} type="button">
              Save Image
            </button>
            <button
              className="modal-button"
              onClick={handlePrint}
              type="button"
            >
              Print Image
            </button>
            {onReroll && (
              <button
                className="modal-button"
                onClick={handleReroll}
                type="button"
              >
                Re-roll Image
              </button>
            )}
            {onDelete && (
              <button 
                className="modal-button modal-button-delete" 
                onClick={handleDelete} 
                type="button"
              >
                Delete Image
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
