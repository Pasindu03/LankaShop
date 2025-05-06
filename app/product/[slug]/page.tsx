"use client";

import {
  useState,
  useEffect,
  JSXElementConstructor,
  Key,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Minus, Plus, ShoppingBag, Star, StarHalf } from "lucide-react";
import Breadcrumb from "@/components/breadcrumb";
import Navbar from "@/components/navbar";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/types/product";
import { getProduct } from "@/lib/services/productService";
import { getCategoryById } from "@/lib/services/categoryService";

type CategoryMeta = {
  id: string;
  name: string;
  heroImage?: string;
  description?: string;
};

export default function ProductPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<CategoryMeta | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    async function fetchData() {
      try {
        const prod = await getProduct(Array.isArray(slug) ? slug[0] : slug);
        if (!prod) {
          setProduct(null);
          return;
        }
        setProduct(prod);

        const cat = await getCategoryById(prod.categoryId);
        if (cat) setCategory(cat);
      } catch (err) {
        console.error("Error loading product page:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading…</p>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p>This product does not exist.</p>
      </div>
    );
  }

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity,
      image: product.image || "/placeholder.svg",
      category: category?.name || "Uncategorized",
    });
    setQuantity(1);
  };

  // Breadcrumb items
  const breadcrumbItems = [
    {
      label: category?.name || "Products",
      href: `/categories/${product.categoryId ?? ""}`,
    },
    {
      label: product.name,
      href: `/product/${product.id}`,
      isCurrent: true,
    },
  ];

  return (
    <main>
      <Navbar />
      <div className="container mx-auto pt-28 px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
          <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            <div className="text-2xl font-bold mb-6">
              £{parseFloat(product.price).toFixed(2)}
            </div>
            <p className="text-gray-600 mb-8">{product.description}</p>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center">
                <button
                  onClick={decrement}
                  className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <div className="px-4 py-2 border-t border-b border-gray-300 min-w-[50px] text-center">
                  {quantity}
                </div>
                <button
                  onClick={increment}
                  className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag size={20} className="mr-2" />
              Add to Cart
            </button>

            {/* Extra Details */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Product Details</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                {product.productDetails?.map(
                  (
                    line:
                      | string
                      | number
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal
                      | PromiseLikeOfReactNode
                      | null
                      | undefined,
                    i: Key | null | undefined
                  ) => <li key={i}>{line}</li>
                ) || (
                  <>
                    <li>Authentic Sri Lankan product</li>
                    <li>Premium quality</li>
                    <li>Ethically sourced</li>
                    <li>Ships from UK warehouse</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
