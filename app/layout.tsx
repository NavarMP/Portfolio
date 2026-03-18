import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackgroundParticles } from "@/components/ui/background-particles";
import { SettingsMenu } from "@/components/ui/SettingsMenu";
import { SettingsButton } from "@/components/ui/SettingsButton";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { SearchDialog } from "@/components/ui/SearchDialog";

export const metadata: Metadata = {
    metadataBase: new URL("https://NavarMP.com"),
    title: {
        default: "Muḥammed Navār - Graphic Designer & Full-Stack Developer",
        template: "%s | NavarMP",
    },
    description: "Portfolio showcasing graphic design, web development, and digital marketing work by Muḥammed Navār",
    keywords: ["graphic design", "web development", "digital marketing", "portfolio", "branding"],
    authors: [{ name: "Muḥammed Navār", url: "https://NavarMP.com" }],
    openGraph: {
        title: "Muḥammed Navār - Graphic Designer & Full-Stack Developer",
        description: "Portfolio showcasing graphic design, web development, and digital marketing work",
        type: "website",
        images: [
            {
                url: "/api/og",
                width: 1200,
                height: 630,
                alt: "Muḥammed Navār Portfolio",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Muḥammed Navār - Graphic Designer & Full-Stack Developer",
        description: "Portfolio showcasing graphic design, web development, and digital marketing work",
        images: ["/api/og"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
            </head>
            <body className="antialiased">
                <ThemeProvider>
                    <SmoothScrollProvider>
                        <CustomCursor />
                        <BackgroundParticles />
                        <FloatingNav />
                        <SettingsButton />
                        <Header />

                        <main className="pt-20">
                            {children}
                        </main>

                        <Footer />
                        <SettingsMenu />
                        <SearchDialog />
                    </SmoothScrollProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
