import ProductPage from "@/components/product-page"
import { ayurvedicProducts } from "@/data/products"
import Navbar from "@/components/navbar";

export default function Page() {
    return (
        <main>
            <Navbar />
            <ProductPage
                title="Ayurvedic Products"
                description="Traditional healing remedies from Sri Lanka"
                products={ayurvedicProducts}
                categories={[
                    { id: "oils", name: "Oils" },
                    { id: "herbs", name: "Herbs" },
                    { id: "supplements", name: "Supplements" },
                    { id: "skincare", name: "Skincare" },
                ]}
            />
        </main>

    )
}

