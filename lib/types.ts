// types/product.ts
export interface Product {
    id: string;         // You can let Firestore auto-generate an ID or supply your own
    name: string;
    price: number;
    image: string;      // URL to the product image
    category: string;   // e.g., "herbs", "supplements", "oils", "skincare", etc.
    rating: number;
    reviews: number;
    date: string;       // ISO date string (you can change to Date if you prefer)
    description: string;
}
