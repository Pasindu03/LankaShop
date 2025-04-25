import ProductPage from "@/components/product-page"
import { teaProducts } from "@/data/products"
import Navbar from "@/components/navbar"

export default function Page() {
    return (
        <main>
            <Navbar />
            <ProductPage
                title="Ceylon Tea"
                description="World-famous tea from the highlands of Sri Lanka"
                products={teaProducts}
                heroImage="https://images.pexels.com/photos/1362537/pexels-photo-1362537.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                categories={[
                    { id: "black", name: "Black Tea" },
                    { id: "green", name: "Green Tea" },
                    { id: "white", name: "White Tea" },
                    { id: "herbal", name: "Herbal Tea" },
                ]}
            />
        </main>
    )
}
