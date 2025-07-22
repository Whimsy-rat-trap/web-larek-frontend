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
		- page:main:loaded
		- product:details_requested
		- order:delivery_set (от Модального окна оформления заказа)
		- order:payment_set (от Модального окна оформления заказа)
		- ui:order:input:mail:changed (от Модального окна оформления заказа)
		- ui:order:input:phone:changed (от Модального окна оформления заказа)
	- **Команды**:
		- loadProducts()
			- Публикует события: products_list:loaded (при успехе)
			- Вызывается по событию: page:main:loaded
		- loadProductDetails(productId)
			- Публикует события: product:details_loaded (при успехе)
			- Вызывается по событию: product:details_requested
		- submitOrder(orderData)
			- Публикует события:
				- order:sent (при отправке)
				- order:submitted (при успешном ответе 200)
			- Вызывается по событию: order:ready

2. **Cart Service**:
    - Управляет состоянием корзины
    - Слушает события:
		- modal:product:cart_item_added (от Модального окна оформления заказа)
		- modal:product:item_removed (от Модального окна оформления заказа)
	- **Команды**:
		- addToCart()
			- Вызывается по событию: modal:product:cart_item_added
			- Публикует:
				- cart:item_added (при успехе)
				- cart:item_add_error (при ошибке)
				- cart:updated (всегда)
		- removeFromCart(itemId)
			- Вызывается по событию: modal:cart:item_removed
			- Публикует:
				- cart:item_removed
				- cart:updated
		- clearCart()
			- Вызывается по событию: ui:order:button:payment:clicked
			- Публикует: cart:clear

3. **Modal Service**:
	- Управляет открытием / закрытием модальных окон
	- Слушает события:
		- ui:button:cart:clicked (от Кнопки "Корзина")
		- ui:order:button:start_clicked (от Модального окна корзины)
		- ui:order:button:next:clicked (от Модального окна оформления заказа)
		- ui:order:button:payment:clicked (от Модального окна контактных данных)
		- order:submitted (от API-сервиса)
		- product:details_requested (от Карточки товара)
	- **Команды**:
		- openCartModal()
			- Вызывается по событию: ui:button:cart:clicked
			- Публикует: modal:opened (тип: 'cart')
		- openProductModal(productId)
			- Вызывается по: product:details_requested
			- Публикует: modal:opened (тип: 'product')
		- openOrderModal()
			- Вызывается по: ui:order:button:start_clicked
			- Публикует: modal:opened (тип: 'order')
		- openContactsModal()
			- Вызывается по: ui:order:button:next:clicked
			- Публикует:
				- modal:closed (текущее окно)
				- modal:opened (тип: 'contacts')
		- openSuccessModal()
			- Вызывается по событию: order:submitted
			- Публикует: 
				- modal:closed (текущее окно)
				- modal:opened (с типом 'success')
		- closeCurrentModal()
			- Публикует: modal:closed
			- Вызывается:
				- При ручном закрытии модального окна пользователем
				- При успешном оформлении заказа (после открытия success-модалки)

4. **Order Service**:
	- Управляет процессом оформления заказа
	- Слушает события:
		- ui:order:button:start_clicked (от Модального окна корзины)
		- ui:order:button:next:clicked (от Модального окна оформления заказа)
		- ui:order:button:payment:clicked (от Модального окна контактных данных)
	- **Команды**:
		- initOrder()
			- Вызывается по событию: ui:order:button:start_clicked
			- Публикует событие: order:initiated (от Модального окна оформления заказа)
		- prepareOrder() 
			- Вызывается по:
				- ui:order:button:next:clicked (шаг оформления)
				- ui:order:button:payment:clicked (финальное подтверждение)
			- Публикует: order:ready (в API-сервис)

5. **Validation Service**:
	- Проверяет корректность введенных данных
	- Слушает события:
		- ui:order:input:delivery:changed
		- ui:order:select:payment:changed
		- ui:order:input:mail:changed
		- ui:order:input:phone:changed
	- **Команды**:
		- validateDelivery(address)
			- Вызывается по событию: ui:order:input:delivery:changed
			- Публикует: order:delivery_valid, order:validation_error
		- validatePayment(method)
			- Вызывается по событию: ui:order:select:payment:changed
			- Публикует: payment:valid, payment:validation_error
		- validateEmail(email)
			- Вызывается по событию: ui:order:input:mail:changed
			- Публикует: email:valid, email:validation_error
		- validatePhone(phone)
			- Вызывается по событию: ui:order:input:phone:changed
			- Публикует: phone:valid, phone:validation_error

### Основные компоненты и их события:

1. **Главная страница**
	- Слушает события:
		- products_list:loaded (от API Service) - для отрисовки каталога
		- cart:updated (от Cart Service) - для обновления счетчика корзины
	- Публикует события:
		- page:main:loaded (при загрузке страницы)
		- ui:button:cart:clicked (при клике на кнопку корзины)
		- product:details_requested (при клике на карточку товара)
	
2. **Карточка товара (в каталоге)**
	- Слушает события:
		- products_list:loaded (от API Service) - получение данных для отрисовки
    - Публикует события:
		- product:details_requested (при клике на товар)
		
3. **Модальное окно карточки товара**
	- Слушает события:
		- product:details_loaded (от API Service)
		- cart:item_added (от Cart Service) - подтверждение добавления
		- cart:item_add_error (от Cart Service) - ошибка добавления
	- Публикует события:
		- modal:product:cart_item_added (при клике "Добавить в корзину")
		- modal:closed (при закрытии окна)

4. **Модальное окно корзины**
	- Слушает события:
		- cart:updated (от Cart Service)
		- cart:item_removed (от Cart Service)
		- cart:clear (от Cart Service)
	- Публикует события:
		- modal:cart:item_removed (при удалении товара)
		- ui:order:button:start_clicked (при клике "Оформить заказ")
		- modal:closed (при закрытии окна)

5. **Модальное окно оформления заказа (адрес+оплата)**
	- Слушает события:
		- order:delivery_valid (от Validation Service)
		- order:validation_error (от Validation Service)
		- order:payment_valid (от Validation Service)
	- Публикует события:
		- ui:order:input:delivery:changed (при изменении адреса)
		- ui:order:select:payment:changed (при изменении способа оплаты)
		- ui:order:button:next:clicked (при клике "Далее")
		- modal:closed (при закрытии окна)

6. **Модальное окно контактных данных**
	- Слушает события:
		- email:valid (от Validation Service)
        - email:validation_error (от Validation Service)
		- phone:valid (от Validation Service)
		- phone:validation_error (от Validation Service)
	- Публикует события:
		- ui:order:input:mail:changed (при изменении email)
		- ui:order:input:phone:changed (при изменении телефона)
		- ui:order:button:payment:clicked (при клике "Оплатить")
		- modal:closed (при закрытии окна)

7. **Модальное окно подтверждения заказа**
	- Слушает события:
		- order:submitted (от API Service)
	- Публикует события:
		- modal:closed (при клике "За новыми покупками")
		- page:main:loaded (при возврате на главную)

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