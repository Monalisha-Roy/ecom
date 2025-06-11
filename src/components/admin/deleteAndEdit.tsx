import { useEffect, useRef, useState } from "react";
import { Product } from "@/types/types";
import Image from "next/image";

export default function DeleteAndEditProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingupdate, setLoadingUpdate] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    discount_percentage: 0,
    image_url: "",
    featured: false,
  });
  const [opendeleteId, setOpenDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setProductLoading(true);
      try {
        const res = await fetch("/api/getProducts");
        const data = await res.json();

        const productsArray = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
            ? data.products
            : [];

        const parsedProducts = productsArray.map((item: { price: string; discount_percentage: string; }) => ({
          ...item,
          price: Number(item.price),
          discount_percentage: Number(item.discount_percentage),
        }));
        setProducts(parsedProducts);
        setProductLoading(false);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");

      // Remove the deleted product from state
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handler to open the edit modal and populate the form
  const handleEditProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setEditProduct(product);
      setEditForm({
        name: product.name,
        description: product.description || "",
        image_url: product.image_url || "",
        price: product.price,
        stock: product.stock,
        discount_percentage: product.discount_percentage ?? 0,
        featured: product.featured,
      });

    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleEditFormCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Close the edit modal
  const closeEditForm = () => {
    setEditProduct(null);
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    setLoadingUpdate(true);

    const updatedFields = { ...editForm }; // send everything

    try {
      const res = await fetch(`/api/products/${editProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      if (!res.ok) throw new Error("Failed to update product");

      setProducts((prev) =>
        prev.map((p) =>
          p.id === editProduct.id ? { ...p, ...updatedFields } : p
        )
      );
      setEditProduct(null);
      setLoadingUpdate(false);
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col h-40 w-2/6 justify-center items-center mx-auto border border-gray-600">
          <h3 className="text-2xl text-blue-400 mb-4 font-bold">Edit Product</h3>
          <form
            className="flex items-center gap-2"
            onSubmit={e => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const input = form.elements.namedItem("editId") as HTMLInputElement;
              if (input && input.value) {
          handleEditProduct(input.value);
              }
            }}
          >
            <input
              type="text"
              name="editId"
              placeholder="Enter Product ID"
              className="border px-2 py-1 rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-1 rounded"
            >
              Edit
            </button>
          </form>
        </div>
        <div className="flex flex-col h-40 w-2/6 justify-center items-center mx-auto border border-gray-600">
          <h3 className="text-2xl text-red-400 mb-4 font-bold">Delete Product</h3>
          <form
            className="flex items-center gap-2"
            onSubmit={e => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const input = form.elements.namedItem("deleteId") as HTMLInputElement;
              if (input && input.value) {
          setOpenDeleteId(input.value);
              }
            }}
          >
            <input
              type="text"
              name="deleteId"
              placeholder="Enter Product ID"
              className="border px-2 py-1 rounded"
            />
            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-1 rounded"
            >
              Delete
            </button>
          </form>
        </div>
      </div>
      <h1 className="text-xl font-semibold mb-4">Products List</h1>
      <table className="w-full h-96 overflow-y-scroll border border-gray-200 rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Price</th>
            <th className="border px-4 py-2 text-left">Stock</th>
            <th className="border px-4 py-2 text-left">Featured</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {!productLoading ? (
            products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">
                  ${Number(product.price).toFixed(2)}
                </td>
                <td className="border px-4 py-2">{product.stock}</td>
                <td className="border px-4 py-2">
                  {product.featured ? "Yes" : "No"}
                </td>
                <td className="border px-4 py-2 flex items-center justify-around gap-2">
                  <button
                    onClick={() => product.id && setOpenDeleteId(product.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                  {opendeleteId === product.id && (
                    <div className="w-96 h-auto p-7 ">
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <div className="bg-white p-6 rounded shadow-lg min-w-[350px]">
                          <h2 className="text-lg font-semibold mb-4">Product Details</h2>
                          <div className="flex flex-col gap-2">
                            <Image
                              src={
                                product.image_url && product.image_url.startsWith("http")
                                  ? product.image_url
                                  : "/default.jpg" // Make sure you have this image in your /public folder
                              }
                              alt={product.name}
                              height={128}
                              width={128}
                              className="w-32 h-32 object-cover rounded mb-2"
                            />
                            <div><strong>Name:</strong> {product.name}</div>
                            <div><strong>Description:</strong> {product.description}</div>
                            <div><strong>Price:</strong> ${Number(product.price).toFixed(2)}</div>
                            <div><strong>Stock:</strong> {product.stock}</div>
                            <div><strong>Discount:</strong> {product.discount_percentage}%</div>
                            <div><strong>Featured:</strong> {product.featured ? "Yes" : "No"}</div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => {
                                setOpenDeleteId(null);
                              }}
                              className="bg-gray-300 px-4 py-1 rounded"
                            >
                              Close
                            </button>
                            <button
                              onClick={() => {
                                if (product.id) {
                                  handleDeleteProduct(product.id);
                                }
                                setOpenDeleteId(null);
                              }}
                              className="bg-red-600 text-white px-4 py-1 rounded"
                            >
                              Confirm Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => product.id && handleEditProduct(product.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  {editProduct && editProduct.id === product.id && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                      <div className="bg-white p-6 rounded shadow-lg min-w-[300px]">
                        <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
                        <form
                          onSubmit={handleEditFormSubmit}
                          className="flex flex-col gap-3"
                        >
                          <label>
                            Name:
                            <input
                              type="text"
                              name="name"
                              value={editForm.name}
                              onChange={handleEditFormChange}
                              className="border px-2 py-1 rounded w-full"
                              required
                            />
                          </label>
                          <label>
                            Description:
                            <input
                              type="text"
                              name="description"
                              value={editForm.description || ""}
                              onChange={handleEditFormChange}
                              className="border px-2 py-1 rounded w-full" />
                          </label>
                          <label>
                            Image URL:
                            <div className="flex items-center gap-2">
                              
                              <input
                                type="text"
                                name="image_url"
                                value={editForm.image_url}
                                onChange={handleEditFormChange}
                                className="border px-2 py-1 rounded w-full"
                                placeholder="Image URL"
                              />
                              {editForm.image_url && (
                                <a
                                  href={editForm.image_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline"
                                >
                                  View
                                </a>
                              )}
                            </div>
                          </label>
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
                              onClick={async (e) => {
                                await handleImageeUpload(e);
                                if (imageUrl) {
                                  setEditForm((prev) => ({
                                    ...prev,
                                    image_url: imageUrl,
                                  }));
                                }
                              }}
                              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                              {loading ? (
                                <span className="animate-spin">Uploading...</span>
                              ) : (
                                <span>Upload Image</span>
                              )}
                            </button>
                          </div>
                          <label>
                            Price:
                            <input
                              type="number"
                              name="price"
                              value={editForm.price}
                              onChange={handleEditFormChange}
                              className="border px-2 py-1 rounded w-full"
                              required
                            />
                          </label>
                          <label>
                            Stock:
                            <input
                              type="number"
                              name="stock"
                              value={editForm.stock}
                              onChange={handleEditFormChange}
                              className="border px-2 py-1 rounded w-full"
                              required
                            />
                          </label>
                          <label>
                            Discount Percentage:
                            <input
                              type="number"
                              name="discount_percentage"
                              value={editForm.discount_percentage}
                              onChange={handleEditFormChange}
                              className="border px-2 py-1 rounded w-full"
                            />
                          </label>
                          <label>
                            Featured:
                            <input
                              type="checkbox"
                              name="featured"
                              checked={editForm.featured}
                              onChange={handleEditFormCheckbox}
                              className="ml-2"
                            />
                          </label>
                          <div className="flex gap-2 mt-4">
                            <button
                              type="submit"
                              className="bg-blue-600 text-white px-4 py-1 rounded"
                            >
                              {loadingupdate ? (
                                <span className="animate-spin">Saving...</span>
                              ) : (
                                "Save"
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={closeEditForm}
                              className="bg-gray-300 px-4 py-1 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">
                Loading Products......
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
