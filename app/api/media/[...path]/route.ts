import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path: pathArray } = await params;
        
        if (pathArray.some(segment => segment.includes('..'))) {
            return new NextResponse('Invalid path', { status: 400 });
        }

        const filePath = path.join(process.cwd(), 'public', 'assets', ...pathArray);

        if (!fs.existsSync(filePath)) {
            return new NextResponse('File not found', { status: 404 });
        }

        const fileBuffer = await readFile(filePath);
        const filename = pathArray[pathArray.length - 1];
        const ext = path.extname(filename).toLowerCase();
        let contentType = 'application/octet-stream';

        switch (ext) {
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.gif':
                contentType = 'image/gif';
                break;
            case '.svg':
                contentType = 'image/svg+xml';
                break;
            case '.webp':
                contentType = 'image/webp';
                break;
            case '.mp4':
                contentType = 'video/mp4';
                break;
            case '.webm':
                contentType = 'video/webm';
                break;
            case '.pdf':
                contentType = 'application/pdf';
                break;
        }

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error serving media:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
