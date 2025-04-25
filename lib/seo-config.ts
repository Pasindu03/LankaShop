export const defaultSeo = {
    titleTemplate: "%s | Lanka Shop",
    defaultTitle: "Lanka Shop | Authentic Sri Lankan Products in the UK",
    description:
        "Discover authentic Sri Lankan products including Ayurvedic remedies, handicrafts, premium spices, and Ceylon tea.",
    openGraph: {
        type: "website",
        locale: "en_GB",
        url: "https://lankashop.co.uk",
        siteName: "Lanka Shop",
        images: [
            {
                url: "https://lankashop.co.uk/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Lanka Shop - Authentic Sri Lankan Products",
            },
        ],
    },
    twitter: {
        handle: "@lankashop",
        site: "@lankashop",
        cardType: "summary_large_image",
    },
}

export const productSeo = (product: {
    name: string
    description: string
    image: string
    price: number
    currency: string
}) => {
    return {
        title: `${product.name} | Lanka Shop`,
        description: product.description,
        openGraph: {
            type: "product",
            url: `https://lankashop.co.uk/product/${product.name.toLowerCase().replace(/\s+/g, "-")}`,
            title: `${product.name} | Lanka Shop`,
            description: product.description,
            images: [
                {
                    url: product.image,
                    width: 800,
                    height: 600,
                    alt: product.name,
                },
            ],
            site_name: "Lanka Shop",
            price: {
                currency: product.currency,
                amount: product.price,
            },
        },
    }
}
