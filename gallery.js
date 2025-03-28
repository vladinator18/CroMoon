document.addEventListener("DOMContentLoaded", () => {
    const galleryContainer = document.querySelector(".image-gallery");
    const searchInput = document.getElementById("searchInput");

    function displayImages(filter = "") {
        galleryContainer.innerHTML = "";
        let images = JSON.parse

        if (filter) {
            images = images.filter(img => img.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase())));
        }

        images.forEach(img => {
            const imgElement = document.createElement("img");
            imgElement.src = img.url;
            imgElement.alt = img.description || "Uploaded image";
            galleryContainer.appendChild(imgElement);
        });
    }

    searchInput.addEventListener("input", () => {
        displayImages(searchInput.value);
    });

    displayImages();
});

