document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];
    const uploadStatus = document.getElementById("uploadStatus");

    if (!file) return alert("Please select an image.");

    uploadStatus.innerHTML = `<span style="color:blue;">Uploading...</span>`;

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const data = await response.json();
        uploadStatus.innerHTML = `
            ✅ <strong>Upload Successful!</strong><br>
            📂 <strong>File Name:</strong> ${file.name} <br>
            🔗 <strong>View File:</strong> <a href="${data.url}" target="_blank">Click Here</a>
        `;
    } catch (error) {
        uploadStatus.innerHTML = `<span style="color:red;">❌ Upload failed. Please try again.</span>`;
    }
});
