# Проектная работа "Веб-ларек"

Интернет-магазин с каталогом товаров, корзиной покупок и системой оформления заказов.

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды:

```bash
npm install
npm run start
```

или

```bash
yarn
yarn start
```

Для корректной работы проекта требуется создать файл `.env` в корневой директории:

```bash
touch .env
```

Внутри `.env` необходимо указать базовый URL API-сервера:

```
API_ORIGIN=https://larek-api.nomoreparties.co
```

## Сборка

```bash
npm run build
```

или

```bash
yarn build
```

## Архитектура приложения

Проект построен на основе архитектурного паттерна **MVP (Model-View-Presenter)** с использованием следующих технологий:

- **HTML** - разметка страниц
- **SCSS** - стилизация компонентов
- **TypeScript** - типизированный JavaScript
- **Webpack** - сборка проекта

### Архитектурные паттерны

#### MVP (Model-View-Presenter)
Приложение использует паттерн MVP для разделения логики:

- **Model** (`AppData`) - управление данными приложения
- **View** (UI компоненты) - отображение интерфейса
- **Presenter** (классы в `presenters/`) - связующее звено между моделью и представлением

#### Паттерн Singleton
`ModalManager` реализован как синглтон для централизованного управления модальными окнами.

## Структура проекта

```
src/
├── components/           # Компоненты приложения
│   ├── base/            # Базовые классы
│   │   ├── api.ts       # HTTP клиент для работы с API
│   │   ├── BasePresenter.ts  # Базовый класс для презентеров
│   │   └── events.ts    # Система событий
│   ├── presenters/      # Презентеры (MVP паттерн)
│   │   ├── ApplicationPresenter.ts  # Главный презентер приложения
│   │   ├── BasketPresenter.ts       # Презентер корзины
│   │   ├── OrderPresenter.ts        # Презентер оформления заказа
│   │   └── ProductPresenter.ts      # Презентер товаров
│   ├── AppData.ts       # Модель данных приложения
│   ├── Basket.ts        # Компонент корзины
│   ├── Card.ts          # Компонент карточки товара
│   ├── CardList.ts      # Компонент списка карточек
│   ├── Contacts.ts      # Компонент формы контактов
│   ├── ModalManager.ts  # Менеджер модальных окон
│   ├── Order.ts         # Компонент формы заказа
│   └── SuccessModal.ts  # Компонент модального окна успеха
├── types/
│   └── index.ts         # Типы данных и интерфейсы
├── utils/
│   ├── constants.ts     # Константы приложения
│   └── utils.ts         # Вспомогательные функции
├── pages/
│   └── index.html       # HTML-файл главной страницы
├── scss/
│   └── styles.scss      # Корневой файл стилей
└── index.ts             # Точка входа приложения
```

## Описание компонентов

### Базовые классы

#### `BasePresenter`
Абстрактный базовый класс для всех презентеров в MVP архитектуре.

**Интерфейс:**
```typescript
abstract class BasePresenter {
    protected view: any;
    protected model: any;
    constructor(view: any, model: any);
    protected abstract init(): void;
}
```

#### `Api`
HTTP клиент для взаимодействия с сервером.

**Основные методы:**
- `get(uri: string)` - GET запрос
- `post(uri: string, data: object)` - POST запрос

### Модель данных

#### `AppData`
Центральная модель приложения, управляющая состоянием каталога, корзины и заказов.

**Интерфейс:**
```typescript
class AppData {
    protected _catalog: Product[];
    protected _basket: string[];
    protected _order: IOrder;
    
    // Методы управления каталогом
    setCatalog(items: Product[]): void;
    get catalog(): Product[];
    
    // Методы управления корзиной
    addToBasket(item: Product): void;
    removeFromBasket(id: string): void;
    clearBasket(): void;
    get basket(): string[];
    
    // Методы работы с API
    async getProducts(): Promise<Product[]>;
    async submitOrder(order: IOrder): Promise<{id: string, total: number}>;
}
```

### Презентеры (MVP)

#### `ApplicationPresenter`
Главный презентер, координирующий работу всех остальных презентеров.

**Функции:**
- Инициализация всех дочерних презентеров
- Настройка взаимодействия между компонентами
- Управление жизненным циклом приложения

#### `ProductPresenter`
Управляет отображением каталога товаров и детальной информацией о товарах.

#### `BasketPresenter`
Управляет отображением и логикой работы корзины покупок.

#### `OrderPresenter`
Управляет процессом оформления заказа через формы оплаты и контактов.

### UI Компоненты

#### `Card`
Компонент карточки товара для отображения в каталоге и модальных окнах.

**Интерфейс:**
```typescript
class Card {
    constructor(template: HTMLTemplateElement, actions?: ICardActions);
    setCategory(value: string): void;
    render(product: Product): HTMLElement;
}
```

**Функции:**
- Отображение информации о товаре (название, цена, категория, изображение)
- Обработка кликов для открытия детальной информации
- Стилизация категорий товаров

#### `Basket`
Компонент корзины покупок.

**Интерфейс:**
```typescript
class Basket {
    addItem(product: Product): void;
    removeItem(productId: string): void;
    clearBasket(): void;
    getState(): {items: Product[], total: number};
    getBasketData(): {items: string[], total: number};
    proceedToCheckout(): void;
}
```

**Функции:**
- Добавление/удаление товаров
- Подсчет общей стоимости
- Обновление счетчика товаров
- Переход к оформлению заказа

#### `Order`
Компонент формы оплаты и адреса доставки.

**Функции:**
- Выбор способа оплаты (онлайн/при получении)
- Ввод адреса доставки
- Валидация данных формы

#### `Contacts`
Компонент формы контактных данных.

**Функции:**
- Ввод email и телефона
- Валидация контактных данных
- Финальная отправка заказа

#### `SuccessModal`
Компонент модального окна успешного оформления заказа.

**Функции:**
- Отображение информации об успешном заказе
- Показ итоговой суммы
- Очистка корзины после заказа

#### `ModalManager`
Синглтон для централизованного управления модальными окнами.

**Функции:**
- Открытие/закрытие модальных окон
- Управление фокусом и скроллом
- Обработка клавиш (ESC для закрытия)

## Типы данных

### Основные интерфейсы

#### `Product`
```typescript
interface Product {
    id: string;           // Уникальный идентификатор
    title: string;        // Название товара
    category: string;     // Категория товара
    image: string;        // URL изображения
    price: number | null; // Цена (null для бесценных товаров)
    description?: string; // Описание товара
}
```

#### `IOrder`
```typescript
interface IOrder {
    payment: string;    // Способ оплаты
    email: string;      // Email покупателя
    phone: string;      // Телефон покупателя
    address: string;    // Адрес доставки
    items: string[];    // Массив ID товаров
    total: number;      // Общая сумма заказа
}
```

#### `IAppState`
```typescript
interface IAppState {
    catalog: Product[];      // Каталог товаров
    basket: string[];        // ID товаров в корзине
    preview: string | null;  // ID товара для предпросмотра
    order: IOrder | null;    // Данные текущего заказа
}
```

#### `ApiListResponse<Type>`
```typescript
interface ApiListResponse<Type> {
    total: number;    // Общее количество элементов
    items: Type[];    // Массив элементов
}
```

### Классы данных

#### `BasketItem`
```typescript
class BasketItem {
    constructor(
        public readonly productId: string,
        public readonly name: string,
        public readonly price: number
    );
}
```

#### `Order`
```typescript
class Order {
    constructor(
        public readonly payment: 'online' | 'on_delivery',
        public readonly address: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly total: number,
        public readonly items: string[]
    );
}
```

## Взаимодействие компонентов

### Поток данных

1. **Инициализация приложения:**
	- `ApplicationPresenter` создает все дочерние презентеры
	- `ProductPresenter` загружает каталог товаров через `AppData`
	- Товары отображаются в галерее через компоненты `Card`

2. **Просмотр товара:**
	- Клик по карточке товара → открытие модального окна с деталями
	- `ProductPresenter` управляет отображением детальной информации

3. **Добавление в корзину:**
	- Клик "В корзину" → `Basket.addItem()` → обновление счетчика
	- `BasketPresenter` синхронизирует UI с моделью данных

4. **Оформление заказа:**
	- Клик "Оформить" в корзине → открытие формы оплаты
	- `OrderPresenter` управляет последовательностью форм:
		- Форма оплаты (`Order`) → Форма контактов (`Contacts`) → Отправка заказа
	- Успешный заказ → `SuccessModal` → очистка корзины

### Схема взаимодействия

```
ApplicationPresenter (главный координатор)
├── ProductPresenter
│   ├── Card (каталог)
│   └── Card (модальное окно товара)
├── BasketPresenter
│   └── Basket (корзина + счетчик)
└── OrderPresenter
    ├── Order (форма оплаты)
    ├── Contacts (форма контактов)
    └── SuccessModal (успешный заказ)

AppData (модель данных)
├── catalog: Product[]
├── basket: string[]
└── order: IOrder

ModalManager (управление модальными окнами)
```

### События и коммуникация

- **Презентеры** используют модель `AppData` для получения и изменения данных
- **UI компоненты** уведомляют презентеры о пользовательских действиях
- **ModalManager** централизованно управляет всеми модальными окнами
- **API** взаимодействие происходит через класс `Api` в `AppData`

## Основные страницы и модальные окна

1. **Главная страница** - отображение каталога товаров
2. **Модальное окно товара** - детальная информация и добавление в корзину
3. **Модальное окно корзины** - управление содержимым корзины
4. **Модальное окно оплаты** - выбор способа оплаты и ввод адреса
5. **Модальное окно контактов** - ввод email и телефона
6. **Модальное окно успеха** - подтверждение успешного заказа

Каждое модальное окно управляется соответствующим презентером и использует единую систему `ModalManager` для открытия/закрытия.