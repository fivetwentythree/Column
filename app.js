// Core functionality for URL validation and archive generation
const validateURL = (url) => {
    try {
        // Basic URL validation using URL constructor
        const urlObj = new URL(url);
        return {
            isValid: true,
            message: ''
        };
    } catch (e) {
        return {
            isValid: false,
            message: 'Please enter a valid URL'
        };
    }
};

const generateArchiveURL = (url) => {
    // Use archive.is's format for retrieving the latest version
    return `https://archive.is/latest/${encodeURIComponent(url)}`;
};

// Function to extract and download article content
const extractAndDownloadContent = async (archiveURL, originalURL) => {
    try {
        // Attempt to fetch the archived page content
        const response = await fetch(archiveURL, {
            mode: 'cors',
            headers: {
                'Accept': 'text/html'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch archived content');
        }

        const html = await response.text();
        
        // Create a temporary DOM parser
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract main content (this is a basic implementation and might need adjustment)
        const article = doc.querySelector('article') || 
                       doc.querySelector('.article-content') || 
                       doc.querySelector('.content') ||
                       doc.querySelector('main');
                       
        if (!article) {
            throw new Error('Could not find article content');
        }

        // Clean up the content
        const cleanText = article.textContent.trim()
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, '\n\n');

        // Create the download
        const filename = new URL(originalURL).hostname.replace(/\./g, '_') + '_archive.txt';
        const blob = new Blob([cleanText], { type: 'text/plain' });
        const downloadUrl = window.URL.createObjectURL(blob);
        
        // Create and trigger download link
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(downloadUrl);

        return true;
    } catch (error) {
        console.error('Error extracting content:', error);
        return false;
    }
};

// Unit Tests
function runTests() {
    // Test validateURL
    console.assert(
        validateURL('https://example.com/any/path').isValid === true,
        'Valid URL should pass'
    );

    console.assert(
        validateURL('https://google.com').isValid === true,
        'Valid URL should pass'
    );

    console.assert(
        validateURL('not-a-url').isValid === false,
        'Invalid URL should fail'
    );

    // Test generateArchiveURL
    const testUrl = 'https://example.com/any/path';
    const expectedArchiveUrl = `https://archive.is/latest/${encodeURIComponent(testUrl)}`;
    console.assert(
        generateArchiveURL(testUrl) === expectedArchiveUrl,
        'Archive URL should be correctly generated'
    );

    console.log('All tests completed');
}

// Run tests in non-production environment
if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production') {
    // Create a mock URL class if running in Node.js environment
    if (typeof window === 'undefined') {
        global.URL = require('url').URL;
    }
    runTests();
}

// Form handling - Only execute in browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const form = document.getElementById('url-form');
    const input = document.getElementById('url-input');
    const errorMessage = document.getElementById('error-message');
    const clearButton = document.getElementById('clear-button');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = input.value.trim();
        const validation = validateURL(url);

        if (!validation.isValid) {
            errorMessage.textContent = validation.message;
            return;
        }

        errorMessage.textContent = '';
        const archiveURL = generateArchiveURL(url);
        
        // Redirect to archive URL immediately
        window.location.href = archiveURL;
    });

    input.addEventListener('focus', async () => {
        try {
            // Check if clipboard API is available
            if (!navigator.clipboard) {
                console.warn('Clipboard API not available');
                return;
            }

            // Request clipboard read permission
            const text = await navigator.clipboard.readText();
            
            // Only auto-paste if the input is empty
            if (!input.value) {
                input.value = text.trim();
                const validation = validateURL(text.trim());
                if (!validation.isValid) {
                    errorMessage.textContent = validation.message;
                } else {
                    errorMessage.textContent = '';
                }
            }
        } catch (err) {
            console.warn('Failed to read clipboard:', err);
        }
    });

    clearButton.addEventListener('click', () => {
        input.value = '';
        errorMessage.textContent = '';
        input.focus();
    });
}