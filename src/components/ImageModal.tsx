import { ImageItem } from './imageGallery'

interface ImageModalProps {
  image: ImageItem | null
  onClose: () => void
  onDelete?: (image: ImageItem) => void
  onReroll?: (prompt: string) => void
}

export function ImageModal({
  image,
  onClose,
  onDelete,
  onReroll,
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
              body { 
                margin: 0; 
                padding: 0; 
                position: relative;
              }
              img { 
                max-width: 100%; 
                height: auto; 
                display: block; 
                margin: 0 auto;
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
          <img src="${image.url}" alt="${image.prompt}" />
          <div class="watermark">${image.prompt} - ColouringPageGenerator</div>
          <script>
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
              Print
            </button>
            {onReroll && (
              <button
                className="modal-button"
                onClick={handleReroll}
                type="button"
              >
                Reuse prompt
              </button>
            )}
            {onDelete && (
              <button
                className="modal-button modal-button-delete"
                onClick={handleDelete}
                type="button"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
