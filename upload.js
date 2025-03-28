document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = document.getElementById("imageInput").files[0];
    const selectedTags = Array.from(document.querySelectorAll('.tag-options input:checked'))
                              .map(tag => tag.value);
    const description = document.getElementById("imageDescription").value.trim();

    if (!file) return alert("Please select an image.");
    if (selectedTags.length === 0) return alert("Please select at least one tag.");

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);

    try {
        // Replace 'YOUR_VERCEL_BLOB_API_URL' with your actual Vercel Blob API endpoint
        const response = await fetch('https://api.vercel.com/v1/blobs', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer vercel_blob_rw_lsbf4oLjsAQe7N19_nZDEs0F1b6HtjKWGVj3VhHrS4hLW4W` // Your token here
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload file');
        }

        const fileURL = await response.json(); // Assuming the response contains the file URL

        const fileData = {
            filename: file.name,
            tags: selectedTags,
            description: description || "No description",
            uploadDate: new Date().toISOString(),
            url: fileURL // Adjust this based on the actual response structure
        };

        let gallery = JSON.parse(localStorage.getItem("gallery")) || [];
        gallery.push(fileData);
        localStorage.setItem("gallery", JSON.stringify(gallery));

        document.getElementById("uploadStatus").innerText = "Upload successful!";
    } catch (error) {
        console.error(error);
        alert("An error occurred during the upload. Please try again.");
    }
});