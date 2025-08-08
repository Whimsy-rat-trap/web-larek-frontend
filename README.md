# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

## Описание проекта

Проект представляет собой интернет-магазин (веб-ларек) с возможностью:
- Просмотра каталога товаров
- Просмотра детальной информации о товаре
- Добавления товаров в корзину
- Оформление заказа в два этапа:
  - Выбор способа оплаты и адреса доставки 
  - Ввод контактных данных (email и телефон)
- Выбора способа оплаты
- Валидация всех полей формы
- Отправка заказа на сервер
- Отображение подтверждения заказа

## Структура проекта
```
src/
├── components/
│   ├── base/				# Базовые классы
│   │   ├── api.ts			# Класс для работы с API
│   │   └── events.ts		# EventEmitter для управления событиями
│   ├── services/			# Сервисы приложения
│   │   ├── ApiService.ts	# Работа с API магазина
│   │   ├── AppStateModal.ts			# Централизованное состояние приложения
│   │   ├── CartService.ts 		# Управление корзиной
│   │   ├── ModalService.ts		# Управление модальными окнами
│   │   ├── OrderService.ts		# Оформление заказов
│   │   └── ValidationService.ts	# Валидация данных
│   ├── CartModal.ts		# Модальное окно корзины
│   ├── ContactsModal.ts	# Модальное окно контактов
│   ├── Modal.ts			# Базовое модальное окно
│   ├── OrderModal.ts		# Модальное окно оформления заказа
│   ├── Page.ts				# Главная страница
│   ├── ProductModal.ts		# Модальное окно товара
│   └── SuccessModal.ts		# Модальное окно успешного заказа
├── pages/
│   └── index.html			# HTML страница
├── types/
│   ├── events.ts			# Типы событий приложения
│   └── index.ts			# Основные типы данных
├── utils/
│   ├── constants.ts		# Константы приложения
│   └── utils.ts			# Вспомогательные утилиты
├── index.ts				# Точка входа приложения
└── scss/					# Стили проекта
```

## API и компоненты

### Ключевые API endpoints:
- `GET Product List` - получение списка товаров
- `GET Product Item` - получение информации о конкретном товаре
- `POST Order` - оформление заказа

### Основные сервисы:

1. **API Service**:
	- Работает с API магазина
	- Интегрирован с AppStateModal для хранения данных
	- Слушает события:
		- AppEvents.PAGE_MAIN_LOADED - загрузка главной страницы
		- AppEvents.PRODUCT_DETAILS_REQUESTED - запрос деталей товара
		- AppEvents.ORDER_READY - готовность заказа к отправке
	- **Команды**:
		- loadProducts()
			- Загружает список товаров через API
			- Сохраняет в AppStateModal.catalog
			- Публикует: StateEvents.CATALOG_UPDATED
		- loadProductDetails(productId)
			- Загружает детали товара по ID (сначала проверяет кэш в AppStateModal)
            - При отсутствии - запрашивает с сервера
			- Публикует: AppEvents.PRODUCT_DETAILS_LOADED
		- submitOrder(orderData)
			- Формирует и отправляет заказ на сервер
            - Использует данные из AppStateModal (корзина и форма заказа)
			- Публикует:
				- AppEvents.ORDER_SENT (при отправке)
				- AppEvents.ORDER_SUBMITTED (при успехе)
                - AppEvents.ORDER_SUBMIT_ERROR (при ошибке)

2. **Cart Service**:
    - Управляет состоянием корзины через AppStateModal
    - Слушает события:
		- AppEvents.MODAL_PRODUCT_BASKET_ITEM_ADDED - добавление товара в корзину
		- AppEvents.MODAL_PRODUCT_BASKET_ITEM_REMOVED - удаление товара из корзины
        - AppEvents.UI_MODAL_PRODUCT_BUTTON_STATE_CHANGED - запрос состояния товара в корзине (для обновления кнопки в модальном окне товара)
	- **Команды**:
		- addToCart(productId)
			- Добавляет товар в корзину через AppStateModal
            - Вызывается по событию: AppEvents.MODAL_PRODUCT_BASKET_ITEM_ADDED
			- Публикует:
				- AppEvents.BASKET_ITEM_ADDED (при успехе)
				- AppEvents.BASKET_ITEM_ADD_ERROR (при ошибке)
				- AppEvents.BASKET_CONTENT_CHANGED
		- removeFromCart(productId)
			- Удаляет товар из корзины
            - Вызывается по событию: AppEvents.MODAL_PRODUCT_BASKET_ITEM_REMOVED
			- Публикует:
				- AppEvents.BASKET_ITEM_REMOVED
				- AppEvents.BASKET_CONTENT_CHANGED
		- clearCart()
			- Вызывается по событию: AppEvents.ORDER_SUBMITTED
			- Публикует: 
              - AppEvents.BASKET_CLEAR (после успешного оформления заказа)
              - BASKET_CONTENT_CHANGED
        - getCartItems()
          - Возвращает текущие товары в корзине
          - Используется CartModal для отображения содержимого корзины
        - getTotalPrice()
          - Возвращает сумму корзины
          - Используется CartModal и SuccessModal для отображения общей стоимости

3. **Modal Service**:
	- Управляет открытием / закрытием модальных окон
	- Слушает события:
		- AppEvents.UI_BUTTON_CART_CLICKED (от Кнопки "Корзина")
        - AppEvents.UI_PRODUCT_CLICKED (клик по карточке товара внутри каталога)
		- AppEvents.UI_ORDER_BUTTON_START_CLICKED (от Модального окна корзины)
		- AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED (от Модального окна оформления заказа)
		- AppEvents.ORDER_SUBMITTED (от ApiService при успешной отправке заказа)
	- **Команды**:
		- openCartModal()
			- Открывает модальное окно корзины
            - Вызывается по событию: AppEvents.UI_BUTTON_CART_CLICKED
			- Публикует: AppEvents.MODAL_OPENED (тип: 'cart')
		- openProductModal(productId)
			- Открывает модальное окно товара
            - Вызывается по: AppEvents.PRODUCT_DETAILS_REQUESTED
			- Публикует: AppEvents.MODAL_OPENED (тип: 'product')
		- openOrderModal()
			- Открывает модальное окно оформления заказа
            - Вызывается по: AppEvents.UI_ORDER_BUTTON_START_CLICKED
			- Публикует: AppEvents.MODAL_OPENED (тип: 'order')
		- openContactsModal()
			- Открывает модальное окно контактов
            - Вызывается по: AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED
			- Публикует: AppEvents.MODAL_OPENED (тип: 'contacts')
		- openSuccessModal()
			- Открывает модальное окно успешного оформления
            - Вызывается по событию: AppEvents.ORDER_SUBMITTED
			- Публикует: AppEvents.MODAL_OPENED (с типом 'success')
		- closeModal()
			- Закрывает текущее модальное окно / Сбрасывает состояние модального окна
            - Публикует: MODAL_CLOSED
			- Вызывается при ручном закрытии модального окна пользователем

4. **Order Service**:
	- Управляет процессом оформления заказа
    - Интегрирован с AppStateModal для хранения данных заказа
	- Слушает события:
		- AppEvents.UI_ORDER_BUTTON_START_CLICKED - начало оформления
		- AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED - переход к контактам
		- AppEvents.UI_ORDER_BUTTON_PAYMENT_SET - выбор оплаты
        - AppEvents.UI_ORDER_BUTTON_PAY_CLICKED - подтверждение оплаты
	- **Команды**:
		- initOrder()
			- Инициализирует процесс оформления заказа
            - Вызывается по событию: AppEvents.UI_ORDER_BUTTON_START_CLICKED
			- Публикует событие: AppEvents.ORDER_INITIATED (для инициализации процесса заказа)
		- prepareOrder(step: 'delivery' | 'payment')
			- Подготавливает заказ к отправке в зависимости от шага 
            - Для шага 'delivery':
              - Публикует: AppEvents.ORDER_DELIVERY_COMPLETED (переход к контактам)
            - Для шага 'payment':
              - Проверяет валидность данных через AppStateModal
              - Публикует: AppEvents.ORDER_READY (если данные валидны)
              - Не публикует событий при невалидных данных
		- validate()
          - Проверяет валидность всех полей формы:
            - Адрес доставки 
            - Способ оплаты 
            - Email 
            - Телефон
          - Формирует массив ошибок
          - Публикует: 
            - AppEvents.ORDER_VALIDATION_ERROR для каждой ошибки
          - Обновляет флаг isValid в состоянии
        - updateDelivery(address):
          - Обновляет адрес доставки 
          - Публикует: AppEvents.ORDER_DELIVERY_SET 
      - updatePayment(method):
        - Обновляет способ оплаты 
        - Публикует: AppEvents.ORDER_PAYMENT_SET 
      - updateEmail(email):
        - Обновляет email 
        - Публикует: AppEvents.ORDER_EMAIL_SET
      - updatePhone(phone):
        - Обновляет телефон 
        - Публикует: AppEvents.ORDER_PHONE_SET 
      - getState():
        - Возвращает текущее состояние формы заказа 
        - Используется для проверки валидности данных 
    
    - **Взаимодействие с ValidationService**:
      - Получает события успешной/неуспешной валидации полей 
      - Агрегирует результаты валидации отдельных полей 
      - Принимает окончательное решение о готовности заказа 
      - Пример цепочки: 
        - ValidationService проверяет формат email → AppEvents.ORDER_EMAIL_VALID 
        - OrderService получает это событие и обновляет состояние 
        - При попытке отправки OrderService проверяет все подобные флаги

5. **Validation Service**:
	- Проверяет корректность введенных данных в формах заказа
	- Слушает события:
		- AppEvents.UI_ORDER_INPUT_DELIVERY_CHANGED (из OrderModal - при изменении поля адреса)
		- AppEvents.UI_ORDER_SELECT_PAYMENT_CHANGED (из OrderModal - при изменении способа оплаты)
		- ppEvents.UI_ORDER_INPUT_MAIL_CHANGED (из ContactsModal - при изменении email)
		- AppEvents.UI_ORDER_INPUT_PHONE_CHANGED (из ContactsModal - при изменении телефона)
	- **Команды**:
		- validateDelivery(address: string)
          - Проверяет минимальную длину адреса (5 символов)
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

6. **AppStateModal (Service)**:
	- Централизованное хранилище состояния приложения
    - Слушает события:
      - AppEvents.ORDER_PAYMENT_SET - обновление способа оплаты 
      - AppEvents.ORDER_EMAIL_SET - обновление email 
      - AppEvents.ORDER_PHONE_SET - обновление телефона 
      - AppEvents.ORDER_DELIVERY_SET - обновление адреса доставки
	- **Свойства**:
		- catalog: IProduct[] - список товаров
		- basket: string[] - ID товаров в корзине
        - basketTotal: number - общая сумма корзины
		- order: IOrderFormState - данные заказа
		- preview: string | null - ID просматриваемого товара
	- **Команды**:
      - Сеттеры:
        - set catalog(items: IProduct[]):
          - Обновляет каталог товаров
          - Публикует: StateEvents.CATALOG_STATE_UPDATED - при обновлении каталога товаров
        - set basket(items: IProduct[]):
          - Обновляет корзину
          - Автоматически пересчитывает сумму (basketTotal)
          - Публикует:
            - StateEvents.BASKET_STATE_CHANGED - при изменении корзины (включая обновление суммы)
            - AppEvents.BASKET_CONTENT_CHANGED - дополнительное событие при обновлении корзины
        - set order(form: Partial<IOrderFormState>):
          - Обновляет данные заказа
          - Выполняет валидацию заказа (проверяет заполнение обязательных полей)
          - Публикует: StateEvents.ORDER_STATE_FORM_UPDATED - при изменении данных заказа
        - set preview(id: string | null):
          - Устанавливает ID просматриваемого товара
          - Публикует: StateEvents.PREVIEW_STATE_UPDATED - при изменении просматриваемого товара
      - Геттеры:
        - state: IAppState - возвращает текущее состояние 
        - basketTotal: number - возвращает сумму корзины
      - Приватные методы:
        - updateBasketTotal():
          - Пересчитывает сумму корзины
        - validateOrder():
          - Проверяет валидность данных заказа
        - validateOrderFields() 
          - Возвращает массив ошибок валидации 

### Основные компоненты и их события:

1. **Главная страница(Page)**
	- Рендерит главную страницу приложения, включая каталог товаров и кнопку корзины
    - Слушает события:
		- StateEvents.CATALOG_STATE_UPDATED (от AppStateModal) - для отрисовки каталога
		- StateEvents.BASKET_STATE_CHANGED (от AppStateModal) - при изменении состояния корзины
	- Публикует события:
		- AppEvents.PAGE_MAIN_LOADED - при инициализации страницы (один раз при загрузке)
		- AppEvents.UI_BUTTON_BASKET_CLICKED - при клике на кнопку корзины в хедере
		- AppEvents.PRODUCT_DETAILS_REQUESTED - при клике на карточку товара в каталоге (с передачей id товара)
	
2. **Карточка товара (в каталоге)**
   - Отображает краткую информацию о товаре в каталоге (изображение, название, категорию, цену)
   - Рендерится внутри Page 
   - Не является отдельным классом-компонентом, реализована как часть главной страницы (Page)
   - Создается динамически в методе createProductElement() класса Page
   - Публикует события:
     - AppEvents.UI_PRODUCT_CLICKED (при клике на карточку товара, передает объект с id товара: { id: productId })
		
3. **Модальное окно карточки товара (ProductModal)**
	- Отображает детальную информацию о товаре 
    - Предоставляет кнопку добавления/удаления из корзины 
    - Обновляет состояние кнопки при изменении корзины
    - Слушает события:
		- AppEvents.MODAL_OPENED (от ModalService) - при открытии модального окна с типом 'product'
        - AppEvents.PRODUCT_DETAILS_LOADED  - загрузка данных товара (от ApiService)
        - AppEvents.BASKET_CONTENT_CHANGED - изменение содержимого корзины (от CartService)
	- Публикует события:
		- AppEvents.MODAL_PRODUCT_BASKET_ITEM_ADDED - при добавлении товара в корзину
        - AppEvents.MODAL_PRODUCT_BASKET_ITEM_REMOVED - при удалении товара из корзины
        - AppEvents.UI_MODAL_PRODUCT_BUTTON_STATE_CHANGED - запрос состояния товара в корзине (для обновления кнопки)
		- AppEvents.MODAL_CLOSED - при закрытии окна

4. **Модальное окно корзины (CartModal)**
	- Отображает список товаров в корзине
    - Слушает события:
   		- AppEvents.MODAL_OPENED (от ModalService) - при открытии модального окна с типом 'cart'
		- AppEvents.BASKET_CONTENT_CHANGED (от CartService) - при любом изменении состояния корзины
		- AppEvents.BASKET_ITEM_ADDED (от CartService) - при успешном добавлении товара в корзину
        - AppEvents.BASKET_ITEM_REMOVED (от CartService) - при удалении товара из корзины
		- AppEvents.BASKET_CLEAR (от CartService) - при полной очистке корзины
	- Публикует события:
		- AppEvents.MODAL_PRODUCT_BASKET_ITEM_REMOVED (при клике на кнопку удаления товара, передает { id: productId }) → CartService удаляет товар
		- AppEvents.UI_ORDER_BUTTON_START_CLICKED (при клике на кнопку "Оформить заказ")
        - AppEvents.MODAL_CLOSED - при закрытии окна

5. **Модальное окно оформления заказа (OrderModal)**
	- Отображает форму ввода адреса доставки 
    - Предоставляет выбор способа оплаты
    - Слушает события:
		- AppEvents.ORDER_INITIATED (от OrderService) - инициализация формы заказа
		- AppEvents.ORDER_DELIVERY_VALID (от ValidationService) - успешная валидация адреса
		- AppEvents.ORDER_VALIDATION_ERROR (от ValidationService/OrderService) - ошибки валидации
        - AppEvents.ORDER_PAYMENT_VALID (от ValidationService) - успешная валидация способа оплаты
        - AppEvents.ORDER_PAYMENT_VALIDATION_ERROR (от ValidationService) - ошибки валидации способа оплаты
	- Публикует события:
		- AppEvents.UI_ORDER_INPUT_DELIVERY_CHANGED - при изменении поля адреса
		- AppEvents.UI_ORDER_SELECT_PAYMENT_CHANGED - при изменении способа оплаты
        - AppEvents.ORDER_DELIVERY_SET - при успешном вводе адреса
		- AppEvents.ORDER_PAYMENT_SET - при выборе способа оплаты
        - AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED (при клике "Далее") - при клике на кнопку "Далее"
		- AppEvents.MODAL_CLOSED - при закрытии окна

6. **Модальное окно контактных данных (ContactsModal)**
	- Отображает форму ввода контактных данных (email и телефон)
    - Управляет завершением оформления заказа
    - Слушает события:
		- AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED - переход к шагу контактов (от OrderModal)
        - AppEvents.ORDER_EMAIL_VALID - успешная валидация email (от ValidationService)
		- AppEvents.ORDER_EMAIL_VALIDATION_ERROR - ошибка валидации email (от ValidationService)
		- AppEvents.ORDER_PHONE_VALID - успешная валидация телефона (от ValidationService)
        - AppEvents.ORDER_PHONE_VALIDATION_ERROR - ошибка валидации телефона (от ValidationService)
	- Публикует события:
		- AppEvents.UI_ORDER_INPUT_MAIL_CHANGED - при изменении поля email передает введенное значение
		- AppEvents.UI_ORDER_INPUT_PHONE_CHANGED - при изменении поля телефона передает введенное значение
		- AppEvents.ORDER_EMAIL_SET - при успешном вводе email передает валидный email
        - AppEvents.ORDER_PHONE_SET - при успешном вводе телефона передает валидный телефон
        - AppEvents.UI_ORDER_BUTTON_PAY_CLICKED - при клике на кнопку "Оплатить"
		- AppEvents.ORDER_READY - при готовности заказа к отправке

7. **Модальное окно подтверждения заказа (SuccessModal)**
	- Отображает сообщение об успешном оформлении заказа 
    - Показывает итоговую сумму заказа
    - Слушает события:
		- AppEvents.MODAL_OPENED - открытие модального окна с типом 'success'
	- Публикует события:
		- AppEvents.BASKET_CLEAR - при очистке корзины (через CartService)
        - AppEvents.MODAL_CLOSED - при закрытии окна

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
   - Состояние (AppStateModal) - централизованное управление данными
3. Ключевые особенности:
   - Одностраничное приложение (SPA) с динамическим рендерингом 
   - Строгая типизация на TypeScript 
   - Разделение данных (AppStateModal) и представления (компоненты)
   - Валидация данных через специализированный сервис 
4. Потоки данных:
   - Пользовательские действия → События → Сервисы → Обновление состояния → Рендеринг 
   - API взаимодействия инкапсулированы в ApiService 
   - Состояние корзины и заказов управляется через AppStateModal
5. Принципы проектирования:
   - Единая точка истины (AppStateModal для данных)
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
	- DOMContentLoaded → index.ts инициализация
	- AppEvents.PAGE_MAIN_LOADED → ApiService.loadProducts()
      - Успех: сохраняет в AppStateModal.catalog → StateEvents.CATALOG_UPDATED → Page.renderProducts() 
      - Ошибка: очищает каталог (AppStateModal.catalog = [])
   
2. **Просмотр товара**:
   - Клик на товар → AppEvents.UI_PRODUCT_CLICKED → ModalService.openProductModal()
     - AppEvents.MODAL_OPENED (type: 'product') + AppEvents.PRODUCT_DETAILS_REQUESTED
     - ApiService.loadProductDetails():
       - Найден в кэше (AppStateModal.state.catalog): AppEvents.PRODUCT_DETAILS_LOADED → ProductModal.renderProduct()
       - Не найден: запрос на сервер → AppEvents.PRODUCT_DETAILS_LOADED → ProductModal.renderProduct()

3. **Работа с корзиной**:
	- Добавление товара:
	  - AppEvents.MODAL_PRODUCT_BASKET_ITEM_ADDED → CartService.addToCart()
        - Проверка наличия → Обновление AppStateModal.basket 
          - StateEvents.BASKET_STATE_CHANGED → Page.updateBasketCounter()
            - AppEvents.BASKET_ITEM_ADDED (успех)
            - AppEvents.BASKET_ITEM_ADD_ERROR (ошибка)
          - AppEvents.BASKET_CONTENT_CHANGED  → CartModal.renderCart()

   - Удаление товара:
     - AppEvents.MODAL_PRODUCT_BASKET_ITEM_REMOVED → CartService.removeFromCart()
     - Обновление AppStateModal.basket 
     - StateEvents.BASKET_STATE_CHANGED → Page.updateBasketCounter()
     - AppEvents.BASKET_ITEM_REMOVED
     - AppEvents.BASKET_UPDATED → CartModal.renderCart()
   
   - Открытие корзины:
     - AppEvents.UI_BUTTON_BASKET_CLICKED → ModalService.openCartModal()
     - AppEvents.MODAL_OPENED (type: 'cart') → CartModal.renderCart()

4. **Оформление заказа**:
   - Инициализация:
     - AppEvents.UI_ORDER_BUTTON_START_CLICKED → OrderService.initOrder()
       - AppEvents.ORDER_INITIATED → OrderModal.renderOrderForm()
     
   - Шаг 1 (адрес и оплата):
     - Изменение адреса:
       - AppEvents.UI_ORDER_INPUT_DELIVERY_CHANGED → ValidationService.validateDelivery()
         - Успех: AppEvents.ORDER_DELIVERY_VALID → OrderService.updateDelivery()
           - AppEvents.ORDER_DELIVERY_SET → Обновление AppStateModal.order  
         - Ошибка: AppEvents.ORDER_VALIDATION_ERROR → OrderModal.showError()
   
     - Выбор оплаты:
       - AppEvents.UI_ORDER_SELECT_PAYMENT_CHANGED → ValidationService.validatePayment()
         - Успех: AppEvents.ORDER_PAYMENT_VALID → OrderService.updatePayment()
           - AppEvents.ORDER_PAYMENT_SET → Обновление AppStateModal.order
         - Ошибка: AppEvents.ORDER_PAYMENT_VALIDATION_ERROR → OrderModal.showError()
     
     - Кнопка "Далее":
     - AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED → OrderService.prepareOrder('delivery')
       - Валидация → AppEvents.ORDER_DELIVERY_COMPLETED → ModalService.openContactsModal()
         - AppEvents.MODAL_OPENED (type: 'contacts') → ContactsModal.renderContactsForm()
   
     - Шаг 2 (контакты):
     - Изменение email:
       - AppEvents.UI_ORDER_INPUT_MAIL_CHANGED → ValidationService.validateEmail()
         - Успех: 
           - AppEvents.ORDER_EMAIL_VALID → OrderService.updateEmail()
           - AppEvents.ORDER_EMAIL_SET → Обновление AppStateModal.order  
           - StateEvents.ORDER_STATE_FORM_UPDATED 
         - Ошибка: AppEvents.ORDER_EMAIL_VALIDATION_ERROR → ContactsModal.showError()
     
     - Изменение телефона:
       - AppEvents.UI_ORDER_INPUT_PHONE_CHANGED → ValidationService.validatePhone()
         - Успех: 
           - AppEvents.ORDER_PHONE_VALID → OrderService.updatePhone()
           - AppEvents.ORDER_PHONE_SET → Обновление AppStateModal.order
           - StateEvents.ORDER_STATE_FORM_UPDATED
         - Ошибка: AppEvents.ORDER_PHONE_VALIDATION_ERROR → ContactsModal.showError()
     
     - Кнопка "Оплатить":
       - AppEvents.UI_ORDER_BUTTON_PAY_CLICKED → OrderService.prepareOrder('payment')
         - Валидация → AppEvents.ORDER_READY → ApiService.submitOrder()
           - AppEvents.ORDER_SENT 
           - Успех: 
             - AppEvents.ORDER_SUBMITTED → ModalService.openSuccessModal()
               - AppEvents.MODAL_OPENED (type: 'success') → SuccessModal.renderSuccess()
                 - CartService.clearCart() → AppEvents.BASKET_CLEAR 
                   - StateEvents.BASKET_STATE_CHANGED
                   - BASKET_CONTENT_CHANGED
           - Ошибка: AppEvents.ORDER_SUBMIT_ERROR

5. **Успешное оформление**:
	- SuccessModal:
      - Отображает сумму заказа через CartService.getTotalPrice()
      - Кнопка закрытия → ModalService.closeModal() → AppEvents.MODAL_CLOSED

6. **Закрытие модальных окон**:
	- Любое закрытие → ModalService.closeModal() → AppEvents.MODAL_CLOSED
	  → Сброс состояния модального окна

## Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами