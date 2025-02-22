// Core functionality for URL validation and archive generation
const validateURL = (url) => {
    try {
        const urlObj = new URL(url);
        // Check for common news article URL patterns
        const newsPatterns = [
            '/news/',
            '/article/',
            '/story/',
            '/blog/',
            '/opinion/',
            '/politics/',
            '/world/',
            '/business/',
            '/post/',
            '/analysis/',
            '/feature/',
            '/commentary/',
            '/tech/',
            '/science/',
            '/health/',
            '/sports/',
            '/entertainment/',
            '/culture/',
            '/lifestyle/',
            '/economy/',
            '/finance/',
            '/environment/',
            '/education/',
            '/technology/',
            '/breaking/',
            '/latest/',
            '/headlines/',
            '/updates/',
            '/report/',
            '/investigation/',
            '/exclusive/',
            '/interview/',
            '/press-release/',
            '/media/',
            '/global/',
            '/international/',
            '/world-news/',
            '/foreign/',
            '/books/',
            '/literature/',
            '/reviews/',
            '/reading/',
            '/library/',
            '/publishing/',
            '/author/',
            '/literary/',
            '/bookshelf/',
            '/novel/'
        ];
        
        // Check both pathname and search parameters for news patterns
        const hasNewsPattern = newsPatterns.some(pattern => 
            urlObj.pathname.toLowerCase().includes(pattern) ||
            urlObj.search.toLowerCase().includes(pattern.replace(/\//g, ''))
        );

        // Additional checks for common news site URL patterns
        const hasDatePattern = /\/(19|20)\d{2}(\/\d{1,2}){0,2}\//.test(urlObj.pathname) || // Matches date patterns like /2023/12/25/
                               /\d{4,8}/.test(urlObj.pathname); // Matches numeric IDs commonly used in news URLs

        if (!hasNewsPattern && !hasDatePattern) {
            return {
                isValid: false,
                message: 'URL does not appear to be a news article'
            };
        }

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

// Unit Tests
function runTests() {
    // Test validateURL
    console.assert(
        validateURL('https://example.com/news/article123').isValid === true,
        'Valid news URL should pass'
    );

    console.assert(
        validateURL('https://example.com/article/story456').isValid === true,
        'Valid article URL should pass'
    );

    console.assert(
        validateURL('https://example.com/shop').isValid === false,
        'Non-news URL should fail'
    );

    console.assert(
        validateURL('not-a-url').isValid === false,
        'Invalid URL should fail'
    );

    // Test generateArchiveURL
    const testUrl = 'https://example.com/news/story?id=123';
    const expectedArchiveUrl = `https://archive.is/${encodeURIComponent(testUrl)}`;
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
        window.location.href = archiveURL;
    });

    clearButton.addEventListener('click', () => {
        input.value = '';
        errorMessage.textContent = '';
        input.focus();
    });
}