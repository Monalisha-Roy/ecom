"use client";
import React, { useEffect, useRef, useState } from "react";
import { Category, Product } from "@/types/types";

export default function AddProduct() {
    const [products, setProducts] = useState<Product[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [stock, setStock] = useState("");
    const [discount, setDiscount] = useState("");
    const [featured, setFeatured] = useState(false);

    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCat, setLoadingCat] = useState(true);
    const [loading, setLoading] = useState(false);
    const [addProductLoading, setAddProductLoading] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function fetchCategories() {
            try {
                setLoadingCat(true);
                const res = await fetch("/api/category");
                const data = await res.json();
                setCategories(data.products || []);
            } catch (error) {
                console.log("Error fetching categories:", error);
            } finally {
                setLoadingCat(false);
            }
        }
        fetchCategories();
    }, []);

    const addProductToDatabase = async (product: Product) => {
        setAddProductLoading(true);
        try {
            const res = await fetch("/api/addProduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });

            if (!res.ok) {
                throw new Error("Failed to add product");
            }
            setAddProductLoading(false);
            alert("Product added successfully!");
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !price || !stock) return;

        const newProduct: Product = {
            name,
            description,
            price: parseFloat(price),
            category_id: categoryId,
            image_url: imageUrl,
            stock: parseInt(stock),
            discount_percentage: discount ? parseFloat(discount) : 0,
            featured: featured ?? false,
        };

        console.log("Adding product:", newProduct);

        setProducts([...products, newProduct]);

        // Clear form fields
        setName("");
        setDescription("");
        setPrice("");
        setCategoryId("");
        setImageUrl("");
        setStock("");
        setDiscount("");
        setFeatured(false);

        addProductToDatabase(newProduct);
    };

    const handleImageeUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const file = inputRef.current?.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/uploadimages", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        console.log("Uploaded! URL: " + data.url);
        setImageUrl(data.url);
        setLoading(false);
        alert("Image url added! ");
    };

    return (
        <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <h2 className="text-lg font-semibold mb-2">Add Product</h2>
            <form onSubmit={handleAddProduct} className="mb-6 flex flex-col gap-2">
                <input
                    type="text"
                    placeholder="Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border border-gray-300 rounded px-3 py-2"
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="border border-gray-300 rounded px-3 py-2"
                />
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="border border-gray-300 rounded px-3 py-2"
                    disabled={loading}
                >
                    {loadingCat ? (
                        <option value="">Loading categories...</option>
                    ) : (
                        <>
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.slug}
                                </option>
                            ))}
                        </>
                    )}
                </select>
                <div className="flex items-center w-full justify-between mb-4">
                    <input
                        type="file"
                        name="file"
                        ref={inputRef}
                        className="border border-gray-300 rounded px-6 py-2"
                        accept="image/*"
                    />
                    <button
                        type="button"
                        onClick={handleImageeUpload}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        {loading ? (
                            <span className="animate-spin">Fetching url...</span>
                        ) : (
                            <span className="px-4">Get url</span>
                        )}
                    </button>
                </div>
                <input
                    type="number"
                    placeholder="Stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                    min="0"
                    className="border border-gray-300 rounded px-3 py-2"
                />
                <input
                    type="number"
                    placeholder="Discount %"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    min="0"
                    max="100"
                    step="0.01"
                    className="border border-gray-300 rounded px-3 py-2"
                />
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(!!e.target.checked)}
                    />
                    Featured
                </label>
                <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    onClick={handleAddProduct}
                >
                    {addProductLoading ? (
                        <span className="animate-spin">Adding...</span>
                    ) : (
                        <span>Add Product</span>
                    )}
                </button>
            </form>
        </div>
    );
}
