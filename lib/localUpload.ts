import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf'];

export type UploadType = 'image' | 'video' | 'document';

export interface LocalUploadResult {
    url: string;
    type: UploadType;
    filename: string;
}

/**
 * Determines the file type based on MIME type
 */
export function getFileType(mimeType: string): UploadType {
    if (ALLOWED_IMAGE_TYPES.includes(mimeType)) return 'image';
    if (ALLOWED_VIDEO_TYPES.includes(mimeType)) return 'video';
    if (ALLOWED_DOCUMENT_TYPES.includes(mimeType)) return 'document';
    throw new Error(`Unsupported file type: ${mimeType}`);
}

/**
 * Gets the file extension from MIME type
 */
export function getExtensionFromMime(mimeType: string): string {
    const extensions: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
        'video/mp4': 'mp4',
        'video/webm': 'webm',
        'video/ogg': 'ogg',
        'application/pdf': 'pdf',
    };
    return extensions[mimeType] || 'bin';
}

/**
 * Creates the upload directory if it doesn't exist
 */
function ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * Uploads a file to local server storage
 * @param file - The file object from FormData
 * @param folder - Subfolder within public/assets (e.g., 'projects', 'resume')
 */
export async function uploadToLocal(file: File, folder: string = 'general'): Promise<LocalUploadResult> {
    const type = getFileType(file.type);
    const extension = getExtensionFromMime(file.type);
    
    // Generate unique filename: timestamp-uuid.extension
    const uuid = randomUUID().split('-')[0];
    const timestamp = Date.now();
    const filename = `${timestamp}-${uuid}.${extension}`;
    
    // Create directory path: public/assets/{folder}
    const publicDir = path.join(process.cwd(), 'public', 'assets', folder);
    ensureDirectoryExists(publicDir);
    
    const filePath = path.join(publicDir, filename);
    
    // Convert file to buffer and write to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    fs.writeFileSync(filePath, buffer);
    
    // Return the API URL path
    const url = `/api/media/${folder}/${filename}`;
    
    return {
        url,
        type,
        filename,
    };
}

/**
 * Deletes a file from local storage
 * @param url - The public URL path of the file to delete
 * @param folder - The folder where the file is stored
 */
export function deleteFromLocal(url: string, folder: string): boolean {
    try {
        // Extract filename from URL
        const filename = url.split('/').pop();
        if (!filename) return false;
        
        const filePath = path.join(process.cwd(), 'public', 'assets', folder, filename);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting local file:', error);
        return false;
    }
}

/**
 * Checks if local storage is properly configured
 */
export function isLocalStorageConfigured(): boolean {
    const publicDir = path.join(process.cwd(), 'public');
    return fs.existsSync(publicDir) && fs.statSync(publicDir).isDirectory();
}
