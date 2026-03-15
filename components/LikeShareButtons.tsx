"use client";

import { useState, useEffect, useRef } from "react";
import { Heart, Share2, Check, Link as LinkIcon, Twitter, Linkedin, Facebook } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

interface LikeShareButtonsProps {
    projectId: string;
    initialLikes: number;
}

export default function LikeShareButtons({ projectId, initialLikes }: LikeShareButtonsProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isShared, setIsShared] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Hydrate from localStorage on mount
        const likedProjects = JSON.parse(localStorage.getItem('liked_projects') || '[]');
        if (likedProjects.includes(projectId)) {
            setIsLiked(true);
        }
        
        // Close menu on click outside
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowShareMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [projectId]);

    const handleLike = async () => {
        if (isLoading) return;
        setIsLoading(true);
        
        const action = isLiked ? 'unlike' : 'like';

        try {
            const res = await fetch(`/api/projects/${projectId}/like`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });

            if (res.ok) {
                const data = await res.json();
                setLikes(data.likes);
                
                const likedProjects = JSON.parse(localStorage.getItem('liked_projects') || '[]');
                if (action === 'like') {
                    setIsLiked(true);
                    if (!likedProjects.includes(projectId)) {
                        localStorage.setItem('liked_projects', JSON.stringify([...likedProjects, projectId]));
                    }
                } else {
                    setIsLiked(false);
                    localStorage.setItem('liked_projects', JSON.stringify(likedProjects.filter((id: string) => id !== projectId)));
                }
            }
        } catch (error) {
            console.error("Failed to like project:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setIsShared(true);
            setTimeout(() => {
                setIsShared(false);
                setShowShareMenu(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy URL:", error);
        }
    };

    const shareOptions = [
        {
            name: "Copy Link",
            icon: LinkIcon,
            action: handleCopy,
        },
        {
            name: "X (Twitter)",
            icon: Twitter,
            action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(document.title)}`, '_blank'),
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank'),
        },
        {
            name: "WhatsApp",
            icon: FaWhatsapp,
            action: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(document.title + " " + window.location.href)}`, '_blank'),
        },
        {
            name: "Facebook",
            icon: Facebook,
            action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank'),
        }
    ];

    return (
        <div className="flex flex-wrap gap-4 mt-8 relative">
            <button
                onClick={handleLike}
                disabled={isLoading}
                className={`px-8 py-4 rounded-full font-bold shadow-sm transition-all flex items-center gap-2 ${
                    isLiked 
                        ? 'bg-red-500/10 text-red-500 border-2 border-red-500 cursor-default' 
                        : 'bg-surface border-2 border-outline text-on-surface hover:border-red-500 hover:text-red-500'
                }`}
            >
                <Heart size={20} className={isLiked ? "fill-current" : ""} />
                {likes > 0 ? `${likes} Likes` : 'Like Project'}
            </button>
            
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="px-8 py-4 rounded-full bg-surface border-2 border-outline text-on-surface font-medium hover:border-primary transition-all flex items-center gap-2"
                >
                    {isShared ? (
                        <>
                            <Check size={20} className="text-green-500" />
                            <span className="text-green-500">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Share2 size={20} />
                            Share
                        </>
                    )}
                </button>

                {showShareMenu && (
                    <div className="absolute top-full mt-2 left-0 md:left-auto md:right-0 bg-surface border border-outline rounded-2xl shadow-2xl overflow-hidden min-w-[200px] animate-fade-in z-50 flex flex-col py-2">
                        {shareOptions.map((option, idx) => {
                            const Icon = option.icon;
                            return (
                                <button
                                    key={idx}
                                    onClick={option.action}
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-on-surface hover:bg-surface-variant transition-colors w-full text-left"
                                >
                                    <Icon size={18} className="text-on-surface-variant" />
                                    <span className="font-medium">{option.name}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
