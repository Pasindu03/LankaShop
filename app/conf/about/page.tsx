import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
    title: "About Us | Lanka Shop",
    description: "Learn about Lanka Shop, the premier UK distributor of authentic Sri Lankan products.",
}

export default function Page() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <Link href="/">
                    <Button variant="ghost" className="mb-6 flex items-center gap-2">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>

                <h1 className="text-3xl font-serif mb-6">About Lanka Shop</h1>

                <div className="prose max-w-none">
                    <p className="mb-4">
                        Lanka Shop is the premier destination for authentic Sri Lankan products in the United Kingdom. Established
                        in 2018, we have built strong relationships with Sri Lankan producers and artisans to bring the finest
                        products directly to UK consumers.
                    </p>

                    <h2 className="text-xl font-medium mt-8 mb-4">Our Mission</h2>
                    <p className="mb-4">
                        Our mission is to share the rich cultural heritage and exceptional products of Sri Lanka with the UK market
                        while supporting sustainable practices and fair trade with our partner producers.
                    </p>

                    <h2 className="text-xl font-medium mt-8 mb-4">Our Story</h2>
                    <p className="mb-4">
                        Lanka Shop was founded by Sri Lankan expatriates who recognized the growing demand for authentic Sri Lankan
                        products in the UK. What began as a small operation importing Ceylon tea has grown into a comprehensive
                        online marketplace offering everything from Ayurvedic wellness products to handcrafted decorative items.
                    </p>

                    <h2 className="text-xl font-medium mt-8 mb-4">Our Commitment</h2>
                    <p className="mb-4">We are committed to:</p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Ensuring the authenticity of all products</li>
                        <li>Supporting fair trade practices with our Sri Lankan partners</li>
                        <li>Providing exceptional customer service</li>
                        <li>Promoting Sri Lankan culture and heritage</li>
                        <li>Maintaining sustainable and ethical business practices</li>
                    </ul>

                    <p className="mt-8">
                        Thank you for choosing Lanka Shop. We look forward to bringing a piece of Sri Lanka into your home.
                    </p>
                </div>
            </div>
        </div>
    )
}
