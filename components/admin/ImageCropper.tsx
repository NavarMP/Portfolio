"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, Check } from "lucide-react";
import getCroppedImg from "@/lib/cropImageUtil";

interface ImageCropperProps {
    imageSrc: string;
    onCropComplete: (croppedFile: File) => void;
    onCancel: () => void;
    aspectRatio?: number;
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel, aspectRatio = 16 / 9 }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleConfirm = async () => {
        if (!croppedAreaPixels) return;
        setIsProcessing(true);
        try {
            const fileName = `cropped-${Date.now()}.jpg`;
            const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, 0, fileName);
            if (croppedFile) {
                onCropComplete(croppedFile);
            }
        } catch (error) {
            console.error("Failed to crop image:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 pt-safe">
            <div className="bg-surface w-full max-w-3xl rounded-3xl overflow-hidden flex flex-col shadow-2xl h-[85vh] sm:h-auto sm:max-h-[90vh]">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-outline/10">
                    <div>
                        <h3 className="text-xl font-bold font-display text-on-surface">Crop Image</h3>
                        <p className="text-sm text-on-surface-variant max-w-sm">Drag to reposition. The frame shows the exact aspect ratio that will be used.</p>
                    </div>
                    <button 
                        onClick={onCancel}
                        disabled={isProcessing}
                        className="p-2 sm:p-3 bg-surface-variant/20 hover:bg-surface-variant/50 rounded-full transition-colors text-on-surface-variant disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="relative flex-1 w-full min-h-[40vh] sm:min-h-[500px] bg-black/5">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio}
                        onCropChange={setCrop}
                        onCropComplete={handleCropComplete}
                        onZoomChange={setZoom}
                        classes={{
                            containerClassName: 'w-full h-full',
                            mediaClassName: 'max-w-full max-h-full'
                        }}
                    />
                </div>
                
                <div className="p-4 sm:p-6 border-t border-outline/10 bg-surface flex flex-col sm:flex-row items-center gap-4 justify-between">
                    <div className="w-full sm:w-1/2 flex items-center gap-4">
                        <span className="text-sm font-medium text-on-surface whitespace-nowrap">Zoom</span>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-2 bg-surface-variant/30 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                        <button
                            onClick={onCancel}
                            disabled={isProcessing}
                            className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-outline/20 text-on-surface font-semibold hover:bg-surface-variant/20 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isProcessing}
                            className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-primary text-on-primary font-bold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isProcessing ? (
                                <span className="animate-pulse">Processing...</span>
                            ) : (
                                <>
                                    <Check size={20} /> Apply Crop
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
