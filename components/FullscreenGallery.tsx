"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface MediaItem {
    type: string;
    url: string;
}

interface FullscreenGalleryProps {
    media: MediaItem[];
    projectTitle: string;
}

export default function FullscreenGallery({ media, projectTitle }: FullscreenGalleryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openGallery = (index: number) => {
        setCurrentIndex(index);
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeGallery = useCallback(() => {
        setIsOpen(false);
        document.body.style.overflow = 'auto';
    }, []);

    const nextMedia = useCallback((e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % media.length);
    }, [media.length]);

    const prevMedia = useCallback((e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    }, [media.length]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === "Escape") closeGallery();
            if (e.key === "ArrowRight") nextMedia();
            if (e.key === "ArrowLeft") prevMedia();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, closeGallery, nextMedia, prevMedia]);

    if (!media || media.length === 0) return null;

    return (
        <div>
            {/* Gallery Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {media.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => openGallery(index)}
                        className="relative aspect-video rounded-3xl overflow-hidden bg-surface-variant/20 border border-outline/10 group shadow-lg cursor-pointer"
                    >
                        {item.type === 'video' ? (
                            <video
                                src={item.url}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Image
                                src={item.url}
                                alt={`${projectTitle} - Gallery item ${index + 1}`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                            />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                <Maximize2 size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Fullscreen Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col pt-safe animate-fade-in" onClick={closeGallery}>
                    {/* Top Bar Navigation */}
                    <div className="flex justify-between items-center p-4 md:p-6 text-white absolute top-0 w-full z-10 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
                        <span className="text-sm font-medium opacity-70 pointer-events-auto">
                            {currentIndex + 1} / {media.length}
                        </span>
                        <button 
                            onClick={closeGallery}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors pointer-events-auto"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Main Media Content */}
                    <div className="flex-1 relative flex items-center justify-center p-4 md:p-16 h-full overflow-hidden" onClick={closeGallery}>
                        <div 
                            className="relative w-full h-full max-w-7xl max-h-[85vh] flex items-center justify-center" 
                            onClick={(e) => e.stopPropagation()}
                        >
                            {media[currentIndex].type === 'video' ? (
                                <video
                                    src={media[currentIndex].url}
                                    controls
                                    autoPlay
                                    playsInline
                                    className="max-w-full max-h-full rounded-lg shadow-2xl object-contain"
                                />
                            ) : (
                                <img
                                    src={media[currentIndex].url}
                                    alt="Fullscreen Preview"
                                    className="max-w-full max-h-full rounded-lg shadow-2xl object-contain animate-scale-in"
                                />
                            )}
                        </div>

                        {/* Side Navigation Arrows (Desktop) */}
                        {media.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevMedia(); }}
                                    className="absolute left-4 md:left-8 p-4 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white rounded-full transition-all hover:scale-110 active:scale-95 z-20"
                                >
                                    <ChevronLeft size={32} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextMedia(); }}
                                    className="absolute right-4 md:right-8 p-4 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white rounded-full transition-all hover:scale-110 active:scale-95 z-20"
                                >
                                    <ChevronRight size={32} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
