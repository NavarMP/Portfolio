"use client";

import Link from "next/link";
import {
    SiBehance,
    SiGithub,
    SiTelegram,
    SiWhatsapp,
    SiInstagram,
    SiFacebook,
    SiX,
    SiYoutube,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { HiMail, HiPhone } from "react-icons/hi";

const socialLinks = [
    { name: "Behance", url: "https://www.behance.net/NavarMP", icon: SiBehance },
    { name: "LinkedIn", url: "https://linkedin.com/in/NavarMP", icon: FaLinkedin },
    { name: "Github", url: "https://github.com/NavarMP", icon: SiGithub },
    { name: "Telegram", url: "https://t.me/NavarMP", icon: SiTelegram },
    {
        name: "WhatsApp",
        url: "https://api.whatsapp.com/send?phone=919746902268",
        icon: SiWhatsapp,
    },
    { name: "Instagram", url: "https://instagram.com/Navar_MP", icon: SiInstagram },
    { name: "Facebook", url: "https://www.facebook.com/NavarMP", icon: SiFacebook },
    { name: "X", url: "https://x.com/Navar_MP", icon: SiX },
    { name: "YouTube", url: "https://www.youtube.com/@NavarMP", icon: SiYoutube },
];

const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Resume", href: "/resume" },
    { name: "Portfolio", href: "/work" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

const legalLinks = [
    { name: "Terms of Service", href: "/legal/terms" },
    { name: "Privacy Policy", href: "/legal/privacy" },
];

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-surface border-t border-outline-variant mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Social Media Links */}
                    <div>
                        <h3 className="font-display font-semibold text-lg mb-4 text-on-surface">
                            Connect
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 rounded-lg bg-surface-variant hover:bg-primary hover:text-on-primary transition-all hover:scale-110"
                                        title={social.name}
                                        aria-label={social.name}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-display font-semibold text-lg mb-4 text-on-surface">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-on-surface-variant hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-display font-semibold text-lg mb-4 text-on-surface">
                            Get in Touch
                        </h3>
                        <div className="space-y-3">
                            <a
                                href="mailto:NavarMP@gmail.com"
                                className="flex items-center space-x-2 text-on-surface-variant hover:text-primary transition-colors"
                            >
                                <HiMail className="w-5 h-5" />
                                <span>NavarMP@gmail.com</span>
                            </a>
                            <a
                                href="tel:+919746902268"
                                className="flex items-center space-x-2 text-on-surface-variant hover:text-primary transition-colors"
                            >
                                <HiPhone className="w-5 h-5" />
                                <span>+91 9746 902268</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-outline-variant pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-on-surface-variant text-sm">
                        © {currentYear} Muḥammed Navār. All rights reserved.
                    </div>

                    <div className="flex space-x-4 text-sm">
                        {legalLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-on-surface-variant hover:text-primary transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
