import ProductPage from "@/components/product-page"
import {handicraftProducts, spicesProducts} from "@/data/products"
import Navbar from "@/components/navbar"

export default function Page() {
    return (
        <main>
            <Navbar />
            <ProductPage
                title="Spices Products"
                description="Spices Crafted with traditional techniques"
                products={spicesProducts}
                heroImage="https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                categories={[
                    { id: "cinnamon", name: "Cinnamon" },
                    { id: "pepper", name: "Pepper" },
                    { id: "cardamom", name: "Cardamom" },
                    { id: "cloves", name: "Cloves" },
                ]}
            />
        </main>
    )
}
