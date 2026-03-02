/**
 * SECURITY UTILITY FUNCTIONS
 * Prevents XSS, injection, and data tampering attacks
 */

// ============================================
// 1. INPUT SANITIZATION & VALIDATION
// ============================================

/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} str - String to sanitize
 * @returns {string} - Safe HTML string
 */
function sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Sanitize plain text (no HTML)
 * @param {string} str - String to sanitize
 * @returns {string} - Plain text without HTML
 */
function sanitizeText(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>\"'&]/g, function(char) {
        const escaped = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;'
        };
        return escaped[char];
    });
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Validate phone number (10+ digits)
 * @param {string} phone - Phone to validate
 * @returns {boolean} - True if valid
 */
function isValidPhone(phone) {
    const cleanPhone = String(phone).replace(/\D/g, '');
    return cleanPhone.length >= 10;
}

/**
 * Validate URL to prevent javascript: and data: attacks
 * @param {string} url - URL to validate
 * @returns {boolean} - True if safe
 */
function isValidURL(url) {
    try {
        const parsed = new URL(url);
        // Only allow http and https
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Remove dangerous file extensions
 * @param {string} filename - Filename to check
 * @returns {boolean} - True if safe
 */
function isValidFileName(filename) {
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.js', '.html', '.php', '.java', '.zip'];
    const lowercaseFilename = String(filename).toLowerCase();
    return !dangerousExtensions.some(ext => lowercaseFilename.endsWith(ext));
}

// ============================================
// 2. CONTENT SECURITY POLICY
// ============================================

/**
 * Set CSP headers (frontend-only warning system)
 * NOTE: Proper CSP must be set by server
 */
function initCSP() {
    console.warn('⚠️ CSP should be configured on server');
    // Recommended CSP header:
    // Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:;
}

// ============================================
// 3. AUTHENTICATION & SESSIONS
// ============================================

/**
 * Store session token securely
 * @param {string} token - Session token
 */
function setSessionToken(token) {
    if (!token || token.length < 10) {
        console.error('❌ Invalid token');
        return false;
    }
    // Use sessionStorage (cleared on browser close) NOT localStorage
    try {
        sessionStorage.setItem('authToken', btoa(token)); // Base64 encode
        sessionStorage.setItem('tokenExpiry', Date.now() + (60 * 60 * 1000)); // 1 hour
        return true;
    } catch(e) {
        console.error('❌ SessionStorage access denied:', e);
        return false;
    }
}

/**
 * Get and validate session token
 * @returns {string|null} - Token if valid, null if expired
 */
function getSessionToken() {
    try {
        const token = sessionStorage.getItem('authToken');
        const expiry = parseInt(sessionStorage.getItem('tokenExpiry'));
        
        if (!token || !expiry) return null;
        if (Date.now() > expiry) {
            clearSession();
            return null;
        }
        
        return atob(token); // Decode from base64
    } catch(e) {
        console.error('❌ Session token error:', e);
        return null;
    }
}

/**
 * Clear session safely
 */
function clearSession() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('tokenExpiry');
    console.log('✅ Session cleared');
}

// ============================================
// 4. DATA PROTECTION
// ============================================

/**
 * Hash string using simple algorithm (NOT for passwords!)
 * For actual password hashing, use bcrypt backend
 * @param {string} str - String to hash
 * @returns {string} - Hash
 */
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
}

/**
 * Never store sensitive data in localStorage
 * Use sessionStorage for temporary data only
 */
function isSensitiveData(data) {
    const sensitiveKeywords = ['password', 'token', 'secret', 'key', 'auth', 'credit'];
    return sensitiveKeywords.some(keyword => 
        String(data).toLowerCase().includes(keyword)
    );
}

/**
 * Safe localStorage wrapper
 */
const SecureStorage = {
    set(key, value) {
        if (isSensitiveData(key) || isSensitiveData(value)) {
            console.error('❌ Sensitive data should not be stored in localStorage');
            return false;
        }
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch(e) {
            console.error('❌ Storage error:', e);
            return false;
        }
    },
    
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch(e) {
            console.error('❌ Storage error:', e);
            return null;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch(e) {
            console.error('❌ Storage error:', e);
            return false;
        }
    }
};

// ============================================
// 5. RATE LIMITING (Client-side check only)
// ============================================

class RateLimiter {
    constructor(maxAttempts = 5, windowMs = 60000) {
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
        this.attempts = {};
    }
    
    isAllowed(identifier) {
        const now = Date.now();
        const key = `rate_${identifier}`;
        
        if (!this.attempts[key]) {
            this.attempts[key] = { count: 0, resetTime: now + this.windowMs };
        }
        
        const record = this.attempts[key];
        
        // Reset if window expired
        if (now > record.resetTime) {
            record.count = 0;
            record.resetTime = now + this.windowMs;
        }
        
        record.count++;
        
        return record.count <= this.maxAttempts;
    }
    
    getRemaining(identifier) {
        const key = `rate_${identifier}`;
        const record = this.attempts[key];
        if (!record) return this.maxAttempts;
        return Math.max(0, this.maxAttempts - record.count);
    }
}

// ============================================
// 6. CSRF PREVENTION
// ============================================

/**
 * Generate CSRF token
 * @returns {string} - Random token
 */
function generateCSRFToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate CSRF token
 * @param {string} token - Token to validate
 * @returns {boolean} - True if matches stored token
 */
function validateCSRFToken(token) {
    const storedToken = sessionStorage.getItem('csrfToken');
    return token === storedToken;
}

// ============================================
// 7. LOGGING & SECURITY AUDIT
// ============================================

const SecurityAudit = {
    logs: [],
    
    log(event, level = 'info', details = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            event,
            level,
            details,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.logs.push(logEntry);
        
        // Keep logs trimmed to last 100 entries
        if (this.logs.length > 100) {
            this.logs.shift();
        }
        
        // Only show warnings and errors in console
        if (level !== 'info') {
            console[level === 'error' ? 'error' : 'warn'](`🔒 Security: ${event}`, details);
        }
    },
    
    getLog() {
        return this.logs;
    },
    
    exportLog() {
        return JSON.stringify(this.logs, null, 2);
    }
};

// ============================================
// 8. INITIALIZATION
// ============================================

// Initialize security on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔒 Security module loaded');
    
    // Generate and store CSRF token
    const csrfToken = generateCSRFToken();
    sessionStorage.setItem('csrfToken', csrfToken);
    
    // Initialize CSP
    initCSP();
    
    // Log page load
    SecurityAudit.log('Page Loaded', 'info', { page: window.location.pathname });
});

// Log when user leaves page
window.addEventListener('beforeunload', () => {
    SecurityAudit.log('Page Unload', 'info', { page: window.location.pathname });
});

// Prevent right-click on sensitive content (optional)
function protectContent(selector) {
    document.querySelectorAll(selector).forEach(el => {
        el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            SecurityAudit.log('Protect Content: Right-click blocked', 'warn');
            return false;
        });
    });
}
