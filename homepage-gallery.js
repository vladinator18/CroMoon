document.addEventListener("DOMContentLoaded", () => {
    let gallery = JSON.parse(localStorage.getItem("gallery")) || [];
    const recentGallery = document.querySelector(".recent-images");
    const filterSelect = document.getElementById("filterRecent");

    function displayRecentWorks(filterTag = "all") {
        recentGallery.innerHTML = "";
        let filteredGallery = filterTag === "all"
            ? gallery
            : gallery.filter(img => img.tags.includes(filterTag));

        let recentImages = filteredGallery.slice(-3).reverse();

        recentImages.forEach(img => {
            const imgElement = document.createElement("img");
            imgElement.src = img.url;
            imgElement.alt = img.filename;
            imgElement.classList.add("homepage-image");
            recentGallery.appendChild(imgElement);
        });
    }

    filterSelect.addEventListener("change", (e) => {
        displayRecentWorks(e.target.value);
    });

    displayRecentWorks();
});
