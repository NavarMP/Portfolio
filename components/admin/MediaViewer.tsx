"use client";

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2 } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface MediaViewerProps {
    type: string;
    url: string;
    className?: string;
}

export default function MediaViewer({ type, url, className = "" }: MediaViewerProps) {
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState(true);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setLoading(false);
    }

    if (type === 'video') {
        return (
            <video src={url} className={className} controls muted />
        );
    }

    if (type === 'document') {
        return (
            <div className={`relative overflow-auto bg-white flex justify-center items-start ${className}`} style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="min-w-fit">
                    <Document
                        file={url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div className="flex justify-center items-center h-full p-4">
                                <Loader2 className="animate-spin text-primary" size={24} />
                            </div>
                        }
                    >
                        {Array.from({ length: numPages || 1 }, (_, i) => (
                            <Page
                                key={`page_${i + 1}`}
                                pageNumber={i + 1}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                className="mb-4 shadow-md max-w-full"
                                width={typeof window !== 'undefined' ? Math.min(window.innerWidth - 64, 800) : 800}
                            />
                        ))}
                    </Document>
                </div>
            </div>
        );
    }

    // Default to image
    return (
        <img src={url} alt="Media Preview" className={className} />
    );
}
