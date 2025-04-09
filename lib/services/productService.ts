// services/productService.ts
import {
    collection,
    doc,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";
import type { Product } from "@/types/product";
import { db } from "../firebase";

// Reference to the "products" collection in Firestore
const productsCollection = collection(db, "products");

/**
 * Create a new product.
 * @param product - The product data to create.
 * @returns The new document ID.
 */
export async function createProduct(product: Product): Promise<string> {
    try {
        const docRef = await addDoc(productsCollection, product);
        console.log("Product created with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
}

/**
 * Fetch a single product by its ID.
 * @param productId - The Firestore document ID for the product.
 * @returns The product data (or null if not found).
 */
export async function getProduct(productId: string): Promise<Product | null> {
    try {
        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
            return productSnap.data() as Product;
        } else {
            console.log("No product found with ID:", productId);
            return null;
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

/**
 * Fetch all products.
 * @returns An array of products.
 */
export async function getProducts(): Promise<Product[]> {
    try {
        const querySnapshot = await getDocs(productsCollection);
        return querySnapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
        })) as Product[];
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

/**
 * Update an existing product.
 * @param productId - The Firestore document ID of the product to update.
 * @param updatedData - The data to update (partial product).
 */
export async function updateProduct(
    productId: string,
    updatedData: Partial<Product>
): Promise<void> {
    try {
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, updatedData);
        console.log("Product updated:", productId);
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
}

/**
 * Delete a product.
 * @param productId - The Firestore document ID of the product to delete.
 */
export async function deleteProduct(productId: string): Promise<void> {
    try {
        const productRef = doc(db, "products", productId);
        await deleteDoc(productRef);
        console.log("Product deleted:", productId);
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
}
