export type Category = {
    id: string;
    name: string;
    slug: string;
};

export type Product = {
    id?: string;
    name: string;
    description: string;
    price: number;
    category_id: string;
    image_url: string;
    stock: number;
    discount_percentage: number;
    featured: boolean;
    created_at?: string;
    updated_at?: string;
};
