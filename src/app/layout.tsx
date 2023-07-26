import "./globals.css";
import { Inter } from "next/font/google";
import AuthProvider from "./context/AuthProvider";
import Nav from "@/components/Nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Typing Website",
    description: "A website dedicated to practice your typing.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <Nav />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
