export interface Delivery {
    id?: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    note?: string;
    paymentType: string;
    products: any[];
    totalVaue: string;
    status: string;
    date: string;
}