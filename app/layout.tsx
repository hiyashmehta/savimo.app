import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Expense Tracker | savimo.app",
    description:
        "Your personal finance tracker. Built with NextJS, TailwindCSS and MySQL. Track all your transactions in one place.",
    openGraph: {
        title: "Expense Tracker | savimo.app",
        description:
            "Your personal finance tracker. Built with NextJS, TailwindCSS and MySQL. Track all your transactions in one place.",
        // images: [
        //     {
        //         url: "/app-preview.png",
        //         width: 1200,
        //         height: 600,
        //         alt: "App Preview Image",
        //     },
        // ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
