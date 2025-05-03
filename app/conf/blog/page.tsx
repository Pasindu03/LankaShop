import Link from "next/link"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
    title: "Blog | Lanka Shop",
    description: "Explore articles about Sri Lankan culture, products, and traditions.",
}

export default function BlogPage() {
    const blogPosts = [
        {
            id: 1,
            title: "The Rich History of Ceylon Tea",
            excerpt:
                "Discover how Ceylon Tea became one of the world's most sought-after varieties and why Sri Lankan tea continues to be celebrated globally.",
            date: "May 2, 2023",
            image: "/placeholder.svg?height=200&width=400",
        },
        {
            id: 2,
            title: "Ayurvedic Practices for Modern Wellness",
            excerpt:
                "Learn how ancient Ayurvedic remedies from Sri Lanka can be incorporated into your daily wellness routine for better health and balance.",
            date: "April 15, 2023",
            image: "/placeholder.svg?height=200&width=400",
        },
        {
            id: 3,
            title: "The Art of Sri Lankan Handicrafts",
            excerpt:
                "Explore the traditional techniques and cultural significance behind Sri Lanka's beautiful handcrafted items.",
            date: "March 28, 2023",
            image: "/placeholder.svg?height=200&width=400",
        },
    ]

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <Link href="/">
                    <Button variant="ghost" className="mb-6 flex items-center gap-2">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>

                <h1 className="text-3xl font-serif mb-6">Our Blog</h1>
                <p className="text-gray-600 mb-8">Explore articles about Sri Lankan culture, products, and traditions.</p>

                <div className="grid gap-8">
                    {blogPosts.map((post) => (
                        <div key={post.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                            <div className="md:flex">
                                <div className="md:w-1/3 relative h-48 md:h-auto">
                                    <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                                </div>
                                <div className="p-6 md:w-2/3">
                                    <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                                    <h2 className="text-xl font-medium mb-2">{post.title}</h2>
                                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                                    <Link href={`/conf/blog/${post.id}`} className="text-amber-600 hover:text-amber-700 font-medium">
                                        Read more
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
