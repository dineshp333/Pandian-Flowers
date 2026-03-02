// Automated Test Suite for Pandian Flowers Website
// Can be run in browser console or with Node.js

const TestSuite = {
    results: [],
    passed: 0,
    failed: 0,
    
    // Initialize tests
    init() {
        console.log('🧪 Starting Pandian Flowers Test Suite...\n');
    },
    
    // Test runner
    test(testName, testFn) {
        try {
            testFn();
            this.passed++;
            this.results.push({ name: testName, status: '✅ PASS' });
            console.log(`✅ PASS: ${testName}`);
        } catch (error) {
            this.failed++;
            this.results.push({ name: testName, status: '❌ FAIL', error: error.message });
            console.error(`❌ FAIL: ${testName} - ${error.message}`);
        }
    },
    
    // Assertion helpers
    assert(condition, message) {
        if (!condition) throw new Error(message);
    },
    
    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`${message} - Expected: ${expected}, Got: ${actual}`);
        }
    },
    
    assertExists(element, message) {
        if (!element) throw new Error(`${message} - Element not found`);
    },
    
    // FUNCTIONAL TESTS
    testNavigation() {
        const navLinks = document.querySelectorAll('nav a');
        this.assert(navLinks.length > 0, 'Navigation links not found');
    },
    
    testMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-button');
        this.assertExists(mobileMenuBtn, 'Mobile menu button');
    },
    
    testHeroSection() {
        const heroSection = document.querySelector('[class*="hero"]');
        this.assert(heroSection !== null || document.querySelector('section'), 'Hero section not found');
    },
    
    testOrderForm() {
        const orderForm = document.getElementById('orderForm');
        this.assertExists(orderForm, 'Order form');
        
        const requiredFields = orderForm.querySelectorAll('[required]');
        this.assert(requiredFields.length > 0, 'No required fields in form');
    },
    
    testContactForm() {
        const contactForm = document.querySelector('form[id*="contact"]');
        if (contactForm) {
            const emailField = contactForm.querySelector('[type="email"]');
            this.assertExists(emailField, 'Email field in contact form');
        }
    },
    
    testWhatsAppLink() {
        const whatsappLinks = document.querySelectorAll('[href*="wa.me"]');
        this.assert(whatsappLinks.length > 0, 'WhatsApp link not found');
        
        const href = whatsappLinks[0].getAttribute('href');
        this.assert(href.includes('919952881424'), 'WhatsApp number incorrect');
    },
    
    // SECURITY TESTS
    testHardcodedPassword() {
        const scripts = document.querySelectorAll('script');
        let foundPassword = false;
        
        scripts.forEach(script => {
            if (script.textContent.includes('flowerpandian1424')) {
                foundPassword = true;
            }
        });
        
        if (foundPassword) {
            console.warn('⚠️ WARNING: Hardcoded password found in client-side code!');
        }
    },
    
    testCSPHeader() {
        const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (!cspMeta) {
            console.warn('⚠️ WARNING: No CSP header found');
        }
    },
    
    testHTTPSEnforcement() {
        if (window.location.protocol !== 'https:') {
            console.warn('⚠️ WARNING: Page not using HTTPS');
        }
    },
    
    // UI/UX TESTS
    testResponsiveDesign() {
        const viewport = document.querySelector('meta[name="viewport"]');
        this.assertExists(viewport, 'Viewport meta tag');
    },
    
    testAccessibility() {
        const labels = document.querySelectorAll('label');
        this.assert(labels.length > 0, 'No labels found (accessibility issue)');
    },
    
    testFormLabels() {
        const form = document.getElementById('orderForm');
        if (form) {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (input.hasAttribute('required')) {
                    // Check if input has associated label
                    const label = form.querySelector(`label[for="${input.id}"]`);
                    this.assert(label || input.name, `Input ${input.id} has no associated label`);
                }
            });
        }
    },
    
    testColorContrast() {
        console.warn('⚠️ Manual check needed: Verify color contrast ratios using Lighthouse');
    },
    
    // PERFORMANCE TESTS
    testPageLoadTime() {
        if (window.performance && window.performance.timing) {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            console.log(`📊 Page load time: ${loadTime}ms`);
            this.assert(loadTime < 5000, `Page load time too high: ${loadTime}ms`);
        }
    },
    
    testResourceSize() {
        if (window.performance && window.performance.getEntriesByType) {
            const resources = window.performance.getEntriesByType('resource');
            resources.forEach(resource => {
                if (resource.transferSize > 1000000) {
                    console.warn(`⚠️ Large resource: ${resource.name} (${(resource.transferSize / 1000).toFixed(2)}KB)`);
                }
            });
        }
    },
    
    testDOMSize() {
        const elementCount = document.querySelectorAll('*').length;
        console.log(`📊 DOM elements: ${elementCount}`);
        this.assert(elementCount < 5000, 'DOM has too many elements');
    },
    
    // Run all tests
    runAll() {
        this.init();
        
        console.log('=== FUNCTIONAL TESTS ===\n');
        this.test('Navigation Links', () => this.testNavigation());
        this.test('Mobile Menu', () => this.testMobileMenu());
        this.test('Hero Section', () => this.testHeroSection());
        this.test('Order Form', () => this.testOrderForm());
        this.test('Contact Form', () => this.testContactForm());
        this.test('WhatsApp Link', () => this.testWhatsAppLink());
        
        console.log('\n=== SECURITY TESTS ===\n');
        this.test('Hardcoded Password Check', () => this.testHardcodedPassword());
        this.test('CSP Header', () => this.testCSPHeader());
        this.test('HTTPS Enforcement', () => this.testHTTPSEnforcement());
        
        console.log('\n=== UI/UX TESTS ===\n');
        this.test('Responsive Design', () => this.testResponsiveDesign());
        this.test('Accessibility', () => this.testAccessibility());
        this.test('Form Labels', () => this.testFormLabels());
        this.test('Color Contrast', () => this.testColorContrast());
        
        console.log('\n=== PERFORMANCE TESTS ===\n');
        this.test('Page Load Time', () => this.testPageLoadTime());
        this.test('Resource Size', () => this.testResourceSize());
        this.test('DOM Size', () => this.testDOMSize());
        
        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(50));
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`📈 Pass Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(2)}%`);
        console.log('='.repeat(50) + '\n');
        
        return {
            passed: this.passed,
            failed: this.failed,
            results: this.results
        };
    }
};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestSuite;
}

// Auto-run if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        TestSuite.runAll();
    });
} else {
    TestSuite.runAll();
}
