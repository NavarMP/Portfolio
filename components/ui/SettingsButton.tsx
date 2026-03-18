"use client";

import { useState, useEffect, useRef } from "react";
import { HiCog } from "react-icons/hi";
import { gsap } from "gsap";

export function SettingsButton() {
    const [isVisible, setIsVisible] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!buttonRef.current) return;
        
        if (isHovered) {
            gsap.to(buttonRef.current, { rotation: 360, duration: 0.5, ease: "power2.out" });
        }
    }, [isHovered]);

    const handleClick = () => {
        document.dispatchEvent(new CustomEvent("openSettings"));
    };

    return (
        <button
            ref={buttonRef}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`fixed top-20 right-4 z-50 p-3 rounded-full backdrop-blur-xl shadow-lg border border-white/10 transition-all duration-300 ${
                isVisible 
                    ? "opacity-100 translate-x-0" 
                    : "opacity-0 translate-x-4 pointer-events-none"
            }`}
            style={{ background: 'rgba(255, 255, 255, 0.1)' }}
            aria-label="Open Settings"
            title="Settings"
        >
            <HiCog className="w-5 h-5 text-white/80" />
        </button>
    );
}
