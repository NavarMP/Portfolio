"use client";

import { useState, useRef, DragEvent } from "react";
import { UploadCloud, Link as LinkIcon, Loader2, Plus, Crop, HardDrive } from "lucide-react";
import { compressImage } from "@/lib/compressImage";
import ImageCropper from "./ImageCropper";

interface MediaUploaderProps {
    onUploadComplete: (media: { type: 'image' | 'video' | 'document', url: string }[]) => void;
    multiple?: boolean;
    compressOptions?: { compress: boolean; convertToWebp: boolean };
    title?: string;
    description?: string;
    folder?: string;
    cropRatio?: number;
}

export default function MediaUploader({ 
    onUploadComplete, 
    multiple = false, 
    compressOptions = { compress: true, convertToWebp: true },
    title = "Upload Media",
    description = "Drag & drop files or click to browse",
    folder = "navarmp-project-media",
    cropRatio
}: MediaUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [urlInput, setUrlInput] = useState("");
    
    // Crop state
    const [pendingCropFile, setPendingCropFile] = useState<{ file: File, url: string } | null>(null);
    const [isCropping, setIsCropping] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            await processFiles(multiple ? files : [files[0]]);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const firstFile = files[0];
            if (cropRatio && firstFile.type.startsWith('image/')) {
                // If crop requested, only handle the first image
                setPendingCropFile({
                    file: firstFile,
                    url: URL.createObjectURL(firstFile)
                });
                setIsCropping(true);
            } else {
                await processFiles(multiple ? files : [firstFile]);
            }
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleCropComplete = async (croppedFile: File) => {
        setIsCropping(false);
        if (pendingCropFile) {
            URL.revokeObjectURL(pendingCropFile.url);
        }
        setPendingCropFile(null);
        await processFiles([croppedFile]);
    };

    const handleCropCancel = () => {
        setIsCropping(false);
        if (pendingCropFile) {
            URL.revokeObjectURL(pendingCropFile.url);
        }
        setPendingCropFile(null);
    };

    const processFiles = async (files: File[]) => {
        setIsUploading(true);
        const results: { type: 'image' | 'video' | 'document', url: string }[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                let file = files[i];

                if (file.type.startsWith('image/')) {
                    file = await compressImage(file, compressOptions);
                }

                const formDataVal = new FormData();
                formDataVal.append("file", file);
                formDataVal.append("folder", folder);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formDataVal,
                });

                if (res.ok) {
                    const data = await res.json();
                    let type: 'image' | 'video' | 'document' = 'image';
                    if (file.type.startsWith('video/')) type = 'video';
                    else if (file.type === 'application/pdf') type = 'document';

                    results.push({ type, url: data.url });
                }
            }

            if (results.length > 0) {
                onUploadComplete(results);
            }
        } catch (error) {
            console.error("Error uploading media:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddUrl = () => {
        if (!urlInput.trim()) return;
        
        let type: 'image' | 'video' | 'document' = 'image';
        if (urlInput.match(/\.(mp4|webm|ogg)$/i)) type = 'video';
        else if (urlInput.match(/\.pdf$/i)) type = 'document';

        onUploadComplete([{ type, url: urlInput.trim() }]);
        setUrlInput("");
    };

    return (
        <div className="space-y-4">
            <div 
                className={`relative w-full rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 text-center cursor-pointer overflow-hidden group
                    ${isDragging ? 'border-primary bg-primary/10' : 'border-outline/20 bg-surface-variant/5 hover:bg-surface-variant/10 hover:border-primary/50'}
                    ${isUploading ? 'pointer-events-none opacity-70' : ''}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    multiple={multiple} 
                    accept="image/*,video/*,application/pdf"
                    onChange={handleFileSelect}
                />
                
                {isUploading ? (
                    <div className="flex flex-col items-center text-primary relative z-10">
                        <Loader2 className="w-12 h-12 animate-spin mb-4" />
                        <h4 className="text-lg font-bold">Uploading...</h4>
                        <p className="text-sm opacity-80 mt-1">Please wait while files are processed.</p>
                    </div>
                ) : (
                    <div className="relative z-10 flex flex-col items-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 ${isDragging ? 'scale-110 bg-primary text-on-primary shadow-lg' : 'bg-surface shadow-sm text-primary group-hover:scale-110 group-hover:text-primary'}`}>
                            <UploadCloud size={28} />
                        </div>
                        <h4 className="text-lg font-bold text-on-surface mb-1">{title}</h4>
                        <p className="text-sm text-on-surface-variant mb-5">{description}</p>
                        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-on-surface-variant px-3 py-1.5 bg-surface-variant/20 rounded-lg border border-outline/5 font-medium">
                            <span><b>Supported:</b></span>
                            <span>Images (JPG, PNG, WebP)</span>
                            <span>•</span>
                            <span>Videos (MP4, WebM)</span>
                            <span>•</span>
                            <span>Docs (PDF)</span>
                        </div>
                    </div>
                )}
                
                {/* Drag over overlay */}
                <div className={`absolute inset-0 bg-primary/5 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-none ${isDragging ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-50">
                        <LinkIcon size={18} />
                    </div>
                    <input 
                        type="url" 
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="Or provide a direct URL link..."
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-variant/30 border border-outline/20 focus:border-primary outline-none transition-colors text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
                    />
                </div>
                <button 
                    type="button" 
                    onClick={handleAddUrl}
                    disabled={!urlInput.trim() || isUploading}
                    className="px-5 py-3 bg-primary text-on-primary text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <Plus size={18} /> Add
                </button>
            </div>

            {/* Cropper Modal */}
            {isCropping && pendingCropFile && cropRatio && (
                <ImageCropper
                    imageSrc={pendingCropFile.url}
                    aspectRatio={cropRatio}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}
        </div>
    );
}
