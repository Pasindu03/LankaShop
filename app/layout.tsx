import type React from "react"
import "./globals.css"
import { Nunito_Sans, Playfair_Display } from "next/font/google"
import { ThemeProvider } from "@/components/ThemeProvider"

// Nunito Sans as an alternative to Avenir
const nunitoSans = Nunito_Sans({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-nunito-sans",
})

// Playfair Display for descriptions
const playfairDisplay = Playfair_Display({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-playfair-display",
})

export const metadata = {
    title: "Lanka Shop",
    description: "Discover our unique kombucha flavors",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${nunitoSans.variable} ${playfairDisplay.variable}`}>
        <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="light">
            {children}
        </ThemeProvider>
        </body>
        </html>
    )
}

