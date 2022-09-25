
export interface Offert {
    id?: string;
    name: string;
    description?: string;
    products: string[];
    price: string;
    is_offert: boolean;
    real_price?: string;
    date: number;
    created_by?: string;
}