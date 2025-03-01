import { storage, ref, uploadBytes, getDownloadURL } from "./firebase-config.js";

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = document.getElementById("imageInput").files[0];
    const selectedTags = Array.from(document.querySelectorAll('.tag-options input:checked'))
                              .map(tag => tag.value);
    const description = document.getElementById("imageDescription").value.trim();

    if (!file) return alert("Please select an image.");
    if (selectedTags.length === 0) return alert("Please select at least one tag.");

    const storageRef = ref(storage, `uploads/${file.name}`);
    await uploadBytes(storageRef, file);
    const fileURL = await getDownloadURL(storageRef);

    const fileData = {
        filename: file.name,
        tags: selectedTags,
        description: description || "No description",
        uploadDate: new Date().toISOString(),
        url: fileURL
    };

    let gallery = JSON.parse(localStorage.getItem("gallery")) || [];
    gallery.push(fileData);
    localStorage.setItem("gallery", JSON.stringify(gallery));

    document.getElementById("uploadStatus").innerText = "Upload successful!";
});
