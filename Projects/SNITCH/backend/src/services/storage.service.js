import ImageKit from '@imagekit/nodejs';
import { config } from '../config/config.js';

const client = new ImageKit({
  privateKey: config.IMAGE_KIT_KEY,
});

export async function uploadImageToStorage({ buffer, filename, folder = 'products' }) {
    try {
        const response = await client.files.upload({
            file: await ImageKit.toFile(buffer, filename), // ✅ filename add kiya
            fileName: filename,  // ✅ camelCase
            folder,
        });
        return response.url; // ✅ sirf URL return karo
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
    }
}