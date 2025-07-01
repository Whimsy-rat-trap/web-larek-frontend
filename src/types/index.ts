export interface ProductCard {
    id: string;                  // Уникальный идентификатор товара
    title: string;               // Название товара
    price: number | null;        // Цена товара (может быть null)
    category: string;            // Категория товара
    image: string;               // Путь к изображению (причина почему string: "/5_Dots.svg")
    description?: string;         // Описание товара
}

export interface Cart {
    items: CartItem[];           // Массив товаров в корзине
    total: number;               // Общая сумма заказа
}

export interface CartItem {
    productId: string;           // ID товара
    name: string;                // Название товара (можно использовать title из Product)
    price: number;               // Цена за единицу
    quantity: number;            // Количество (по умолчанию 1)
}

export interface CheckoutForm {
    payment: 'online' | 'on_delivery'; // Способ оплаты (соответствует API)
    address: string;            // Адрес доставки
    email: string;              // Email для уведомлений
    phone: string;              // Контактный телефон
    total: number;              // Итоговая сумма (добавлено согласно API)
    items: string[];            // Массив ID товаров (соответствует API)
}

export interface SuccessfulCheckoutResponse {
    id: string;                 // ID заказа (в API используется id)
    total: number;              // Итоговая сумма
}

export interface ProductListResponse {
    total: number;              // Общее количество товаров
    items: ProductCard[];       // Массив товаров
}