import { Product } from "./Product";

export interface Address {
    firstName: string;
    lastName: string;
    country: string;
    state: string;
    city: string;
    address1: string;
    address2: string;
    postalCode: string;
    phone: string;
    email: string;
    isCompany?: boolean;
    companyName?: string;
    companyICO?: string;
    companyDIC?: string;
    companyICDPH?: string;
}

export interface ShippingMethod {
    id: string;
    name: string;
    price: number;
    currency: string;
}

export interface OrderCartItem extends Product {
    quantity: number;
}

export interface OrderBody {
    orderId: string;
    orderDate: string;
    cartItems: OrderCartItem[];
    shippingForm: Address;
    billingForm: Address;
    shippingMethod: ShippingMethod;
    paymentMethodId: string;
    codFee?: number;
    locale?: string;
}
