import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://lankashop.co.uk"

    // Define your main routes
    const routes = ["", "/ayurveda", "/handicraft", "/spices", "/tea", "login", "register", "checkout", "product", "signup"]

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1 : 0.8,
    }))
}
