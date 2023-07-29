import "./globals.css";
import { Inter, Montserrat, Open_Sans } from "next/font/google";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AuthProvider from "./context/AuthProvider";
import Nav from "@/components/Nav";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });
const openSans = Open_Sans({ subsets: ["latin"] });

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
            <body className={montserrat.className}>
                <AuthProvider>
                    <Nav />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
