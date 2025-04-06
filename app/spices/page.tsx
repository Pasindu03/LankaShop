import ProductPage from "@/components/product-page"
import { spicesProducts } from "@/data/products"
import Navbar from "@/components/navbar";

export default function Page() {
    return (
        <main>
            <Navbar />
            <ProductPage
                title="Spices"
                description="Premium quality spices from Sri Lanka"
                products={spicesProducts}
                categories={[
                    { id: "cinnamon", name: "Cinnamon" },
                    { id: "cardamom", name: "Cardamom" },
                    { id: "cloves", name: "Cloves" },
                    { id: "pepper", name: "Pepper" },
                ]}
            />
        </main>
    )
}

