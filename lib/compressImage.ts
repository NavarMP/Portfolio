import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<File> {
    const options = {
        maxSizeMB: 1, // Target size up to 1MB
        maxWidthOrHeight: 1920, // Reasonable max dimension for web content
        useWebWorker: true,
        fileType: 'image/webp' as any, // Convert to WebP format
    };
    
    try {
        const compressedBlob = await imageCompression(file, options);
        return new File([compressedBlob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
            type: 'image/webp'
        });
    } catch (error) {
        console.error("Error compressing image:", error);
        return file; // Return original if compression fails
    }
}
