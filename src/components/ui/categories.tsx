import { categories } from "../../../src/types/types";

export default function Categories() {
    return (
        <main className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-5">
            {Object.entries(categories).map(([categoryName, items]: [string, string[]]) => (
            <div
                key={categoryName}
                className="border border-gray-300 rounded-lg p-4 w-[-510px] h-96 bg-white"
            >
                <h3 className="font-semibold mb-2">{categoryName}</h3>
                <div className="grid grid-cols-2 items-center gap-4">
                {/* Render items or images here if needed */}
                </div>
            </div>
            ))}
        </main>
    );
}