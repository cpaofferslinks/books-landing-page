// Function to handle PDF downloads with fallback for CORS restrictions
function handleDownload(pdfUrl, filename) {
    // Show loading indicator
    const downloadButton = document.querySelector('.btn-download-large');
    const originalText = downloadButton.innerHTML;
    downloadButton.innerHTML = '<span class="download-icon">📥</span> Preparing download...';
    downloadButton.style.opacity = '0.7';
    downloadButton.style.pointerEvents = 'none';
    
    // Try to download using fetch (modern approach)
    fetch(pdfUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            // Create a temporary URL for the blob
            const blobUrl = window.URL.createObjectURL(blob);
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename || 'book.pdf';
            
            // Add the link to the document
            document.body.appendChild(link);
            
            // Trigger the click event
            link.click();
            
            // Remove the link from the document
            document.body.removeChild(link);
            
            // Revoke the blob URL to free memory
            window.URL.revokeObjectURL(blobUrl);
            
            // Restore button
            downloadButton.innerHTML = originalText;
            downloadButton.style.opacity = '1';
            downloadButton.style.pointerEvents = 'auto';
        })
        .catch(error => {
            // If fetch fails due to CORS, try opening in new tab with instructions
            console.error('Download failed:', error);
            
            // Restore button
            downloadButton.innerHTML = originalText;
            downloadButton.style.opacity = '1';
            downloadButton.style.pointerEvents = 'auto';
            
            // Open PDF in new tab
            const newWindow = window.open(pdfUrl, '_blank');
            
            // Show instructions to user
            if (newWindow) {
                // Show instructions in current window
                alert('The PDF will open in a new tab.\n\nTo download:\n1. Wait for the PDF to load in the new tab\n2. Press Ctrl+S (or Cmd+S on Mac) to save\n3. Or right-click and select "Save As"');
            } else {
                // If popup blocker prevents new tab, show manual instructions
                alert('Please allow popups and redirects for this site, then try again.\n\nTo download manually:\n1. Right-click the Download button\n2. Select "Save Link As" or "Download Linked File"');
            }
        });
}

// Add event listeners to all download buttons
document.addEventListener('DOMContentLoaded', function() {
    // Find all download buttons
    const downloadButtons = document.querySelectorAll('.btn-download-large');
    
    // Add click event listener to each button
    downloadButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            // Prevent the default link behavior
            e.preventDefault();
            
            // Get the PDF URL from the href attribute
            const pdfUrl = this.getAttribute('href');
            
            // Get the filename from data attribute or create one
            let filename = this.getAttribute('data-filename');
            if (!filename) {
                const bookTitle = document.querySelector('.book-title') ? 
                    document.querySelector('.book-title').textContent : 'book';
                filename = bookTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.pdf';
            }
            
            // Handle the download
            handleDownload(pdfUrl, filename);
        });
    });
});