// ⚠️ SECURITY WARNING: This file is DEPRECATED!
// Use admin-secure.js instead for production
// 
// CRITICAL VULNERABILITY: Hardcoded credentials exposed!
// - Never store passwords in client-side JavaScript
// - This file is kept for reference only
// - All sensitive data must be validated on backend

console.error('⚠️ SECURITY: admin.js is deprecated. Use admin-secure.js instead');

// Intentionally removed - use backend authentication instead
const ADMIN_PASSWORD = null;      // ❌ REMOVED - Backend auth required
const SECURITY_ANSWER = null;     // ❌ REMOVED - Use email recovery
let currentCategory = "all";
let uploadedPhotos = {
    wedding: [],
    reception: [],
    home: [],
    custom: []
};

// Initialize - Load photos from localStorage
document.addEventListener('DOMContentLoaded', function() {
    loadPhotosFromStorage();
    updatePhotoCounts();
});

// Login Functions
function verifyPassword() {
    const passwordInput = document.getElementById('password').value;
    const errorSpan = document.getElementById('passwordError');

    if (passwordInput === ADMIN_PASSWORD) {
        errorSpan.classList.add('hidden');
        document.getElementById('loginContainer').classList.add('hidden');
        document.getElementById('adminContainer').classList.remove('hidden');
    } else {
        errorSpan.classList.remove('hidden');
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }
}

function showForgotPassword() {
    document.getElementById('loginStep').classList.add('hidden');
    document.getElementById('forgotStep').classList.remove('hidden');
    document.getElementById('securityAnswer').focus();
}

function verifySecurityAnswer() {
    const answerInput = document.getElementById('securityAnswer').value.toLowerCase().trim();
    const errorSpan = document.getElementById('answerError');

    if (answerInput === SECURITY_ANSWER.toLowerCase()) {
        errorSpan.classList.add('hidden');
        document.getElementById('forgotStep').classList.add('hidden');
        document.getElementById('resetSuccess').classList.remove('hidden');
    } else {
        errorSpan.classList.remove('hidden');
        document.getElementById('securityAnswer').value = '';
        document.getElementById('securityAnswer').focus();
    }
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
    document.getElementById('loginContainer').classList.remove('hidden');
    document.getElementById('adminContainer').classList.add('hidden');
    document.getElementById('password').value = '';
    document.getElementById('password').focus();
}

// Upload Photo Function
function uploadPhoto() {
    const categorySelect = document.getElementById('categorySelect');
    const photoInput = document.getElementById('photoInput');
    const uploadStatus = document.getElementById('uploadStatus');
    const category = categorySelect.value;
    const file = photoInput.files[0];

    if (!category) {
        showStatus('Please select a category', 'error', uploadStatus);
        return;
    }

    if (!file) {
        showStatus('Please select a photo', 'error', uploadStatus);
        return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
        showStatus('Please select a valid image file', 'error', uploadStatus);
        return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showStatus('File size should be less than 5MB', 'error', uploadStatus);
        return;
    }

    // Read file and store as base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const photoData = {
            id: Date.now(),
            name: file.name,
            data: e.target.result,
            uploadedAt: new Date().toLocaleString()
        };

        uploadedPhotos[category].push(photoData);
        savePhotosToStorage();
        updatePhotoCounts();
        renderPhotos();

        showStatus(`✅ Photo uploaded successfully!`, 'success', uploadStatus);
        
        // Reset form
        categorySelect.value = '';
        photoInput.value = '';

        // Switch to that category view
        showCategory(category);
    };

    reader.readAsDataURL(file);
}

// Display Functions
function showStatus(message, type, element) {
    element.textContent = message;
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

    photosGrid.innerHTML = photos.map(photo => `
        <div class="bg-gray-100 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
            <div class="relative h-48 overflow-hidden bg-gray-200">
                <img src="${photo.data}" alt="${photo.name}" class="w-full h-full object-cover hover:scale-110 transition duration-300">
                <div class="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold capitalize">
                    ${photo.category}
                </div>
            </div>
            <div class="p-4">
                <p class="text-sm text-gray-600 truncate mb-2" title="${photo.name}">📁 ${photo.name}</p>
                <p class="text-xs text-gray-500 mb-3">📅 ${photo.uploadedAt}</p>
                <button onclick="deletePhoto('${photo.category}', ${photo.id})" 
                    class="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition font-semibold text-sm">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `).join('');
}

function deletePhoto(category, photoId) {
    if (confirm('Are you sure you want to delete this photo?')) {
        uploadedPhotos[category] = uploadedPhotos[category].filter(p => p.id !== photoId);
        savePhotosToStorage();
        updatePhotoCounts();
        renderPhotos();
        alert('✅ Photo deleted successfully!');
    }
}

// Storage Functions
function savePhotosToStorage() {
    localStorage.setItem('pandianPhotos', JSON.stringify(uploadedPhotos));
}

function loadPhotosFromStorage() {
    const stored = localStorage.getItem('pandianPhotos');
    if (stored) {
        uploadedPhotos = JSON.parse(stored);
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
        const category = btn.textContent.match(/wedding|reception|home|custom/i);
        if (category) {
            const catKey = category[0].toLowerCase();
            btn.textContent = btn.textContent.replace(/\(\d+\)/, `(${counts[catKey]})`);
        }
    });
}

// Allow Enter key to submit
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        if (document.getElementById('loginStep').classList.contains('hidden') === false) {
            verifyPassword();
        } else if (document.getElementById('forgotStep').classList.contains('hidden') === false) {
            verifySecurityAnswer();
        }
    }
});
