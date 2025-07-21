# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

## Описание проекта

Проект представляет собой интернет-магазин (веб-ларек) с возможностью:
- Просмотра каталога товаров
- Просмотра детальной информации о товаре
- Добавления товаров в корзину
- Оформления заказа с указанием контактных данных и адреса доставки
- Выбора способа оплаты

## Структура проекта

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/pages/ — HTML страница
- src/types/ — типы и интерфейсы
- src/utils/ — вспомогательные утилиты и константы

## API и компоненты

### Ключевые API endpoints:
- `GET Product List` - получение списка товаров
- `GET Product Item` - получение информации о конкретном товаре
- `POST Order` - оформление заказа

### Основные сервисы:

1. **API Service**:
    - Проверяет корректность введённых данных
    - Слушает события:
      - order:delivery_set (от Модального окна оформления заказа)
      - order:payment_set (от Модального окна оформления заказа)
      - ui:order:input:mail:changed (от Модального окна оформления заказа)
      - ui:order:input:phone:changed (от Модального окна оформления заказа)
    - Публикует события:
      - order:delivery_valid (в Модальное окно оформления заказа)
      - order:validation_error (в Модальное окно оформления заказа)
      - order:payment_valid (в Модальное окно оформления заказа)

2. **Cart Service**:
    - Управляет состоянием корзины
    - Слушает события:
      - modal:product:cart_item_added (от Модального окна оформления заказа)
      - modal:product:item_removed (от Модального окна оформления заказа)
    - Публикует события:
      - cart:item_added (В Список товаров корзины)
      - cart:item_add_error (никем не обрабатывается)
      - cart:item_removed (в Список товаров корзины)
      - cart:updated (в Список товаров и счётчик)
      - cart:clear (в Список товаров и счётчик)

3. **Modal Service**:
   - Управляет открытием / закрытием модальных окон
   - Слушает события:
     - ui:button:cart:clicked (от Кнопки "Корзина")
     - ui:order:button:next:clicked (от Модального окна оформления заказа)
     - order:submitted (от API-сервиса)
   - Публикует события:
     - modal:opened (окно открыто)
     - modal:closed (окно закрыто)

4. **Order Service**:
   - Управляет процессом оформления заказа
   - Слушает события:
     - ui:order:button:start_clicked (от Модального окна корзины)
     - ui:order:button:next:clicked (от Модального окна оформления заказа)
     - ui:order:button:payment:clicked (от Модального окна контактных данных)
   - Публикует события:
     - order:initiated (от Модального окна оформления заказа)
     - order:ready (d API-сервис)

5. **Validation Service**:
   - Проверяет корректность введенных данных
   - Слушает события:
     - order:delivery_set (от Модального окна оформления заказа)
     - order:payment_set (от Модального окна оформления заказа)
     - ui:order:input:mail:changed (от Модального окна контактных данных)
     - ui:order:input:phone:changed (от Модального окна контактных данных)
   - Публикует события:
       - order:initiated (от Модального окна оформления заказа)
       - order:ready (d API-сервис)

### Список команд сервисов

1. **API Service Commands**:
	- loadProducts() → публикует products_list:loaded (при успехе)
		- Вызывается по событию: page:main:loaded
	- loadProductDetails(productId) → публикует product:details_loaded (при успехе)
		- Вызывается по событию: product:details_requested
	- submitOrder(orderData) → публикует:
		- order:sent (при отправке)
		- order:submitted (при успешном ответе 200)
		- Вызывается по событию: order:ready

2. **Cart Service Commands**:
	- addToCart(product) → публикует:
		- cart:item_added (при успехе)
		- cart:item_add_error (при ошибке)
		- cart:updated (всегда)
		- Вызывается по событию: modal:product:cart_item_added
	- removeFromCart(itemId) → публикует:
		- cart:item_removed
		- cart:updated
		- Вызывается по событию: modal:cart:item_removed
	- clearCart() → публикует:
		- cart:clear
		- Вызывается при: завершении заказа (по событию ui:order:button:payment:clicked)

3. **Order Service Commands**:
	- initOrder() → публикует order:initiated
		- Вызывается по событию: ui:order:button:start_clicked
	- prepareOrder() → публикует order:ready
		- Вызывается по:
			- ui:order:button:next:clicked (шаг оформления)
			- ui:order:button:payment:clicked (финальное подтверждение)
		
4. **Validation Service Commands**:
	- validateDelivery(address) → публикует:
		- order:delivery_valid (при успехе)
		- order:validation_error (при ошибке)
		- Вызывается по событию: order:delivery_set
	- validatePayment(method) → публикует:
		- order:payment_valid
		- order:validation_error
		- Вызывается по событию: order:payment_set
	- validateContactForm(data) → публикует:
		- order:delivery_valid/order:payment_valid (для разблокировки кнопок)
		- order:validation_error
		- Вызывается по:
			- ui:order:input:mail:changed
			- ui:order:input:phone:changed


### Основные компоненты:

1. **Главная страница**:
   - Каталог товаров (карточки товаров)
   - Кнопка корзины

2. **Модальные окна**:
   - Карточка товара:
     - Изображение товара
     - Название
     - Описание
     - Категория
     - Цена
     - Кнопка "Добавить в корзину"
   - Корзина:
     - Список товаров
     - Общая стоимость
     - Кнопка "Оформить заказ"
     - Кнопки удаления товаров
   - Оформление заказа:
     - Форма ввода адреса
     - Выбор способа оплаты
     - Кнопка "Далее"
   - Контактные данные:
     - Поля для email и телефона
     - Кнопка "Оплатить"
   - Подтверждение заказа:
     - Информация о успешном оформлении
     - Кнопка "За новыми покупками"

## События

Основные пользовательские сценарии:
1. Просмотр каталога товаров
2. Открытие карточки товара
3. Добавление товара в корзину
4. Управление корзиной (удаление товаров)
5. Оформление заказа:
   - Ввод адреса доставки
   - Выбор способа оплаты
   - Ввод контактных данных
6. Подтверждение заказа

## Модели данных

### Интерфейсы:

```typescript
// Тип для способов оплаты
export type PaymentMethod = 'online' | 'cash';

// Интерфейс товара
export interface IProduct {
  id: string; 
  title: string;
  price: number | null;
  description: string;
  category: string;
  image: string;
}

// Интерфейс корзины
export interface ICart {
  items: string[];   // Массив id товаров
  total: number;     // Общая стоимость
}

// Данные для оформления заказа
export interface IOrderRequest {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];   // Массив id товаров
}

// Ответ сервера на заказ
export interface IOrderResponse {
  id: string;       // ID заказа
  total: number;    // Сумма заказа
}

// Тип для данных формы
export type OrderFormData = Omit<IOrderRequest, 'total' | 'items'>;
```

## Архитектурный подход

Проект использует:
- Компонентный подход для UI элементов
- TypeScript для типизации данных
- Webpack для сборки проекта
- SCSS для стилей
- API для взаимодействия с сервером

Логика разделена на:
- Компоненты представления
- Модели данных
- Утилиты и вспомогательные функции

## Установка и запуск

### Требования:
- Node.js (версия 14 или выше)
- npm или yarn

### Установка зависимостей:

```
npm install
```

или

```
yarn
```

### Запуск в development режиме:

```
npm run start
```

или

```
yarn start
```

### Сборка production версии:

```
npm run build
```

или

```
yarn build
```

## Граф связей визуальных компонентов

```
Главная страница
├── Каталог товаров
│   └── Карточка товара (кнопка)
├── Кнопка корзины
│   └── Счётчик товаров
└── Модальное окно 
    ├── Модальное окно карточки товара
    │    └── Кнопка "Добавить в корзину"
    ├── Модальное окно корзины
    │    ├── Список товаров
    │    └── Кнопка "Оформить заказ"
    ├── Модальное окно оформления заказа
    │    ├── Форма адреса
    │    └── Кнопка "Далее"
    ├── Модальное окно контактных данных
    │    └── Кнопка "Оплатить"
    └── Модальное окно подтверждения заказа
        └── Кнопка "За новыми покупками!"               
```

## Граф событий

1. **Инициализация приложения**:
    - page:main:loaded → API Service.loadProducts() → products_list:loaded → Каталог товаров (отрисовка)

2. **Просмотр товара**:
    - Пользователь кликает на товар → product:details_requested → API Service.loadProductDetails() → product:details_loaded → Модальное окно карточки товара (открытие)

3. **Работа с корзиной**:
    - modal:product:cart_item_added → Cart Service.addToCart() → [cart:item_added, cart:updated] → [Список товаров корзины, Счётчик]
    - modal:cart:item_removed → Cart Service.removeFromCart() → [cart:item_removed, cart:updated] → [Список товаров корзины, Счётчик]
    - ui:button:cart:clicked → Modal Service → modal:opened → Модальное окно корзины (открытие)

4. **Оформление заказа**:
    - ui:order:button:start_clicked → Order Service.initOrder() → order:initiated → Модальное окно оформления заказа (открытие)

   Шаги оформления:
   a) Ввод адреса:
    - order:delivery_set → [API Service, Validation Service.validateDelivery()] → order:delivery_valid → Модальное окно оформления заказа (разблокировка кнопки)

   b) Выбор оплаты:
    - order:payment_set → [API Service, Validation Service.validatePayment()] → order:payment_valid → Модальное окно оформления заказа (разблокировка кнопки)

   c) Контактные данные:
    - [ui:order:input:mail:changed, ui:order:input:phone:changed] → Validation Service.validateContactForm() → [order:delivery_valid/order:payment_valid] → Модальное окно контактных данных (разблокировка кнопки)

   d) Подтверждение:
    - ui:order:button:payment:clicked → Cart Service.clearCart() → cart:clear → [Список товаров, Счётчик]
    - ui:order:button:payment:clicked → Order Service.prepareOrder() → order:ready → API Service.submitOrder() → order:submitted → Modal Service → modal:closed → Модальное окно подтверждения заказа (открытие)

5. **Закрытие модальных окон**:
    - Любое закрытие → modal:closed → Обновление UI

**Ключевые потоки событий**:

A. Добавление товара в корзину:
Карточка товара → modal:product:cart_item_added → Cart Service → cart:item_added → Корзина

B. Оформление заказа:
Корзина → ui:order:button:start_clicked → Order Service → Модальные окна оформления → order:ready → API Service → order:submitted → Подтверждение

C. Валидация данных:
Формы ввода → [order:delivery_set, order:payment_set, input:changed] → Validation Service → [valid/error] → UI feedback

## Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами