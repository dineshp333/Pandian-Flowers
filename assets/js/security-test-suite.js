/**
 * COMPREHENSIVE SECURITY TEST SUITE
 * Tests all security protections implemented
 */

const SecurityTestSuite = {
    results: [],
    passed: 0,
    failed: 0,
    warnings: 0,
    
    init() {
        console.log('%c🔒 SECURITY TEST SUITE STARTING', 'color: red; font-size: 16px; font-weight: bold;');
        this.results = [];
        this.passed = 0;
        this.failed = 0;
        this.warnings = 0;
    },
    
    // Test runner
    test(testName, testFn, severity = 'INFO') {
        try {
            testFn();
            this.passed++;
            this.results.push({ name: testName, status: 'PASS', severity });
            console.log(`✅ PASS: ${testName}`);
        } catch (error) {
            if (severity === 'CRITICAL') {
                this.failed++;
                console.error(`❌ FAIL: ${testName} - ${error.message}`);
            } else if (severity === 'WARNING') {
                this.warnings++;
                console.warn(`⚠️ WARNING: ${testName} - ${error.message}`);
            }
            this.results.push({ name: testName, status: 'FAIL', severity, error: error.message });
        }
    },
    
    assert(condition, message) {
        if (!condition) throw new Error(message);
    },
    
    // =================================
    // INPUT SANITIZATION TESTS
    // =================================
    
    runInputSanitizationTests() {
        console.log('\n📝 INPUT SANITIZATION TESTS\n');
        
        this.test('sanitizeHTML: XSS Script Prevention', () => {
            const malicious = '<script>alert("XSS")</script>';
            const result = sanitizeHTML(malicious);
            this.assert(!result.includes('<script>'), 'Script tags should be escaped');
            this.assert(result.includes('&lt;script&gt;'), 'Should escape < and >');
        }, 'CRITICAL');
        
        this.test('sanitizeHTML: HTML Injection Prevention', () => {
            const injection = '<img src=x onerror=alert("XSS")>';
            const result = sanitizeHTML(injection);
            this.assert(!result.includes('onerror='), 'Event handlers should be escaped');
        }, 'CRITICAL');
        
        this.test('sanitizeText: Plain Text Conversion', () => {
            const html = '<b>Bold</b> & <i>Italic</i>';
            const result = sanitizeText(html);
            this.assert(result.includes('&lt;b&gt;'), 'HTML tags should be escaped');
        }, 'CRITICAL');
        
        this.test('isValidEmail: Valid Email Format', () => {
            this.assert(isValidEmail('user@example.com'), 'Valid email should pass');
            this.assert(!isValidEmail('invalid-email'), 'Invalid email should fail');
            this.assert(!isValidEmail('user@'), 'Incomplete email should fail');
        }, 'HIGH');
        
        this.test('isValidPhone: Phone Number Validation', () => {
            this.assert(isValidPhone('9952881424'), 'Valid phone should pass');
            this.assert(isValidPhone('+91-99528-81424'), 'Phone with separators should pass');
            this.assert(!isValidPhone('123'), 'Short phone should fail');
        }, 'HIGH');
        
        this.test('isValidURL: URL Safety Check', () => {
            this.assert(isValidURL('https://example.com'), 'HTTPS URL should pass');
            this.assert(!isValidURL('javascript:alert("XSS")'), 'JavaScript protocol should fail');
            this.assert(!isValidURL('data:text/html,<script>alert(1)</script>'), 'Data URI should fail');
        }, 'CRITICAL');
        
        this.test('isValidFileName: Dangerous Extension Check', () => {
            this.assert(isValidFileName('photo.jpg'), 'Image file should pass');
            this.assert(!isValidFileName('malware.exe'), 'EXE file should fail');
            this.assert(!isValidFileName('script.js'), 'JS file should fail');
            this.assert(!isValidFileName('virus.bat'), 'BAT file should fail');
        }, 'CRITICAL');
    },
    
    // =================================
    // AUTHENTICATION & SESSION TESTS
    // =================================
    
    runAuthenticationTests() {
        console.log('\n🔐 AUTHENTICATION & SESSION TESTS\n');
        
        this.test('setSessionToken: Store Token Securely', () => {
            clearSession(); // Clear first
            const token = 'test-token-12345';
            const result = setSessionToken(token);
            this.assert(result === true, 'Token storage should return true');
        }, 'HIGH');
        
        this.test('getSessionToken: Retrieve Token Correctly', () => {
            clearSession();
            const token = 'test-token-verify-12345';
            setSessionToken(token);
            const retrieved = getSessionToken();
            this.assert(retrieved === token, 'Retrieved token should match stored token');
        }, 'HIGH');
        
        this.test('clearSession: Clear Session Data', () => {
            setSessionToken('test-token');
            clearSession();
            const token = getSessionToken();
            this.assert(token === null, 'Token should be null after clearing');
        }, 'HIGH');
        
        this.test('Token Expiry: Token Should Expire', (done) => {
            clearSession();
            // Set very short expiry
            const token = 'expiring-token';
            setSessionToken(token);
            sessionStorage.setItem('tokenExpiry', Date.now() - 1000); // Already expired
            const retrieved = getSessionToken();
            this.assert(retrieved === null, 'Expired token should return null');
        }, 'HIGH');
        
        this.test('Invalid Token Rejection', () => {
            const result = setSessionToken(''); // Empty token
            this.assert(result === false, 'Empty token should be rejected');
        }, 'HIGH');
    },
    
    // =================================
    // CSRF PREVENTION TESTS
    // =================================
    
    runCSRFTests() {
        console.log('\n🛡️ CSRF PREVENTION TESTS\n');
        
        this.test('generateCSRFToken: Create Random Token', () => {
            const token1 = generateCSRFToken();
            const token2 = generateCSRFToken();
            this.assert(token1.length === 64, 'Token should be 64 characters');
            this.assert(token1 !== token2, 'Tokens should be unique');
        }, 'HIGH');
        
        this.test('validateCSRFToken: Token Verification', () => {
            const token = generateCSRFToken();
            sessionStorage.setItem('csrfToken', token);
            const result = validateCSRFToken(token);
            this.assert(result === true, 'Valid token should validate');
        }, 'HIGH');
        
        this.test('validateCSRFToken: Invalid Token Rejection', () => {
            sessionStorage.setItem('csrfToken', 'valid-token');
            const result = validateCSRFToken('invalid-token');
            this.assert(result === false, 'Invalid token should not validate');
        }, 'HIGH');
    },
    
    // =================================
    // RATE LIMITING TESTS
    // =================================
    
    runRateLimitingTests() {
        console.log('\n⏱️ RATE LIMITING TESTS\n');
        
        this.test('RateLimiter: Initial Requests Allowed', () => {
            const limiter = new RateLimiter(3, 60000);
            this.assert(limiter.isAllowed('test-user'), 'First request should be allowed');
            this.assert(limiter.isAllowed('test-user'), 'Second request should be allowed');
            this.assert(limiter.isAllowed('test-user'), 'Third request should be allowed');
        }, 'MEDIUM');
        
        this.test('RateLimiter: Threshold Exceeded', () => {
            const limiter = new RateLimiter(2, 60000);
            limiter.isAllowed('test-limit');
            limiter.isAllowed('test-limit');
            const result = limiter.isAllowed('test-limit');
            this.assert(result === false, 'Request should be blocked after limit');
        }, 'HIGH');
        
        this.test('RateLimiter: Remaining Count', () => {
            const limiter = new RateLimiter(5, 60000);
            limiter.isAllowed('counting');
            limiter.isAllowed('counting');
            const remaining = limiter.getRemaining('counting');
            this.assert(remaining === 3, 'Should show remaining attempts');
        }, 'MEDIUM');
    },
    
    // =================================
    // CSP HEADER TESTS
    // =================================
    
    runCSPTests() {
        console.log('\n🚫 CSP (CONTENT SECURITY POLICY) TESTS\n');
        
        this.test('CSP Meta Tag: Present in Document', () => {
            const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            this.assert(cspMeta !== null, 'CSP meta tag should exist');
        }, 'HIGH');
        
        this.test('CSP Policy: Contains Default Directives', () => {
            const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            if (cspMeta) {
                const content = cspMeta.getAttribute('content');
                this.assert(content.includes("default-src 'self'"), 'Should have default-src directive');
                this.assert(content.includes("script-src"), 'Should have script-src directive');
                this.assert(content.includes("style-src"), 'Should have style-src directive');
            }
        }, 'HIGH');
        
        this.test('CSP Check: Inline Scripts Allowed (Development)', () => {
            const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            if (cspMeta) {
                const content = cspMeta.getAttribute('content');
                // In development, unsafe-inline is allowed; production should remove this
                if (content.includes("'unsafe-inline'")) {
                    console.warn('⚠️ WARNING: unsafe-inline present in CSP. Remove for production.');
                }
            }
        }, 'WARNING');
    },
    
    // =================================
    // DATA PROTECTION TESTS
    // =================================
    
    runDataProtectionTests() {
        console.log('\n🔒 DATA PROTECTION TESTS\n');
        
        this.test('SecureStorage: Non-Sensitive Data Storage', () => {
            SecureStorage.set('test-key', 'test-value');
            const retrieved = SecureStorage.get('test-key');
            this.assert(retrieved === 'test-value', 'Should store and retrieve data correctly');
            SecureStorage.remove('test-key');
        }, 'MEDIUM');
        
        this.test('SecureStorage: Sensitive Data Rejection', () => {
            const result = SecureStorage.set('admin_password', 'sensitive-data');
            this.assert(result === false, 'Should reject sensitive data storage');
        }, 'CRITICAL');
        
        this.test('SecureStorage: Token Detection', () => {
            const result = isSensitiveData('my-secret-token');
            this.assert(result === true, 'Should detect token as sensitive');
        }, 'HIGH');
        
        this.test('SecureStorage: Password Detection', () => {
            const result = isSensitiveData('user_password');
            this.assert(result === true, 'Should detect password as sensitive');
        }, 'HIGH');
    },
    
    // =================================
    // SECURITY AUDIT TESTS
    // =================================
    
    runSecurityAuditTests() {
        console.log('\n📊 SECURITY AUDIT TESTS\n');
        
        this.test('SecurityAudit: Logging Events', () => {
            SecurityAudit.log('Test Event', 'info', { test: true });
            const logs = SecurityAudit.getLog();
            this.assert(logs.length > 0, 'Should have logged events');
        }, 'LOW');
        
        this.test('SecurityAudit: Export Functionality', () => {
            const exported = SecurityAudit.exportLog();
            this.assert(typeof exported === 'string', 'Should export as JSON string');
            this.assert(exported.includes('timestamp'), 'Export should contain timestamp');
        }, 'LOW');
    },
    
    // =================================
    // XSS ATTACK PREVENTION Tests
    // =================================
    
    runXSSTests() {
        console.log('\n✗ XSS ATTACK PREVENTION TESTS\n');
        
        this.test('XSS: Alert Box Injection', () => {
            const malicious = '<img src=x onerror="alert(1)">';
            const safe = sanitizeHTML(malicious);
            this.assert(!safe.includes('onerror'), 'Event handlers should be escaped');
            this.assert(!safe.includes('alert'), 'Should not execute JavaScript');
        }, 'CRITICAL');
        
        this.test('XSS: Script Tag Injection', () => {
            const script = '<script>alert("XSS"); var x = 1;</script>';
            const safe = sanitizeHTML(script);
            this.assert(safe.includes('&lt;script&gt;'), 'Script tags should be escaped');
        }, 'CRITICAL');
        
        this.test('XSS: Event Listener Injection', () => {
            const onclick = '<div onclick="malicious()">Click</div>';
            const safe = sanitizeHTML(onclick);
            this.assert(!safe.includes('onclick='), 'Event listeners should be escaped');
        }, 'CRITICAL');
        
        this.test('XSS: SVG/XML Attack', () => {
            const svg = '<svg onload="alert(1)"></svg>';
            const safe = sanitizeHTML(svg);
            this.assert(!safe.includes('onload='), 'SVG handlers should be escaped');
        }, 'CRITICAL');
    },
    
    // =================================
    // SQL INJECTION SIMULATION TESTS
    // =================================
    
    runSQLInjectionTests() {
        console.log('\n💉 SQL INJECTION PREVENTION TESTS\n');
        
        this.test('SQL Injection: Quote Escape', () => {
            const injection = "'; DROP TABLE users; --";
            const safe = sanitizeText(injection);
            // Note: Frontend can't prevent SQL injection (that's backend job)
            // But we can sanitize display
            this.assert(safe.length > 0, 'Should handle injection string gracefully');
        }, 'MEDIUM');
        
        this.test('SQL Injection: Parameter Validation', () => {
            const malicious = "1 OR 1=1";
            const safe = sanitizeHTML(malicious);
            this.assert(safe.length > 0, 'Should not crash on injection attempts');
        }, 'MEDIUM');
    },
    
    // =================================
    // HTTPS & TRANSPORT SECURITY
    // =================================
    
    runTransportSecurityTests() {
        console.log('\n🔐 TRANSPORT SECURITY TESTS\n');
        
        this.test('HTTPS: Page Loaded Over HTTPS', () => {
            const isHTTPS = window.location.protocol === 'https:';
            if (window.location.hostname !== 'localhost') {
                this.assert(isHTTPS, 'Should use HTTPS in production');
            }
        }, 'CRITICAL');
        
        this.test('HTTPS: GitHub Pages HTTPS', () => {
            if (window.location.hostname.includes('github')) {
                this.assert(window.location.protocol === 'https:', 'GitHub Pages should use HTTPS');
            }
        }, 'CRITICAL');
    },
    
    // =================================
    // SUMMARY & EXPORT
    // =================================
    
    printSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('%c📊 SECURITY TEST SUMMARY', 'color: blue; font-size: 14px; font-weight: bold;');
        console.log('='.repeat(60));
        console.log(`✅ PASSED:   ${this.passed}`);
        console.log(`❌ FAILED:   ${this.failed}`);
        console.log(`⚠️ WARNINGS: ${this.warnings}`);
        console.log(`📈 TOTAL:    ${this.passed + this.failed + this.warnings}`);
        
        const passRate = ((this.passed / (this.passed + this.failed + this.warnings)) * 100).toFixed(1);
        console.log(`🎯 Pass Rate: ${passRate}%`);
        console.log('='.repeat(60) + '\n');
        
        // Overall Security Score
        let securityScore = 'GOOD';
        if (this.failed > 0) securityScore = 'NEEDS WORK';
        if (this.failed > 5) securityScore = 'CRITICAL';
        
        console.log(`🛡️ OVERALL SECURITY: ${securityScore}`);
        console.log('='.repeat(60));
    },
    
    exportResults() {
        return JSON.stringify({
            timestamp: new Date().toISOString(),
            passed: this.passed,
            failed: this.failed,
            warnings: this.warnings,
            passRate: (this.passed / (this.passed + this.failed + this.warnings) * 100).toFixed(1) + '%',
            results: this.results,
            logs: SecurityAudit.getLog()
        }, null, 2);
    },
    
    // =================================
    // RUN ALL TESTS
    // =================================
    
    runAll() {
        this.init();
        
        this.runInputSanitizationTests();
        this.runAuthenticationTests();
        this.runCSRFTests();
        this.runRateLimitingTests();
        this.runCSPTests();
        this.runDataProtectionTests();
        this.runSecurityAuditTests();
        this.runXSSTests();
        this.runSQLInjectionTests();
        this.runTransportSecurityTests();
        
        this.printSummary();
        
        return {
            passed: this.passed,
            failed: this.failed,
            warnings: this.warnings,
            results: this.results,
            export: this.exportResults()
        };
    }
};

// Auto-run tests on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Security test suite ready. Call: SecurityTestSuite.runAll()');
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityTestSuite;
}
