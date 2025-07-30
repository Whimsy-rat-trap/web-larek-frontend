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
  - components/ — папка с JS компонентами
    - base/ — базовые классы (API, EventEmitter)
    - services/ — сервисы приложения 
    - Page.ts — главная страница 
    - Modal.ts и производные — модальные окна
  - pages/ 
    - index.html — HTML страница
  - types/ — типы и интерфейсы
  - utils/ — вспомогательные утилиты и константы

## API и компоненты

### Ключевые API endpoints:
- `GET Product List` - получение списка товаров
- `GET Product Item` - получение информации о конкретном товаре
- `POST Order` - оформление заказа

### Основные сервисы:

1. **API Service**:
	- Работает с API магазина
	- Интегрирован с AppState для хранения данных
	- Слушает события:
		- AppEvents.PAGE_MAIN_LOADED - загрузка главной страницы
		- AppEvents.PRODUCT_DETAILS_REQUESTED - запрос деталей товара
		- AppEvents.ORDER_SUBMITTED - событие формирования заказа
	- **Команды**:
		- loadProducts()
			- Загружает список товаров
			- Сохраняет в AppState.catalog
			- Публикует: CATALOG_UPDATED
		- loadProductDetails(productId)
			- Загружает детали товара
			- Публикует: AppEvents.PRODUCT_DETAILS_LOADED
		- submitOrder(orderData)
			- Формирует и отправляет заказ на сервер
            - Использует данные из AppState (корзина и форма заказа)
			- Публикует:
				- AppEvents.ORDER_SENT (при отправке)
				- AppEvents.ORDER_SUBMITTED (при успехе)

2. **Cart Service**:
    - Управляет состоянием корзины через AppState
    - Слушает события:
		- AppEvents.MODAL_PRODUCT_CART_ITEM_ADDED (от Модального окна оформления заказа)
		- AppEvents.MODAL_CART_ITEM_REMOVED (от Модального окна оформления заказа)
        - AppEvents.ORDER_SUBMITTED (от API Service)
	- **Команды**:
		- addToCart(productId)
			- Вызывается по событию: AppEvents.MODAL_PRODUCT_CART_ITEM_ADDED
			- Публикует:
				- AppEvents.CART_ITEM_ADDED (при успехе)
				- AppEvents.CART_ITEM_ADD_ERROR (при ошибке)
				- AppEvents.CART_UPDATED (всегда)
		- removeFromCart(productId)
			- Вызывается по событию: AppEvents.MODAL_CART_ITEM_REMOVED
			- Публикует:
				- AppEvents.CART_ITEM_REMOVED
				- AppEvents.CART_UPDATED
		- clearCart()
			- Вызывается по событию: AppEvents.ORDER_SUBMITTED
			- Публикует: AppEvents.CART_CLEAR (после успешного оформления заказа)

3. **Modal Service**:
	- Управляет открытием / закрытием модальных окон
	- Слушает события:
		- AppEvents.UI_BUTTON_CART_CLICKED (от Кнопки "Корзина")
        - AppEvents.PRODUCT_DETAILS_REQUESTED (от Карточки товара)
		- AppEvents.UI_ORDER_BUTTON_START_CLICKED (от Модального окна корзины)
		- AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED (от Модального окна оформления заказа)
		- AppEvents.ORDER_SUBMITTED (от ApiService при успешной отправке заказа)
	- **Команды**:
		- openCartModal()
			- Вызывается по событию: AppEvents.UI_BUTTON_CART_CLICKED
			- Публикует: AppEvents.MODAL_OPENED (тип: 'cart')
		- openProductModal(productId)
			- Вызывается по: AppEvents.PRODUCT_DETAILS_REQUESTED
			- Публикует: AppEvents.MODAL_OPENED (тип: 'product')
		- openOrderModal()
			- Вызывается по: AppEvents.UI_ORDER_BUTTON_START_CLICKED
			- Публикует: AppEvents.MODAL_OPENED (тип: 'order')
		- openContactsModal()
			- Вызывается по: AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED
			- Публикует: AppEvents.MODAL_OPENED (тип: 'contacts')
		- openSuccessModal()
			- Вызывается по событию: AppEvents.ORDER_SUBMITTED
			- Публикует: AppEvents.MODAL_OPENED (с типом 'success')
		- closeModal()
			- Публикует: MODAL_CLOSED
			- Вызывается при ручном закрытии модального окна пользователем
			- Сбрасывает состояние модального окна

4. **Order Service**:
	- Управляет процессом оформления заказа
    - Интегрирован с AppState для хранения данных заказа
	- Слушает события:
		- AppEvents.UI_ORDER_BUTTON_START_CLICKED (от кнопки "Оформить заказ" в корзине)
		- AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED (от кнопки "Далее" в форме заказа)
		- ppEvents.UI_ORDER_BUTTON_PAYMENT_CLICKED (от кнопки "Оплатить" в форме контактов)
	- **Команды**:
		- initOrder()
			- Вызывается по событию: AppEvents.UI_ORDER_BUTTON_START_CLICKED
			- Публикует событие: AppEvents.ORDER_INITIATED (для инициализации процесса заказа)
		- prepareOrder(step) 
			- Подготавливает заказ к отправке
			- Для шага 'payment' проверяет валидность через AppState
			- При валидности публикует AppEvents.ORDER_READY
    	- validate()
          - Агрегирует результаты валидации от ValidationService 
          - Проверяет что у order: 
            - Все обязательные поля заполнены 
            - Нет конфликтующих значений 
          - Формирует общий флаг isValid 
          - Публикует AppEvents.ORDER_READY с результатом
    - **Взаимодействие с ValidationService**:
      - Получает события успешной/неуспешной валидации полей 
      - Агрегирует результаты валидации отдельных полей 
      - Принимает окончательное решение о готовности заказа 
      - Пример цепочки: 
        - ValidationService проверяет формат email → AppEvents.ORDER_EMAIL_VALID 
        - OrderService получает это событие и обновляет состояние 
        - При попытке отправки OrderService проверяет все подобные флаги

5. **Validation Service**:
	- Проверяет корректность введенных данных
	- Слушает события:
		- AppEvents.UI_ORDER_INPUT_DELIVERY_CHANGED (из OrderModal - при изменении поля адреса)
		- AppEvents.UI_ORDER_SELECT_PAYMENT_CHANGED (из OrderModal - при изменении способа оплаты)
		- ppEvents.UI_ORDER_INPUT_MAIL_CHANGED (из ContactsModal - при изменении email)
		- AppEvents.UI_ORDER_INPUT_PHONE_CHANGED (из ContactsModal - при изменении телефона)
	- **Команды**:
		- validateDelivery(address: string)
          - Проверяет форма адреса на пустоту
          - Вызывается по событию: AppEvents.UI_ORDER_INPUT_DELIVERY_CHANGED
          - Публикует: 
            - AppEvents.ORDER_DELIVERY_VALID (при успехе)
            - AppEvents.ORDER_VALIDATION_ERROR (при ошибке)
		- validatePayment(method)
      		- Проверяет что выбран один из допустимых способов ('online' или 'cash')
			- Вызывается по событию: AppEvents.UI_ORDER_SELECT_PAYMENT_CHANGED
			- Публикует:
              - AppEvents.ORDER_PAYMENT_VALID (при успехе)
              - AppEvents.ORDER_PAYMENT_VALIDATION_ERROR (при ошибке)
		- validateEmail(email)
      		- Проверяет email по регулярному выражению
			- Вызывается по событию: AppEvents.UI_ORDER_INPUT_MAIL_CHANGED
			- Публикует:
              - AppEvents.ORDER_EMAIL_VALID (при успехе)
              - AppEvents.ORDER_EMAIL_VALIDATION_ERROR (при ошибке)
		- validatePhone(phone)
			- Проверяет телефон по регулярному выражению
            - Вызывается по событию: AppEvents.UI_ORDER_INPUT_PHONE_CHANGED
			- Публикует:
              - AppEvents.ORDER_PHONE_VALID (при успехе)
              - AppEvents.ORDER_PHONE_VALIDATION_ERROR (при ошибке)

6. **AppState (Service)**:
	- Централизованное хранилище состояния приложения
    - Не слушает события напрямую, получает данные через методы
	- **Свойства**:
		- catalog: IProduct[] - список товаров
		- basket: string[] - ID товаров в корзине
        - basketTotal: number - общая сумма корзины
		- order: IOrderFormState - данные заказа
		- preview: string | null - ID просматриваемого товара
	- **Методы**:
      - set catalog(items: IProduct[]):
        - Обновляет каталог товаров
        - Публикует: StateEvents.CATALOG_UPDATED - при обновлении каталога товаров
      - set basket(items: IProduct[]):
        - Обновляет корзину
        - Автоматически пересчитывает сумму (basketTotal)
        - Публикует:
          - StateEvents.BASKET_UPDATED - при изменении корзины (включая обновление суммы)
          - AppEvents.CART_UPDATED - дополнительное событие при обновлении корзины
      - set order(form: Partial<IOrderFormState>):
        - Обновляет данные заказа
        - Выполняет валидацию заказа (проверяет заполнение обязательных полей)
        - Публикует: StateEvents.ORDER_FORM_UPDATED - при изменении данных заказа
      - set preview(id: string | null):
        - Устанавливает ID просматриваемого товара
        - Публикует: StateEvents.PREVIEW_UPDATED - при изменении просматриваемого товара
      - Геттеры:
        - state: IAppState - возвращает текущее состояние 
        - basketTotal: number - возвращает сумму корзины

### Основные компоненты и их события:

1. **Главная страница(Page)**
	- Слушает события:
		- StateEvents.CATALOG_UPDATED (от AppState) - для отрисовки каталога
		- StateEvents.BASKET_UPDATED (от AppState) - для обновления счетчика корзины
	- Публикует события:
		- AppEvents.PAGE_MAIN_LOADED (при инициализации страницы - эмитится один раз)
		- AppEvents.UI_BUTTON_CART_CLICKED (при клике на кнопку корзины)
		- AppEvents.PRODUCT_DETAILS_REQUESTED (при клике на карточку товара)
	
2. **Карточка товара (в каталоге)**
   - Рендерится внутри Page 
   - Не является отдельным классом-компонентом, реализована как часть главной страницы (Page)
   - Создается динамически в методе createProductElement() класса Page
   - Публикует события:
     - AppEvents.PRODUCT_DETAILS_REQUESTED (при клике на карточку товара, передает id товара)
		
3. **Модальное окно карточки товара (ProductModal)**
	- Слушает события:
		- AppEvents.PRODUCT_DETAILS_LOADED (от ApiService) - данные товара для отображения
	- Публикует события:
		- AppEvents.MODAL_PRODUCT_CART_ITEM_ADDED (при клике "Добавить в корзину")
		- AppEvents.MODAL_CLOSED (при закрытии окна)

4. **Модальное окно корзины (CartModal)**
	- Слушает события:
   		- AppEvents.MODAL_OPENED (от ModalService) - при открытии модального окна с типом 'cart'
		- AppEvents.CART_UPDATED (от CartService) - при любом изменении состояния корзины
		- AppEvents.CART_ITEM_ADDED (от CartService) - при успешном добавлении товара в корзину
        - AppEvents.CART_ITEM_REMOVED (от CartService) - при удалении товара из корзины
		- AppEvents.CART_CLEAR (от CartService) - при полной очистке корзины (после успешного оформления заказа)
	- Публикует события:
		- AppEvents.MODAL_CART_ITEM_REMOVED (при клике на кнопку удаления товара) - передает ID товара
		- AppEvents.UI_ORDER_BUTTON_START_CLICKED (при клике на кнопку "Оформить заказ")
        - AppEvents.CART_UPDATED (при обновлении состояния корзины)
        - AppEvents.MODAL_CLOSED (при закрытии окна)

5. **Модальное окно оформления заказа (OrderModal)**
	- Слушает события:
		- AppEvents.ORDER_INITIATED (от OrderService) - инициализация формы заказа
		- AppEvents.ORDER_DELIVERY_SET (сам публикует, слушает AppState) - при изменении адреса доставки
		- AppEvents.ORDER_PAYMENT_SET (сам публикует, слушает AppState) - при изменении способа оплаты
	- Публикует события:
		- AppEvents.UI_ORDER_INPUT_DELIVERY_CHANGED (при изменении поля адреса) → ValidationService.validateDelivery()
		- AppEvents.ORDER_PAYMENT_SET (при выборе способа оплаты) → AppState
        - AppEvents.ORDER_DELIVERY_SET (при успешном вводе адреса) → AppState
		- AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED (при клике "Далее") → OrderService.prepareOrder('delivery')
		- AppEvents.MODAL_CLOSED (при закрытии окна)

6. **Модальное окно контактных данных (ContactsModal)**
	- Слушает события:
		- AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED (от OrderModal - при переходе к шагу контактов)
        - AppEvents.ORDER_EMAIL_VALID (от ValidationService - при успешной валидации email)
		- AppEvents.ORDER_EMAIL_VALIDATION_ERROR (от ValidationService - при ошибке валидации email)
		- AppEvents.ORDER_PHONE_VALID (от ValidationService - при успешной валидации телефона)
        - AppEvents.ORDER_PHONE_VALIDATION_ERROR (от ValidationService - при ошибке валидации телефона)
	- Публикует события:
		- AppEvents.UI_ORDER_INPUT_MAIL_CHANGED (при изменении поля email)
		- AppEvents.UI_ORDER_INPUT_PHONE_CHANGED (при изменении поля телефона)
		- AppEvents.MODAL_OPENED с типом 'success' (при успешном подтверждении формы)
		- AppEvents.ORDER_SUBMITTED (при отправке формы контактов - только после успешной валидации)

7. **Модальное окно подтверждения заказа (SuccessModal)**
	- Слушает события:
		- AppEvents.MODAL_OPENED (от ModalService) - с типом 'success' для активации
	- Публикует события:
		- AppEvents.MODAL_CLOSED (при закрытии окна - при клике на кнопку "За новыми покупками!", клике на крестик или клике вне окна)

## Модели данных

### Интерфейсы:

```typescript
/**
 * Тип, представляющий доступные способы оплаты
 * @typedef {'online' | 'cash'} PaymentMethod
 */
export type PaymentMethod = 'online' | 'cash';

/**
 * Интерфейс товара, получаемого с сервера
 * @interface IProduct
 * @property {string} id - Уникальный идентификатор товара
 * @property {string} title - Название товара
 * @property {number|null} price - Цена товара (может быть null)
 * @property {string} description - Описание товара
 * @property {string} category - Категория товара
 * @property {string} image - URL изображения товара
 */
export interface IProduct {
	id: string;
	title: string;
	price: number | null;
	description: string;
	category: string;
	image: string;
}

/**
 * Интерфейс данных для отправки заказа на сервер
 * @interface IOrderRequest
 * @property {PaymentMethod} payment - Выбранный способ оплаты
 * @property {string} email - Email покупателя
 * @property {string} phone - Телефон покупателя
 * @property {string} address - Адрес доставки
 * @property {number} total - Общая сумма заказа
 * @property {string[]} items - Массив идентификаторов товаров в заказе
 */
export interface IOrderRequest {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

/**
 * Интерфейс ответа сервера на оформление заказа
 * @interface IOrderResponse
 * @property {string} id - Идентификатор созданного заказа
 * @property {number} total - Общая сумма заказа
 */
export interface IOrderResponse {
	id: string;
	total: number;
}

/**
 * Тип данных формы заказа (исключает поля total и items из IOrderRequest)
 * @typedef {Omit<IOrderRequest, 'total' | 'items'>} OrderFormData
 */
export type OrderFormData = Omit<IOrderRequest, 'total' | 'items'>;

/**
 * Интерфейс ошибки валидации формы
 * @interface IValidationError
 * @property {'address' | 'email' | 'phone' | 'payment'} field - Поле, в котором обнаружена ошибка
 * @property {string} message - Сообщение об ошибке
 */
export interface IValidationError {
	field: 'address' | 'email' | 'phone' | 'payment';
	message: string;
}

/**
 * Интерфейс состояния API-запросов
 * @interface IApiState
 * @property {boolean} isLoading - Флаг выполнения запроса
 * @property {number|null} lastUpdated - Время последнего обновления данных (timestamp)
 */
export interface IApiState {
	isLoading: boolean;
	lastUpdated: number | null;
}

/**
 * Интерфейс состояния модальных окон
 * @interface IModalState
 * @property {boolean} isOpened - Флаг открытия модального окна
 * @property {'product' | 'cart' | 'order' | 'contacts' | 'success' | null} type - Тип открытого модального окна
 * @property {string|null} productId - Идентификатор товара (для модального окна товара)
 */
export interface IModalState {
	isOpened: boolean;
	type: 'product' | 'cart' | 'order' | 'contacts' | 'success' | null;
	productId: string | null;
}

/**
 * Интерфейс состояния формы заказа
 * @interface IOrderFormState
 * @property {PaymentMethod|null} payment - Выбранный способ оплаты
 * @property {string} address - Введенный адрес доставки
 * @property {string} email - Введенный email
 * @property {string} phone - Введенный телефон
 * @property {boolean} isValid - Флаг валидности всей формы
 * @property {IValidationError[]} errors - Массив ошибок валидации
 */
export interface IOrderFormState {
	payment: PaymentMethod | null;
	address: string;
	email: string;
	phone: string;
	isValid: boolean;
	errors: IValidationError[];
}

/**
 * Интерфейс общего состояния приложения
 * @interface IAppState
 * @property {IProduct[]} catalog - Список товаров в каталоге
 * @property {string[]} basket - Идентификаторы товаров в корзине
 * @property {IOrderFormState} order - Состояние формы заказа
 * @property {string|null} preview - Идентификатор товара для предпросмотра
 */
export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	basketTotal: number;
	order: IOrderFormState;
	preview: string | null;
}

/**
 * Интерфейс сервиса корзины для SuccessModal
 * @interface ICartServiceForSuccess
 * @property {() => number} getTotalPrice - Получить сумму корзины
 * @property {() => void} clearCart - Очистить корзину
 */
export interface ICartServiceForSuccess {
	getTotalPrice(): number;
	clearCart(): void;
}
```

## Архитектурный подход

Проект использует событийно-ориентированную архитектуру с четким разделением ответственностей между компонентами. Основные принципы:
1. Событийная модель:
   - Центральный EventEmitter для управления всеми событиями приложения 
   - Все взаимодействия между компонентами происходят через события 
   - Четкая типизация событий в types/events.ts
2. Слоистая структура:
   - Базовый слой (EventEmitter, Api) - фундаментальные классы
   - Сервисы (ApiService, CartService и др.) - бизнес-логика
   - UI компоненты (Page, модальные окна) - представление
   - Состояние (AppState) - централизованное управление данными
3. Ключевые особенности:
   - Одностраничное приложение (SPA) с динамическим рендерингом 
   - Строгая типизация на TypeScript 
   - Разделение данных (AppState) и представления (компоненты)
   - Валидация данных через специализированный сервис 
4. Потоки данных:
   - Пользовательские действия → События → Сервисы → Обновление состояния → Рендеринг 
   - API взаимодействия инкапсулированы в ApiService 
   - Состояние корзины и заказов управляется через AppState
5. Принципы проектирования:
   - Единая точка истины (AppState для данных)
   - Инверсия зависимостей (DI через конструкторы)
   - Открытость/закрытость (расширяемость через события)
   - Разделение интерфейсов (ICartServiceForSuccess и др.)
6. Технологический стек:
   - TypeScript для строгой типизации 
   - SCSS для стилей 
   - Webpack для сборки 
   - Fetch API для работы с сервером

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
Главная страница (Page)
├── Каталог товаров (рендерится внутри Page)
│   └── Карточка товара (кнопка)
├── Кнопка корзины (в хедере)
│   └── Счётчик товаров
└── Модальные окна (через ModalService)
    ├── Модальное окно карточки товара (ProductModal)
    │    └── Кнопка "Добавить в корзину"
    ├── Модальное окно корзины (CartModal)
    │    ├── Список товаров
    │    ├── Кнопка удаления товара
    │    └── Кнопка "Оформить заказ"
    ├── Модальное окно оформления заказа (OrderModal)
    │    ├── Форма заполнения адреса
    │    ├── Выбор способа оплаты
    │    └── Кнопка "Далее"
    ├── Модальное окно контактных данных (ContactsModal)
    │    ├── Форма заполнения email
    │    ├── Форма заполнения телефона
    │    └── Кнопка "Оплатить"
    └── Модальное окно подтверждения заказа (SuccessModal)
        └── Кнопка "За новыми покупками!"               
```

## Граф событий

1. **Инициализация приложения**:
	- AppEvents.PAGE_MAIN_LOADED → ApiService.loadProducts() → сохраняет в AppState → StateEvents.CATALOG_UPDATED → Page (отрисовка каталога)
   
2. **Просмотр товара**:
	- Клик на товар → AppEvents.PRODUCT_DETAILS_REQUESTED → ApiService.loadProductDetails() → AppEvents.PRODUCT_DETAILS_LOADED → ProductModal (отображение)

3. **Работа с корзиной**:
   - AppEvents.MODAL_PRODUCT_CART_ITEM_ADDED → CartService.addToCart() → [AppEvents.CART_ITEM_ADDED, AppEvents.CART_UPDATED] → [CartModal, Page]    - modal:cart:item_removed → Cart Service.removeFromCart() → [cart:item_removed, cart:updated] → [Список товаров корзины, Счётчик]
   - AppEvents.MODAL_CART_ITEM_REMOVED → CartService.removeFromCart() → [AppEvents.CART_ITEM_REMOVED, AppEvents.CART_UPDATED] → [CartModal, Page]
   - AppEvents.UI_BUTTON_CART_CLICKED → ModalService.openCartModal() → AppEvents.MODAL_OPENED → CartModal (открытие)
4. **Оформление заказа**:
   - AppEvents.UI_ORDER_BUTTON_START_CLICKED → OrderService.initOrder() → AppEvents.ORDER_INITIATED → OrderModal (открытие)
   
   **Шаги оформления**:
   a) Ввод адреса и оплаты:
      - AppEvents.UI_ORDER_INPUT_DELIVERY_CHANGED → ValidationService.validateDelivery()
      - AppEvents.UI_ORDER_SELECT_PAYMENT_CHANGED → ValidationService.validatePayment()
      - Успешная валидация → AppEvents.ORDER_DELIVERY_VALID/AppEvents.ORDER_PAYMENT_VALID → OrderModal (разблокировка кнопки)
   b) Переход к контактам:
      - AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED → ModalService.openContactsModal() → ContactsModal (открытие)
   c) Ввод контактов:
      - AppEvents.UI_ORDER_INPUT_MAIL_CHANGED → ValidationService.validateEmail()
      - AppEvents.UI_ORDER_INPUT_PHONE_CHANGED → ValidationService.validatePhone()
      - Успешная валидация → AppEvents.ORDER_EMAIL_VALID/AppEvents.ORDER_PHONE_VALID → ContactsModal (разблокировка кнопки)

   d) Отправка заказа:
   - Submit формы → AppEvents.ORDER_SUBMITTED → ApiService.submitOrder() →
     - AppEvents.ORDER_SENT (начало отправки)
     - При успехе: AppEvents.ORDER_SUBMITTED с данными заказа → ModalService.openSuccessModal() → SuccessModal (открытие)
     - CartService.clearCart() → AppEvents.CART_CLEAR

5. **Закрытие модальных окон**:
   - Любое закрытие → ModalService.closeModal() → AppEvents.MODAL_CLOSED → обновление UI

## Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами