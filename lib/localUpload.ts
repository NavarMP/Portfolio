import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf'];

// Get upload directory from environment, default to /var/uploads/portfolio
// This directory must be outside the project root and persists across deployments
const UPLOAD_BASE_DIR = process.env.UPLOAD_DIR || '/var/uploads/portfolio';
const MAX_FILE_SIZE_MB = parseInt(process.env.UPLOAD_MAX_SIZE_MB || '50', 10);

export type UploadType = 'image' | 'video' | 'document';

export interface LocalUploadResult {
    url: string;
    type: UploadType;
    filename: string;
}

/**
 * Sanitizes a filename for safe storage and prevents directory traversal
 * Converts: "My File (2).png" → "my-file-2.png"
 * @param originalFilename - Original filename from upload
 * @returns Safe, slug-based filename without extension
 */
export function sanitizeFilename(originalFilename: string): string {
    // Remove extension to process separately
    const lastDotIndex = originalFilename.lastIndexOf('.');
    const nameWithoutExt = lastDotIndex > 0 
        ? originalFilename.substring(0, lastDotIndex) 
        : originalFilename;

    return nameWithoutExt
        // Convert to lowercase
        .toLowerCase()
        // Replace spaces with hyphens
        .replace(/\s+/g, '-')
        // Remove any character that's not alphanumeric, hyphen, or underscore
        .replace(/[^\w\-]/g, '')
        // Replace multiple hyphens with single hyphen
        .replace(/\-+/g, '-')
        // Remove leading/trailing hyphens
        .replace(/^\-+|\-+$/g, '')
        // Limit to 50 chars for safety
        .substring(0, 50) || 'file';
}

/**
 * Validates that a resolved file path stays within the upload directory
 * Prevents directory traversal attacks (e.g., ../../../etc/passwd)
 * @param filePath - Absolute path to validate
 * @param baseDir - Base upload directory (resolved)
 * @throws Error if path escapes base directory
 */
export function validateFilePath(filePath: string, baseDir: string): void {
    const resolvedBase = path.resolve(baseDir);
    const resolvedPath = path.resolve(filePath);

    // Ensure the resolved path is within or equal to the base directory
    if (!resolvedPath.startsWith(resolvedBase + path.sep) && resolvedPath !== resolvedBase) {
        throw new Error(`Invalid file path: path traversal detected`);
    }
}

/**
 * Gets the file type from MIME type
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
 * Validates directory permissions and structure
 */
function ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        try {
            fs.mkdirSync(dirPath, { recursive: true, mode: 0o755 });
        } catch (error: any) {
            if (error.code === 'EACCES') {
                throw new Error(
                    `Permission denied creating upload directory: ${dirPath}\n` +
                    `Please ensure the directory is writable:\n` +
                    `  sudo mkdir -p ${dirPath}\n` +
                    `  sudo chown -R $USER:$USER ${dirPath}\n` +
                    `  sudo chmod 755 ${dirPath}`
                );
            }
            throw new Error(`Failed to create upload directory ${dirPath}: ${error.message}`);
        }
    }
}

/**
 * Uploads a file to local server storage
 * Uses directory from UPLOAD_DIR environment variable or /var/uploads/portfolio
 * @param file - The file object from FormData
 * @param folder - Subfolder within upload directory (e.g., 'projects', 'resume')
 * @throws Error if file type unsupported, file size exceeds limit, or write fails
 */
export async function uploadToLocal(file: File, folder: string = 'general'): Promise<LocalUploadResult> {
    // Validate file type
    const type = getFileType(file.type);
    const extension = getExtensionFromMime(file.type);
    
    // Validate file size (convert to MB)
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
        throw new Error(`File size ${fileSizeMB.toFixed(2)}MB exceeds limit of ${MAX_FILE_SIZE_MB}MB`);
    }

    // Sanitize filename and generate unique file
    const sanitizedName = sanitizeFilename(file.name);
    const uuid = randomUUID().split('-')[0];
    const timestamp = Date.now();
    const filename = `${sanitizedName}-${timestamp}-${uuid}.${extension}`;
    
    // Create directory path and validate
    const uploadDir = path.join(UPLOAD_BASE_DIR, folder);
    ensureDirectoryExists(uploadDir);
    
    const filePath = path.join(uploadDir, filename);
    
    // Security: validate path stays within upload directory
    validateFilePath(filePath, uploadDir);
    
    // Convert file to buffer and write to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    try {
        fs.writeFileSync(filePath, buffer);
    } catch (error: any) {
        throw new Error(`Failed to save file: ${error.message}`);
    }
    
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
 * @param url - The public URL path of the file to delete (e.g., /api/media/projects/file-123.jpg)
 * @param folder - The folder where the file is stored
 * @returns true if deleted successfully, false otherwise
 */
export function deleteFromLocal(url: string, folder: string): boolean {
    try {
        // Extract filename from URL
        const urlParts = url.split('/');
        const filename = urlParts[urlParts.length - 1];
        
        if (!filename || filename.length === 0) {
            console.warn('Invalid URL for deletion:', url);
            return false;
        }

        // Construct and validate file path
        const filePath = path.join(UPLOAD_BASE_DIR, folder, filename);
        
        // Security: validate path stays within upload directory
        validateFilePath(filePath, path.join(UPLOAD_BASE_DIR, folder));
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        
        console.warn('File not found for deletion:', filePath);
        return false;
    } catch (error) {
        console.error('Error deleting local file:', error);
        return false;
    }
}
