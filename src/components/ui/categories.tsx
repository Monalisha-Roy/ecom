import { categories } from "@/types/types";

export default function Categories() {
    return (
        <main className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-5">
          {categories.map((category) => (
        <div
          key={category}
          className="border border-gray-300 rounded-lg p-4 h-96 bg-white"
        >
          <h3 className="font-semibold mb-2">{category}</h3>
          <div className="grid grid-cols-2 items-center gap-4">
            {/* Render items or images here if needed */}
          </div>
        </div>
      ))}
        </main>
    );
}