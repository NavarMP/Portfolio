"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { HiX, HiColorSwatch, HiGlobe, HiInformationCircle, HiMoon, HiSun, HiDesktopComputer } from "react-icons/hi";
import { gsap } from "gsap";
import { Draggable } from "gsap/dist/Draggable";
import { SettingsButton } from "./SettingsButton";

gsap.registerPlugin(Draggable);

type Language = "en" | "ml" | "ar";
type TabType = "theme" | "colors" | "language" | "about";

const colorPresets = [
    { name: "Purple", color: "#6750a4", accent: "#e8def8" },
    { name: "Blue", color: "#1976d2", accent: "#bbdefb" },
    { name: "Green", color: "#2e7d32", accent: "#c8e6c9" },
    { name: "Orange", color: "#ed6c02", accent: "#ffe0b2" },
    { name: "Pink", color: "#d81b60", accent: "#f8bbd0" },
    { name: "Teal", color: "#00897b", accent: "#b2dfdb" },
    { name: "Indigo", color: "#3949ab", accent: "#c5cae9" },
    { name: "Red", color: "#d32f2f", accent: "#ffcdd2" },
    { name: "Cyan", color: "#0097a7", accent: "#b2ebf2" },
];

const socialLinks = [
    { platform: "GitHub", url: "https://github.com/NavarMP" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/NavarMP" },
    { platform: "Instagram", url: "https://instagram.com/navarmp" },
    { platform: "Twitter", url: "https://twitter.com/NavarMP" },
    { platform: "Behance", url: "https://behance.net/navarmp" },
    { platform: "Dribbble", url: "https://dribbble.com/navarmp" },
];

const tabs = [
    { id: "theme" as TabType, label: "Theme", icon: HiMoon },
    { id: "colors" as TabType, label: "Colors", icon: HiColorSwatch },
    { id: "language" as TabType, label: "Language", icon: HiGlobe },
    { id: "about" as TabType, label: "About", icon: HiInformationCircle },
];

export function SettingsMenu() {
    const { theme, setTheme, primaryColor, setPrimaryColor } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("theme");
    const [language, setLanguage] = useState<Language>("en");
    const [customColor, setCustomColor] = useState(primaryColor);
    
    const panelRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOpenSettings = () => {
            setIsOpen(true);
            setCustomColor(primaryColor);
        };
        document.addEventListener("openSettings", handleOpenSettings);
        return () => document.removeEventListener("openSettings", handleOpenSettings);
    }, [primaryColor]);

    useEffect(() => {
        const savedLanguage = localStorage.getItem("language") as Language;
        if (savedLanguage) {
            setLanguage(savedLanguage);
        }
    }, []);

    useEffect(() => {
        if (!isOpen || !panelRef.current) return;

        gsap.fromTo(panelRef.current, 
            { scale: 0.8, opacity: 0, y: 20 },
            { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
        );

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose();
            }
            if (e.key === "ArrowRight" && !e.shiftKey) {
                setActiveTab(prev => {
                    const currentIndex = tabs.findIndex(t => t.id === prev);
                    return tabs[(currentIndex + 1) % tabs.length].id;
                });
            }
            if (e.key === "ArrowLeft" && !e.shiftKey) {
                setActiveTab(prev => {
                    const currentIndex = tabs.findIndex(t => t.id === prev);
                    return tabs[(currentIndex - 1 + tabs.length) % tabs.length].id;
                });
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || !containerRef.current) return;

        let dragInstance: Draggable[];
        
        dragInstance = Draggable.create(containerRef.current, {
            type: "x,y",
            bounds: "body",
            allowEventDefault: true,
            dragClickables: false,
            onDragEnd: function () {
                gsap.to(containerRef.current, { scale: 1, duration: 0.2 });
            },
            onDragStart: function () {
                gsap.to(containerRef.current, { scale: 1.02, duration: 0.2 });
            },
        });

        return () => {
            dragInstance.forEach(d => d.kill());
        };
    }, [isOpen]);

    const handleClose = useCallback(() => {
        if (!panelRef.current) return;
        
        gsap.to(panelRef.current, {
            scale: 0.8,
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => setIsOpen(false)
        });
    }, []);

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    const handleColorChange = (color: string) => {
        setPrimaryColor(color);
        setCustomColor(color);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm animate-fade-in"
                onClick={handleClose}
            />

            {/* Draggable Container */}
            <div
                ref={containerRef}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[95vw] max-w-lg cursor-move"
                style={{ transform: 'translate(-50%, -50%)' }}
            >
                <div
                    ref={panelRef}
                    className="glass backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
                    style={{ background: 'rgba(255, 255, 255, 0.08)' }}
                >
                    {/* Tabs Navigation */}
                    <div className="flex border-b border-white/10 bg-white/5">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all relative ${
                                        activeTab === tab.id 
                                            ? "text-white" 
                                            : "text-white/50 hover:text-white/80"
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-xs font-medium">{tab.label}</span>
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-white rounded-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                        aria-label="Close settings"
                    >
                        <HiX className="w-4 h-4 text-white" />
                    </button>

                    {/* Content */}
                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                        {/* Theme Tab */}
                        {activeTab === "theme" && (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4">Appearance</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { id: "light", icon: HiSun, label: "Light" },
                                            { id: "dark", icon: HiMoon, label: "Dark" },
                                            { id: "system", icon: HiDesktopComputer, label: "System" },
                                        ].map((option) => {
                                            const Icon = option.icon;
                                            return (
                                                <button
                                                    key={option.id}
                                                    onClick={() => setTheme(option.id as "light" | "dark" | "system")}
                                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                                                        theme === option.id
                                                            ? "bg-white/20 ring-2 ring-white text-white"
                                                            : "bg-white/5 text-white/70 hover:bg-white/10"
                                                    }`}
                                                >
                                                    <Icon className="w-6 h-6" />
                                                    <span className="text-sm font-medium">{option.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Colors Tab */}
                        {activeTab === "colors" && (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4">Primary Color</h3>
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        {colorPresets.map((preset) => (
                                            <button
                                                key={preset.color}
                                                onClick={() => handleColorChange(preset.color)}
                                                className={`h-14 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2 ${
                                                    primaryColor === preset.color
                                                        ? "ring-4 ring-white ring-offset-2 ring-offset-transparent scale-105"
                                                        : "hover:ring-2 hover:ring-white/30"
                                                }`}
                                                style={{ backgroundColor: preset.color }}
                                                title={preset.name}
                                            >
                                                {primaryColor === preset.color && (
                                                    <span className="text-white text-xs">✓</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    {/* Custom Color Picker */}
                                    <div className="space-y-2">
                                        <label className="text-sm text-white/70">Custom Color</label>
                                        <div className="flex gap-3 items-center">
                                            <input
                                                type="color"
                                                value={customColor}
                                                onChange={(e) => setCustomColor(e.target.value)}
                                                className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0"
                                            />
                                            <input
                                                type="text"
                                                value={customColor}
                                                onChange={(e) => {
                                                    setCustomColor(e.target.value);
                                                    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                                                        handleColorChange(e.target.value);
                                                    }
                                                }}
                                                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50"
                                                placeholder="#6750a4"
                                            />
                                            <button
                                                onClick={() => handleColorChange(customColor)}
                                                className="px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white text-sm font-medium transition-colors"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <p className="text-white/70 text-sm mb-3">Preview</p>
                                    <div className="flex gap-2">
                                        <button
                                            className="px-4 py-2 rounded-full text-sm font-medium text-white"
                                            style={{ backgroundColor: primaryColor }}
                                        >
                                            Primary Button
                                        </button>
                                        <span className="text-white" style={{ color: primaryColor }}>
                                            Accent Text
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Language Tab */}
                        {activeTab === "language" && (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4">Select Language</h3>
                                    <div className="space-y-3">
                                        {[
                                            { code: "en", label: "English", native: "English", flag: "🇬🇧" },
                                            { code: "ml", label: "Malayalam", native: "മലയാളം", flag: "🇮🇳" },
                                            { code: "ar", label: "Arabic", native: "العربية", flag: "🇸🇦" },
                                        ].map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => handleLanguageChange(lang.code as Language)}
                                                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                                                    language === lang.code
                                                        ? "bg-white/20 ring-2 ring-white text-white"
                                                        : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                                                }`}
                                            >
                                                <span className="text-2xl">{lang.flag}</span>
                                                <div className="text-left">
                                                    <p className="font-bold">{lang.native}</p>
                                                    <p className="text-sm opacity-70">{lang.label}</p>
                                                </div>
                                                {language === lang.code && (
                                                    <span className="ml-auto">✓</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* About Tab */}
                        {activeTab === "about" && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="text-center py-4">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                        <span className="text-3xl font-bold text-white">N</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1">Navār Portfolio</h3>
                                    <p className="text-white/60 text-sm mb-4">Version 1.0.0</p>
                                    <p className="text-white/70 text-sm">
                                        A modern, interactive portfolio website showcasing creative work and professional journey.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-white/60 text-sm">Quick Links</p>
                                    {socialLinks.slice(0, 4).map((link) => (
                                        <a
                                            key={link.platform}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/80 hover:text-white"
                                        >
                                            <span className="text-sm">{link.platform}</span>
                                            <span className="text-xs opacity-50">↗</span>
                                        </a>
                                    ))}
                                </div>

                                <p className="text-center text-white/40 text-xs">
                                    © 2024 Muḥammed Navār. All rights reserved.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer Hint */}
                    <div className="px-6 py-3 bg-black/20 border-t border-white/10 flex justify-between items-center">
                        <span className="text-white/40 text-xs">Press ESC to close</span>
                        <span className="text-white/40 text-xs">← → to switch tabs</span>
                    </div>
                </div>
            </div>
        </>
    );
}
