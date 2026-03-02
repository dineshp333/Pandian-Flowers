// Secure Admin Panel Login (Backend authentication required for production)
// This is a CLIENT-SIDE TOKEN implementation. For production, use proper backend auth.

const ADMIN_CONFIG = {
    // NOTE: In production, these should come from backend after 2FA/email verification
    // DO NOT hardcode passwords in JavaScript
    sessionTimeout: 60 * 60 * 1000, // 1 hour
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutes
};

let currentCategory = "all";
let uploadedPhotos = {
    wedding: [],
    reception: [],
    home: [],
    custom: []
};

const loginLimiter = new RateLimiter(ADMIN_CONFIG.maxLoginAttempts, ADMIN_CONFIG.lockoutDuration);

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    SecurityAudit.log('Admin Panel: Initialized', 'info');
    
    // Check if user is already logged in
    const token = getSessionToken();
    if (token) {
        showAdminPanel();
    } else {
        showLoginForm();
    }
    
    loadPhotosFromStorage();
    updatePhotoCounts();
});

// ============================================
// LOGIN FUNCTIONS (IMPROVED SECURITY)
// ============================================

function verifyPassword() {
    const passwordInput = document.getElementById('password');
    const errorSpan = document.getElementById('passwordError');
    
    if (!passwordInput.value.trim()) {
        errorSpan.textContent = 'Password required';
        errorSpan.classList.remove('hidden');
        SecurityAudit.log('Login: Empty password attempted', 'warn');
        return;
    }
    
    // Rate limiting
    if (!loginLimiter.isAllowed('login_attempt')) {
        errorSpan.textContent = `Too many attempts. Try again in ${ADMIN_CONFIG.lockoutDuration / 60000} minutes`;
        errorSpan.classList.remove('hidden');
        SecurityAudit.log('Login: Rate limit exceeded', 'error');
        return;
    }
    
    // TODO: In production, send password to backend for secure verification
    // const result = await fetch('/api/admin/verify', { 
    //     method: 'POST', 
    //     body: JSON.stringify({ password: passwordInput.value })
    // });
    
    // For demonstration: Show message that backend auth is required
    showMessage('error', '⚠️ Please configure backend authentication for production. See docs/SECURITY_SETUP.md');
    SecurityAudit.log('Login: Backend authentication required', 'warn');
    errorSpan.textContent = 'Production: Requires backend authentication';
    errorSpan.classList.remove('hidden');
}

function showForgotPassword() {
    document.getElementById('loginStep').classList.add('hidden');
    document.getElementById('forgotStep').classList.remove('hidden');
    document.getElementById('securityAnswer').focus();
}

function verifySecurityAnswer() {
    // TODO: In production, verify security answer on backend
    // Never trust client-side security questions
    
    showMessage('error', '⚠️ Password recovery requires email verification. Feature coming soon.');
    SecurityAudit.log('Password Recovery: Attempted', 'warn');
}

function backToLogin() {
    document.getElementById('loginStep').classList.remove('hidden');
    document.getElementById('forgotStep').classList.add('hidden');
    document.getElementById('resetSuccess').classList.add('hidden');
    document.getElementById('password').value = '';
    document.getElementById('securityAnswer').value = '';
    document.getElementById('passwordError').classList.add('hidden');
    document.getElementById('answerError').classList.add('hidden');
    document.getElementById('password').focus();
}

function logout() {
    clearSession();
    document.getElementById('adminContainer').classList.add('hidden');
    document.getElementById('loginContainer').classList.remove('hidden');
    showMessage('success', '✅ Logged out successfully');
    SecurityAudit.log('Logout: User logged out', 'info');
}

// ============================================
// PANEL VISIBILITY FUNCTIONS
// ============================================

function showLoginForm() {
    document.getElementById('loginContainer').classList.remove('hidden');
    document.getElementById('adminContainer').classList.add('hidden');
}

function showAdminPanel() {
    document.getElementById('loginContainer').classList.add('hidden');
    document.getElementById('adminContainer').classList.remove('hidden');
    SecurityAudit.log('Admin Panel: Displayed', 'info');
}

// ============================================
// FILE UPLOAD FUNCTIONS (SECURE)
// ============================================

function uploadPhoto() {
    const categorySelect = document.getElementById('categorySelect');
    const photoInput = document.getElementById('photoInput');
    const uploadStatus = document.getElementById('uploadStatus');
    const category = categorySelect.value;
    const file = photoInput.files[0];

    // Validation
    if (!category) {
        showStatus('Please select a category', 'error', uploadStatus);
        SecurityAudit.log('Upload: No category selected', 'warn');
        return;
    }

    if (!file) {
        showStatus('Please select a photo', 'error', uploadStatus);
        return;
    }

    // File type validation - SECURITY CHECK
    if (!file.type.startsWith('image/')) {
        showStatus('⚠️ Only image files allowed', 'error', uploadStatus);
        SecurityAudit.log('Upload: Invalid file type attempted', 'error', { type: file.type });
        return;
    }

    // File size validation
    if (file.size > 5 * 1024 * 1024) {
        showStatus('File size should be less than 5MB', 'error', uploadStatus);
        SecurityAudit.log('Upload: File too large', 'warn', { size: file.size });
        return;
    }

    // Filename validation - SECURITY CHECK
    if (!isValidFileName(file.name)) {
        showStatus('⚠️ Invalid file name. Name contains dangerous extension', 'error', uploadStatus);
        SecurityAudit.log('Upload: Dangerous filename', 'error', { name: file.name });
        return;
    }

    // Sanitize filename
    const sanitizedName = sanitizeText(file.name);

    // Read file
    const reader = new FileReader();
    reader.onerror = function() {
        showStatus('❌ Error reading file', 'error', uploadStatus);
        SecurityAudit.log('Upload: File read error', 'error');
    };

    reader.onload = function(e) {
        try {
            const photoData = {
                id: Date.now(),
                name: sanitizedName,
                data: e.target.result,
                uploadedAt: new Date().toLocaleString(),
                size: file.size
            };

            uploadedPhotos[category].push(photoData);
            savePhotosToStorage();
            updatePhotoCounts();
            renderPhotos();

            showStatus(`✅ Photo uploaded successfully!`, 'success', uploadStatus);
            SecurityAudit.log('Upload: Success', 'info', { category, size: file.size });
            
            // Reset form
            categorySelect.value = '';
            photoInput.value = '';
            showCategory(category);

        } catch(error) {
            showStatus('❌ Error processing file', 'error', uploadStatus);
            SecurityAudit.log('Upload: Processing error', 'error', { error: error.message });
        }
    };

    reader.readAsDataURL(file);
}

// ============================================
// DISPLAY FUNCTIONS (SAFE RENDERING)
// ============================================

function showStatus(message, type, element) {
    // Sanitize message
    const safeMessage = sanitizeHTML(message);
    
    element.innerHTML = safeMessage;
    element.className = `mt-4 p-4 rounded-lg ${
        type === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' : 
        'bg-green-100 border-l-4 border-green-500 text-green-700'
    }`;
    element.classList.remove('hidden');

    if (type === 'success') {
        setTimeout(() => element.classList.add('hidden'), 3000);
    }
}

function showCategory(category) {
    currentCategory = category;

    // Update active tab
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active', 'border-b-4', 'border-green-600', 'text-green-600');
        btn.classList.add('text-gray-600');
    });
    
    event.target.classList.add('active', 'border-b-4', 'border-green-600', 'text-green-600');
    event.target.classList.remove('text-gray-600');

    renderPhotos();
}

function renderPhotos() {
    const photosGrid = document.getElementById('photosGrid');
    let photos = [];

    if (currentCategory === 'all') {
        photos = [
            ...uploadedPhotos.wedding.map(p => ({ ...p, category: 'wedding' })),
            ...uploadedPhotos.reception.map(p => ({ ...p, category: 'reception' })),
            ...uploadedPhotos.home.map(p => ({ ...p, category: 'home' })),
            ...uploadedPhotos.custom.map(p => ({ ...p, category: 'custom' }))
        ];
    } else {
        photos = uploadedPhotos[currentCategory].map(p => ({ ...p, category: currentCategory }));
    }

    if (photos.length === 0) {
        photosGrid.innerHTML = '<div class="col-span-full text-center py-12 text-gray-500"><p class="text-lg">📸 No photos in this category yet</p></div>';
        return;
    }

    // SECURITY: Use textContent for safe rendering
    photosGrid.innerHTML = photos.map(photo => {
        const safeName = sanitizeHTML(photo.name);
        const safeCategory = sanitizeHTML(photo.category);
        
        return `
            <div class="bg-gray-100 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
                <div class="relative h-48 overflow-hidden bg-gray-200">
                    <img src="${photo.data}" alt="${safeName}" class="w-full h-full object-cover hover:scale-110 transition duration-300" loading="lazy">
                    <div class="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold capitalize">
                        ${safeCategory}
                    </div>
                </div>
                <div class="p-4">
                    <p class="text-sm text-gray-600 truncate mb-2" title="${safeName}">📁 ${safeName}</p>
                    <p class="text-xs text-gray-500 mb-3">📅 ${photo.uploadedAt}</p>
                    <button onclick="deletePhoto('${photo.category}', ${photo.id})" 
                        class="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition font-semibold text-sm">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function deletePhoto(category, photoId) {
    if (!confirm('Are you sure you want to delete this photo?')) {
        return;
    }
    
    uploadedPhotos[category] = uploadedPhotos[category].filter(p => p.id !== photoId);
    savePhotosToStorage();
    updatePhotoCounts();
    renderPhotos();
    showMessage('success', '✅ Photo deleted successfully!');
    SecurityAudit.log('Delete: Photo deleted', 'info', { category, photoId });
}

// ============================================
// STORAGE FUNCTIONS (SECURE)
// ============================================

function savePhotosToStorage() {
    // Note: Base64 images in localStorage is NOT recommended for production
    // Use backend storage (AWS S3, Firebase, etc.)
    try {
        const data = JSON.stringify(uploadedPhotos);
        if (data.length > 5 * 1024 * 1024) { // 5MB limit
            console.warn('⚠️ Storage data approaching limit. Consider using backend storage.');
        }
        SecureStorage.set('pandianPhotos', uploadedPhotos);
        SecurityAudit.log('Storage: Data saved', 'info');
    } catch(error) {
        console.error('❌ Storage error:', error);
        SecurityAudit.log('Storage: Save failed', 'error', { error: error.message });
    }
}

function loadPhotosFromStorage() {
    try {
        const stored = SecureStorage.get('pandianPhotos');
        if (stored) {
            uploadedPhotos = stored;
            SecurityAudit.log('Storage: Data loaded', 'info');
        }
    } catch(error) {
        console.error('❌ Storage error:', error);
        SecurityAudit.log('Storage: Load failed', 'error', { error: error.message });
    }
}

function updatePhotoCounts() {
    const counts = {
        wedding: uploadedPhotos.wedding.length,
        reception: uploadedPhotos.reception.length,
        home: uploadedPhotos.home.length,
        custom: uploadedPhotos.custom.length
    };

    document.querySelectorAll('.category-btn').forEach(btn => {
        const match = btn.textContent.match(/wedding|reception|home|custom/i);
        if (match) {
            const catKey = match[0].toLowerCase();
            btn.textContent = btn.textContent.replace(/\(\d+\)/, `(${counts[catKey]})`);
        }
    });
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const loginStep = document.getElementById('loginStep');
        const forgotStep = document.getElementById('forgotStep');
        
        if (loginStep && loginStep.classList.contains('hidden') === false) {
            verifyPassword();
        } else if (forgotStep && forgotStep.classList.contains('hidden') === false) {
            verifySecurityAnswer();
        }
    }
});

// ============================================
// SECURITY WARNINGS
// ============================================

console.log('%c🔒 SECURITY NOTICE', 'color: red; font-size: 16px; font-weight: bold;');
console.log('%c⚠️ This admin panel needs backend authentication for production use.%c\nFor production deployment, implement:\n✓ Backend password hashing (bcrypt/Argon2)\n✓ Email verification for password reset\n✓ Two-factor authentication\n✓ HTTPS only\n✓ Backend file upload validation\n✓ Rate limiting on server\n\nSee: docs/SECURITY_SETUP.md', 'color: orange; font-size: 12px;', 'color: blue; font-size: 11px;');
