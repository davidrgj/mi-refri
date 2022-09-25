export interface Product {
    id?: string;
    name: string;
    category?: string;
    description: string;
    price: string;
    grammage: string;
    is_offert: boolean;
    real_price?: string;
    image: any;
    date: number;
    created_by?: string;
}