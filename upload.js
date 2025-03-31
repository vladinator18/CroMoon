document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];
    const tagsInput = document.getElementById("imageTags");
    const tags = tagsInput.value.split(",").map(tag => tag.trim()).filter(tag => tag !== "");
    const uploadStatus = document.getElementById("uploadStatus");

    if (!file) return alert("Please select an image.");
    if (tags.length === 0) return alert("Please add at least one tag.");

    uploadStatus.innerHTML = `<span style="color:blue;">Uploading to Vercel Blob...</span>`;

    // First, get a presigned URL from the server
    try {
        // Step 1: Get a presigned URL for upload
        const presignedResponse = await fetch("/api/blob-upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                filename: file.name,
                contentType: file.type,
            }),
        });

        if (!presignedResponse.ok) throw new Error("Failed to get upload URL");
        
        const { uploadUrl, blobUrl } = await presignedResponse.json();
        
        // Step 2: Upload the file directly to the Vercel Blob storage
        const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
                "Content-Type": file.type,
            },
            body: file,
        });

        if (!uploadResponse.ok) throw new Error("Upload to Vercel Blob failed");
        
        // Step 3: Save the metadata to localStorage
        const fileData = {
            filename: file.name,
            url: blobUrl,
            tags: tags,
            uploadDate: new Date().toISOString(),
            size: file.size,
        };
        
        // Add to gallery collection
        let gallery = JSON.parse(localStorage.getItem("gallery")) || [];
        gallery.push(fileData);
        localStorage.setItem("gallery", JSON.stringify(gallery));
        
        // Update UI
        uploadStatus.innerHTML = `
            ✅ <strong>Upload Successful!</strong><br>
            📂 <strong>File Name:</strong> ${file.name} <br>
            🏷️ <strong>Tags:</strong> ${tags.join(", ")} <br>
            🔗 <strong>View File:</strong> <a href="${blobUrl}" target="_blank">Click Here</a>
        `;
        
        // Clear the form
        fileInput.value = "";
        tagsInput.value = "";
        
    } catch (error) {
        console.error("Upload error:", error);
        uploadStatus.innerHTML = `<span style="color:red;">❌ Upload failed: ${error.message}</span>`;
    }
});