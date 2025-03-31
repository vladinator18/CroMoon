// api/blob-upload.js - This file should be placed in your Vercel API routes
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename, contentType } = req.body;

    // Generate a unique filename to prevent collisions
    const uniqueFilename = `${uuidv4()}-${filename}`;
    
    // Get a presigned URL for client-side upload
    const { url: uploadUrl, blob } = await put(uniqueFilename, {
      access: 'public',
      contentType: contentType,
    });

    return res.status(200).json({
      uploadUrl,
      blobUrl: blob.url,
    });
  } catch (error) {
    console.error('Error in blob-upload route:', error);
    return res.status(500).json({ error: 'Failed to create upload URL' });
  }
}