import imageCompression from 'browser-image-compression';

export async function compressImage(
    file: File, 
    options: { compress: boolean; convertToWebp: boolean } = { compress: true, convertToWebp: true }
): Promise<File> {
    if (!options.compress && !options.convertToWebp) {
        return file;
    }

    const compressionOptions: any = {
        maxSizeMB: 2, // Increased target size to retain more quality
        maxWidthOrHeight: 1920,
        initialQuality: 0.85, // Retain 85% starting quality
        useWebWorker: true,
    };

    if (options.convertToWebp) {
        compressionOptions.fileType = 'image/webp' as any;
    }

    try {
        let compressedBlob: Blob = file;
        
        if (options.compress || options.convertToWebp) {
           compressedBlob = await imageCompression(file, compressionOptions);
        }
        
        const fileExtension = options.convertToWebp ? '.webp' : `.${file.name.split('.').pop()}`;
        const targetType = options.convertToWebp ? 'image/webp' : file.type;

        return new File(
            [compressedBlob], 
            file.name.replace(/\.[^/.]+$/, "") + fileExtension, 
            { type: targetType }
        );
    } catch (error) {
        console.error("Error processing image:", error);
        return file; // Return original if compression fails
    }
}
