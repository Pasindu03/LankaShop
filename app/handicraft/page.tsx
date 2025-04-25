import ProductPage from "@/components/product-page"
import { handicraftProducts } from "@/data/products"
import Navbar from "@/components/navbar"

export default function Page() {
    return (
        <main>
            <Navbar />
            <ProductPage
                title="Handicraft Products"
                description="Handmade crafts with traditional techniques"
                products={handicraftProducts}
                heroImage="https://images.pexels.com/photos/2422574/pexels-photo-2422574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                categories={[
                    { id: "masks", name: "Masks" },
                    { id: "textiles", name: "Textiles" },
                    { id: "woodwork", name: "Woodwork" },
                    { id: "jewelry", name: "Jewelry" },
                ]}
            />
        </main>
    )
}
