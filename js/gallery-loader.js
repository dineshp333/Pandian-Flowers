// Load and display uploaded photos in gallery
document.addEventListener('DOMContentLoaded', function() {
    loadUploadedPhotos();
});

function loadUploadedPhotos() {
    const stored = localStorage.getItem('pandianPhotos');
    if (!stored) return;

    const uploadedPhotos = JSON.parse(stored);
    const galleryGrid = document.querySelector('.grid[style*="grid-cols"]') || document.querySelector('.grid.grid-cols-1');
    
    if (!galleryGrid) return;

    // Create container for uploaded photos
    const uploadedContainer = document.createElement('div');
    uploadedContainer.id = 'uploadedPhotosSection';
    uploadedContainer.className = 'hidden';

    // Map category names
    const categoryMap = {
        wedding: 'wedding',
        reception: 'reception',
        home: 'nilavu',
        custom: 'custom'
    };

    let totalPhotos = 0;

    // Add uploaded photos to gallery
    Object.keys(uploadedPhotos).forEach(category => {
        const photos = uploadedPhotos[category];
        if (photos.length > 0) {
            photos.forEach(photo => {
                const galleryItem = document.createElement('div');
                galleryItem.className = `gallery-item bg-white rounded-lg shadow-lg overflow-hidden card-hover relative`;
                galleryItem.setAttribute('data-category', categoryMap[category]);

                galleryItem.innerHTML = `
                    <div class='relative h-72 overflow-hidden bg-gray-200'>
                        <img src='${photo.data}' alt='${photo.name}' class='w-full h-full object-cover'>
                    </div>
                    <div class='gallery-overlay'>
                        <h3 class='text-2xl font-bold mb-2'>Your Photo</h3>
                        <p class='mb-4 text-sm'>Uploaded ${photo.uploadedAt}</p>
                        <a href='order.html' class='btn-primary'>Order Now</a>
                    </div>
                    <div class='p-4'>
                        <h3 class='font-bold text-green-800 truncate'>${photo.name}</h3>
                        <p class='text-sm text-gray-600 capitalize'>${category} Garland</p>
                    </div>
                `;

                galleryGrid.appendChild(galleryItem);
                totalPhotos++;
            });
        }
    });

    // Re-initialize filter buttons
    if (totalPhotos > 0) {
        setTimeout(() => {
            initGalleryFilters();
        }, 100);
    }
}

function initGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}
