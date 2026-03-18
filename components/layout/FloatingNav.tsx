"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/dist/Draggable";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    HiHome,
    HiDocumentText,
    HiBriefcase,
    HiColorSwatch,
    HiUser,
    HiMail,
    HiSearch,
} from "react-icons/hi";

gsap.registerPlugin(Draggable);

type NavPosition = "left" | "right" | "top" | "bottom";

const navLinks = [
    { href: "/", label: "Home", icon: HiHome },
    // { href: "/resume", label: "Resume", icon: HiDocumentText },
    { href: "/work", label: "Portfolio", icon: HiBriefcase },
    { href: "/services", label: "Services", icon: HiColorSwatch },
    { href: "/about", label: "About", icon: HiUser },
    { href: "/contact", label: "Contact", icon: HiMail },
];

export function FloatingNav() {
    const navRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<NavPosition>("left");
    const pathname = usePathname();
    const [isMobile, setIsMobile] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Auto-hide on scroll
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                // Scrolling down
                setIsVisible(false);
            } else {
                // Scrolling up
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Initialize position from localStorage
    useEffect(() => {
        const savedPosition = localStorage.getItem("navPosition") as NavPosition;

        if (savedPosition) {
            setPosition(savedPosition);
        } else {
            // Default: left for desktop, bottom for mobile
            setPosition(isMobile ? "bottom" : "left");
        }
    }, [isMobile]);

    // Apply position styling and visibility
    useEffect(() => {
        if (!navRef.current) return;

        const nav = navRef.current;

        // Reset positioning
        gsap.set(nav, { clearProps: "all" });

        // Apply visibility transition
        gsap.to(nav, {
            opacity: isVisible ? 1 : 0,
            pointerEvents: isVisible ? "auto" : "none",
            duration: 0.3,
        });

        // Apply new position
        switch (position) {
            case "left":
                gsap.set(nav, {
                    left: "1rem",
                    top: "50%",
                    y: "-50%",
                    x: 0,
                });
                break;
            case "right":
                gsap.set(nav, {
                    right: "1rem",
                    top: "50%",
                    y: "-50%",
                    x: 0,
                    left: "auto",
                });
                break;
            case "top":
                gsap.set(nav, {
                    top: "1rem",
                    left: "50%",
                    x: "-50%",
                    y: 0,
                });
                break;
            case "bottom":
                gsap.set(nav, {
                    bottom: "1rem",
                    left: "50%",
                    x: "-50%",
                    y: 0,
                    top: "auto",
                });
                break;
        }
    }, [position, isVisible]);

    // Setup drag functionality
    useEffect(() => {
        if (!navRef.current) return;

        const nav = navRef.current;
        let dragInstance: Draggable[];

        dragInstance = Draggable.create(nav, {
            type: "x,y",
            bounds: "body",
            allowEventDefault: true,
            dragClickables: false,
            onDragEnd: function () {
                const rect = nav.getBoundingClientRect();
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                // Determine closest edge
                const distances = {
                    left: rect.left,
                    right: windowWidth - rect.right,
                    top: rect.top,
                    bottom: windowHeight - rect.bottom,
                };

                const closest = Object.entries(distances).reduce((a, b) =>
                    a[1] < b[1] ? a : b
                )[0] as NavPosition;

                setPosition(closest);
                localStorage.setItem("navPosition", closest);
            },
        });

        return () => {
            dragInstance.forEach((d) => d.kill());
        };
    }, []);

    const isVertical = position === "left" || position === "right";

    const handleSearchClick = () => {
        if (typeof window !== "undefined" && (window as any).openSearch) {
            (window as any).openSearch();
        }
    };

    return (
        <nav
            ref={navRef}
            className={`fixed z-50 glass backdrop-blur-xl rounded-2xl p-3 shadow-lg cursor-move select-none transition-opacity ${isVertical ? "flex-col space-y-2" : "flex-row space-x-2"
                } flex items-center`}
        >
            {/* Navigation Links */}
            {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        data-clickable="true"
                        className={`p-3 rounded-lg transition-all hover:scale-110 group relative ${pathname === link.href
                                ? "bg-primary text-on-primary"
                                : "text-on-surface hover:bg-surface-variant"
                            }`}
                        title={link.label}
                    >
                        <Icon className="w-5 h-5" />
                        {/* Tooltip */}
                        <span className="absolute hidden group-hover:block bg-surface-variant text-on-surface text-xs px-2 py-1 rounded whitespace-nowrap z-10 left-full ml-2 top-1/2 -translate-y-1/2">
                            {link.label}
                        </span>
                    </Link>
                );
            })}

            {/* Separator */}
            {isVertical && <div className="w-full h-px bg-outline/20" />}

            {/* Search Button */}
            <button
                onClick={handleSearchClick}
                data-clickable="true"
                className="p-3 rounded-lg transition-all hover:scale-110 group relative text-on-surface hover:bg-surface-variant"
                title="Search"
            >
                <HiSearch className="w-5 h-5" />
                <span className="absolute hidden group-hover:block bg-surface-variant text-on-surface text-xs px-2 py-1 rounded whitespace-nowrap z-10 left-full ml-2 top-1/2 -translate-y-1/2">
                    Search (Ctrl+K)
                </span>
            </button>

            {/* Drag Hint */}
            {/* <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-on-surface-variant opacity-50 whitespace-nowrap pointer-events-none">
                Drag to move
            </div> */}
        </nav>
    );
}
