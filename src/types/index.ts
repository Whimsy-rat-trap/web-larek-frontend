class Product {
    id!: string;
    image!: string;
    title!: string;
    category!: string;
    price!: number | null;
    description?: string;
}

class BasketItem {
    productId!: string;
    name!: string;
    price!: number;
    quantity = 1;
}

class Basket {
    items!: BasketItem[];
    total!: number;
}

class Order {
    payment!: 'online' | 'on_delivery';
    address!: string;
    email!: string;
    phone!: string;
    total!: number;
    items!: string[];
}

class SuccessfulOrderResponse {
    id!: string;
    total!: number;
}

class ProductListResponse {
    total!: number;
    items!: Product[];
}