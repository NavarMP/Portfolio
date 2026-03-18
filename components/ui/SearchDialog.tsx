"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Briefcase, FileText, Code, X, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";

interface SearchResult {
    type: "project" | "resume" | "skill";
    title: string;
    subtitle?: string;
    href: string;
}

const typeIcons = {
    project: Briefcase,
    resume: FileText,
    skill: Code,
};

const typeColors = {
    project: "text-primary bg-primary/10",
    resume: "text-secondary bg-secondary/10",
    skill: "text-tertiary bg-tertiary/10",
};

export function SearchDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    
    const inputRef = useRef<HTMLInputElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("recentSearches");
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Keyboard shortcut to open
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(true);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Focus input when dialog opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            gsap.fromTo(dialogRef.current, 
                { opacity: 0, scale: 0.95, y: -20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: "power2.out" }
            );
        }
    }, [isOpen]);

    // Search debounce
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data.results || []);
                setSelectedIndex(0);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex((prev) => Math.max(prev - 1, 0));
                    break;
                case "Enter":
                    e.preventDefault();
                    if (results[selectedIndex]) {
                        handleSelect(results[selectedIndex]);
                    }
                    break;
                case "Escape":
                    handleClose();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, results, selectedIndex]);

    const handleClose = useCallback(() => {
        gsap.to(dialogRef.current, {
            opacity: 0,
            scale: 0.95,
            y: -20,
            duration: 0.15,
            ease: "power2.in",
            onComplete: () => setIsOpen(false),
        });
        setQuery("");
        setResults([]);
    }, []);

    const handleSelect = (result: SearchResult) => {
        // Save to recent searches
        const newRecent = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
        setRecentSearches(newRecent);
        localStorage.setItem("recentSearches", JSON.stringify(newRecent));

        router.push(result.href);
        handleClose();
    };

    const openSearch = () => {
        setIsOpen(true);
    };

    // Export openSearch function
    useEffect(() => {
        (window as any).openSearch = openSearch;
    }, []);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Search Dialog */}
            <div className="fixed inset-x-4 top-[15vh] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-[201]">
                <div
                    ref={dialogRef}
                    className="glass backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
                    style={{ background: 'rgba(30, 30, 30, 0.95)' }}
                >
                    {/* Search Input */}
                    <div className="flex items-center gap-4 p-5 border-b border-white/10">
                        <Search className="w-6 h-6 text-white/50 shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search projects, skills, experience..."
                            className="flex-1 bg-transparent text-white text-lg outline-none placeholder-white/40"
                        />
                        {loading && (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        <button
                            onClick={handleClose}
                            className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        >
                            <X className="w-4 h-4 text-white/70" />
                        </button>
                    </div>

                    {/* Results */}
                    <div className="max-h-[50vh] overflow-y-auto">
                        {query.length < 2 && recentSearches.length > 0 && (
                            <div className="p-4">
                                <p className="text-white/40 text-xs font-medium mb-3 uppercase tracking-wider">Recent Searches</p>
                                <div className="space-y-1">
                                    {recentSearches.map((search, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setQuery(search)}
                                            className="w-full text-left px-4 py-2.5 text-white/70 hover:bg-white/10 rounded-xl transition-colors flex items-center gap-3"
                                        >
                                            <Search className="w-4 h-4 opacity-50" />
                                            {search}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {query.length >= 2 && results.length === 0 && !loading && (
                            <div className="p-8 text-center">
                                <p className="text-white/50">No results found for &quot;{query}&quot;</p>
                            </div>
                        )}

                        {results.length > 0 && (
                            <div className="p-3">
                                <p className="text-white/40 text-xs font-medium mb-2 px-3 uppercase tracking-wider">
                                    Results
                                </p>
                                <div className="space-y-1">
                                    {results.map((result, index) => {
                                        const Icon = typeIcons[result.type];
                                        return (
                                            <button
                                                key={`${result.type}-${result.title}-${index}`}
                                                onClick={() => handleSelect(result)}
                                                onMouseEnter={() => setSelectedIndex(index)}
                                                className={`w-full text-left px-4 py-3.5 rounded-xl transition-colors flex items-center gap-4 ${
                                                    index === selectedIndex
                                                        ? "bg-primary/20 border border-primary/30"
                                                        : "hover:bg-white/10 border border-transparent"
                                                }`}
                                            >
                                                <div className={`p-2 rounded-lg ${typeColors[result.type]}`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-medium truncate">{result.title}</p>
                                                    {result.subtitle && (
                                                        <p className="text-white/50 text-sm truncate">{result.subtitle}</p>
                                                    )}
                                                </div>
                                                <ArrowRight className={`w-4 h-4 text-white/30 shrink-0 ${index === selectedIndex ? "opacity-100 text-primary" : ""}`} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3 bg-black/20 border-t border-white/10 flex items-center justify-between text-white/40 text-xs">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/60">↑</kbd>
                                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/60">↓</kbd>
                                to navigate
                            </span>
                            <span className="flex items-center gap-1.5">
                                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/60">↵</kbd>
                                to select
                            </span>
                        </div>
                        <span className="flex items-center gap-1.5">
                            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/60">esc</kbd>
                            to close
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

// Search trigger button component
export function SearchButton() {
    const handleClick = () => {
        if (typeof window !== "undefined" && (window as any).openSearch) {
            (window as any).openSearch();
        }
    };

    return (
        <button
            onClick={handleClick}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            title="Search (Ctrl+K)"
        >
            <Search className="w-5 h-5 text-white/80" />
        </button>
    );
}
