import { put } from "@vercel/blob";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const file = req.body.file; // File data (base64, buffer, etc.)
        if (!file) {
            return res.status(400).json({ error: "No file provided" });
        }

        // Upload to Vercel Blob
        const { url } = await put(`uploads/${Date.now()}-${file.name}`, file, {
            access: "public", // Set 'private' if you don't want public access
        });

        return res.status(200).json({ url });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
