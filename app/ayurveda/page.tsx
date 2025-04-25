import ProductPage from "@/components/product-page"
import { ayurvedicProducts } from "@/data/products"
import Navbar from "@/components/navbar"

export default function Page() {
    return (
        <main>
            <Navbar />
            <ProductPage
                title="Ayurvedic Products"
                description="Traditional healing remedies from Sri Lanka"
                products={ayurvedicProducts}
                heroImage="https://images.pexels.com/photos/7526022/pexels-photo-7526022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
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
