document.addEventListener("DOMContentLoaded", () => {
    const galleryContainer = document.querySelector(".image-gallery");
    const searchInput = document.getElementById("searchInput");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    let gallery = JSON.parse(localStorage.getItem("gallery")) || [];
    let currentPage = 1;
    const imagesPerPage = 6;

    function renderGallery(filteredGallery = gallery) {
        galleryContainer.innerHTML = "";

        const startIndex = (currentPage - 1) * imagesPerPage;
        const paginatedGallery = filteredGallery.slice(startIndex, startIndex + imagesPerPage);

        if (paginatedGallery.length === 0) {
            galleryContainer.innerHTML = "<p>No images found.</p>";
            return;
        }

        paginatedGallery.forEach(image => {
            const imageElement = document.createElement("div");
            imageElement.classList.add("gallery-item");
            imageElement.innerHTML = `
                <img src="${image.url}" alt="${image.filename}">
                <p><strong>${image.filename}</strong></p>
                <p>Tags: ${image.tags.join(", ")}</p>
                <p>${new Date(image.uploadDate).toLocaleString()}</p>
                <button class="delete-btn" data-blob-url="${image.url}">Delete</button>
            `;
            galleryContainer.appendChild(imageElement);
        });

        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const blobUrl = this.getAttribute('data-blob-url');
                if (confirm('Are you sure you want to delete this image?')) {
                    try {
                        // Send delete request to Vercel Blob API
                        const response = await fetch('/api/delete-blob', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ url: blobUrl })
                        });
                        
                        if (response.ok) {
                            // Remove from local storage
                            gallery = gallery.filter(item => item.url !== blobUrl);
                            localStorage.setItem("gallery", JSON.stringify(gallery));
                            renderGallery(); // Re-render gallery
                        } else {
                            alert('Failed to delete image.');
                        }
                    } catch (error) {
                        console.error('Error deleting image:', error);
                        alert('Error deleting image. Please try again.');
                    }
                }
            });
        });

        updatePaginationButtons(filteredGallery.length);
    }

    function updatePaginationButtons(totalItems) {
        prevBtn.style.display = currentPage > 1 ? "block" : "none";
        nextBtn.style.display = currentPage * imagesPerPage < totalItems ? "block" : "none";
    }

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filteredGallery = gallery.filter(item =>
            item.tags.some(tag => tag.toLowerCase().includes(query))
        );
        currentPage = 1; // Reset to first page on new search
        renderGallery(filteredGallery);
    });

    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderGallery();
        }
    });

    nextBtn.addEventListener("click", () => {
        if (currentPage * imagesPerPage < gallery.length) {
            currentPage++;
            renderGallery();
        }
    });

    renderGallery();
});