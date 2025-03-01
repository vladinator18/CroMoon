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
