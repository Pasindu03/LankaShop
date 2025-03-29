import { Star } from 'lucide-react';
import React from 'react';

const HeroComponent = () => {
    return (
        <div>
            {/* Products Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="font-avenir text-4xl font-bold text-center mb-16">
                        Our Signature Flavors
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                name: "Classic Berry",
                                image: "https://images.unsplash.com/photo-1598672477662-8a3623bd8dee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
                            },
                            {
                                name: "Citrus Blend",
                                image: "https://images.unsplash.com/photo-1597403491447-3ab08f8e44dc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
                            },
                            {
                                name: "Purple Haze",
                                image: "https://images.unsplash.com/photo-1598672477726-77f0813f9c9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
                            },
                            {
                                name: "Ginger Spice",
                                image: "https://images.unsplash.com/photo-1598672477692-e4f7c3f47992?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
                            },
                        ].map((product, index) => (
                            <div key={index} className="product-card">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="product-overlay">
                                    <div className="text-center">
                                        <h3 className="font-avenir text-white text-xl font-bold mb-2">
                                            {product.name}
                                        </h3>
                                        <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors duration-200">
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="font-avenir text-4xl font-bold text-center mb-16">
                        What Our Customers Say
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-lg shadow-sm"
                            >
                                <div className="flex mb-4">
                                    {[1, 2, 3, 4, 5].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="h-5 w-5 text-yellow-400 fill-current"
                                        />
                                    ))}
                                </div>
                                <p className="mb-4">
                                    "The best kombucha I've ever tasted! The flavors are unique and
                                    refreshing. I love how natural and healthy it feels."
                                </p>
                                <p className="font-avenir font-semibold">- Sarah M.</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="font-avenir text-xl font-bold mb-4">SOULSTICE</h3>
                            <p className="text-gray-400">
                                Crafting premium kombucha with love and care since 2020.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-avenir text-lg font-semibold mb-4">Shop</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white">All Products</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Bestsellers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">New Arrivals</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-avenir text-lg font-semibold mb-4">About</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white">Our Story</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Process</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-avenir text-lg font-semibold mb-4">Connect</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white">Instagram</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Facebook</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Twitter</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
                        <p>&copy; 2024 Soulstice Kombucha. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HeroComponent;