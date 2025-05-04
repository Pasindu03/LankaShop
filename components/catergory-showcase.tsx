"use client";

import React, { useState, useEffect } from "react";
import { getDocs, collection, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export default function ProductShowcase() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const q = query(collection(db, "categories"));
        const snap = await getDocs(q);
        const items: Category[] = snap.docs.map((doc) => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            image: data.image,
          };
        });
        setCategories(items);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);

  if (categories.length === 0) {
    return <p className="text-center">No categories to display.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {categories.map((cat) => {
        const slug = cat.name.split(" ")[0].toLowerCase();
        return (
          <div
            key={cat.id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
          >
            <div className="h-64 relative">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-medium mb-2">{cat.name}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{cat.description}</p>
              <Link
                href={`/categories/${cat.id}`}
                className="text-black font-medium hover:underline"
              >
                Explore →
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
