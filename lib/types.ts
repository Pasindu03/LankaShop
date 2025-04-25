export type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    mainCategory: "ayurvedic" | "handicraft" | "spices" | "tea";
    rating: number;
    reviews: number;
    date: string;
    description: string;
}
