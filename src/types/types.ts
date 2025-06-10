export type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    ratings?: number;
    reviews?: number;
    image: string;
};

export const categories = [
  "Men's Fashion",
  "Women's Fashion",
  "Beauty & Personal Care",
  "Electronics",
  "Home & Living",
  "Baby & Kids",
  "Books & Stationery",
  "Health & Wellness",
  "Grocery & Food",
  "Travel & Luggage",
  "Tools & Hardware",
  "Gaming",
  "Pet Supplies",
  "Gifts & Occasions"
];
