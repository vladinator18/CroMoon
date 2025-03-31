document.getElementById("artworkFilter").addEventListener("change", function () {
    const selectedCategory = this.value.toLowerCase();
    const works = document.querySelectorAll(".category");

    works.forEach(work => {
        if (selectedCategory === "all" || work.querySelector("h3").textContent.toLowerCase().includes(selectedCategory)) {
            work.style.display = "block";
        } else {
            work.style.display = "none";
        }
    });
});

// Optional: Add functionality to load images from Vercel Blob if needed
function loadCategoryImages(category) {
    const gallery = JSON.parse(localStorage.getItem("gallery")) || [];
    const categoryImages = gallery.filter(img => img.tags.includes(category));
    
    // Use the categoryImages array to populate your works sections
    // This is an example and should be adapted to your HTML structure
    const categoryContainer = document.querySelector(`.category[data-category="${category}"]`);
    if (categoryContainer) {
        const imagesContainer = categoryContainer.querySelector('.images-container');
        imagesContainer.innerHTML = '';
        
        categoryImages.forEach(img => {
            const imageEl = document.createElement('img');
            imageEl.src = img.url;
            imageEl.alt = img.filename;
            imagesContainer.appendChild(imageEl);
        });
    }
}