import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

// Get upload directory from environment, default to /var/uploads/portfolio
const UPLOAD_BASE_DIR = process.env.UPLOAD_DIR || '/var/uploads/portfolio';

/**
 * Validates that a resolved file path stays within the upload directory
 * Prevents directory traversal attacks (e.g., ../../../etc/passwd)
 */
function validateFilePath(filePath: string, baseDir: string): void {
    const resolvedBase = path.resolve(baseDir);
    const resolvedPath = path.resolve(filePath);

    // Ensure the resolved path is within or equal to the base directory
    if (!resolvedPath.startsWith(resolvedBase + path.sep) && resolvedPath !== resolvedBase) {
        throw new Error('Path traversal detected');
    }
}

/**
 * Maps file extensions to MIME types
 */
function getMimeType(ext: string): string {
    const mimeTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.ogg': 'video/ogg',
        '.pdf': 'application/pdf',
    };

    return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path: pathArray } = await params;
        
        // Security: reject any segment containing path traversal attempts
        if (pathArray.length === 0) {
            return new NextResponse('Invalid path', { status: 400 });
        }

        if (pathArray.some(segment => segment.includes('..') || segment === '.' || segment === '')) {
            console.warn('Potential directory traversal attempt detected');
            return new NextResponse('Invalid path', { status: 400 });
        }

        // Construct file path and validate it stays within upload directory
        const filePath = path.join(UPLOAD_BASE_DIR, ...pathArray);
        
        try {
            validateFilePath(filePath, UPLOAD_BASE_DIR);
        } catch (error: any) {
            console.warn('Path validation failed:', error.message);
            return new NextResponse('Access denied', { status: 403 });
        }

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return new NextResponse('File not found', { status: 404 });
        }

        // Verify it's a file, not a directory
        const stat = fs.statSync(filePath);
        if (!stat.isFile()) {
            return new NextResponse('Not a file', { status: 400 });
        }

        // Read and serve the file
        const fileBuffer = await readFile(filePath);
        const filename = pathArray[pathArray.length - 1];
        const ext = path.extname(filename);
        const contentType = getMimeType(ext);

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Length': fileBuffer.length.toString(),
                'Cache-Control': 'public, max-age=31536000, immutable',
                'X-Content-Type-Options': 'nosniff',
            },
        });
    } catch (error: any) {
        console.error('Error serving media:', error);
        
        // Don't expose internal error details to client
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
