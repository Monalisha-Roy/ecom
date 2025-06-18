export function ProductsDropdown({
  productsOpen,
  setProductsOpen,
  categories,
  handleCategoryClick
}: {
    productsOpen: boolean;
    setProductsOpen: (open: boolean) => void;
    categories: { id: string; slug: string }[]; // Changed to string
    handleCategoryClick: (categoryId: string) => void; // Changed to string
}) {
  return (
    <div className="relative group">
      <button
        onClick={() => setProductsOpen(!productsOpen)}
        className="text-gray-700 hover:text-primary mx-4 flex items-center"
        type="button"
      >
        Products
        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {productsOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setProductsOpen(false)}>
          <ul
            className="absolute right-20 top-14 mt-2 bg-white shadow-lg rounded-b-md py-2 w-64 z-50"
            onClick={e => e.stopPropagation()}
          >
            {categories.map((category, idx) => (
              <li key={idx} className="font-semibold text-gray-700 hover:text-primary text-base block py-2 px-4">
                <button onClick={() => handleCategoryClick(category.id)}>
                  {category.slug}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}