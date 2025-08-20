# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

## Описание проекта

Проект представляет собой интернет-магазин (веб-ларек) с архитектурой Model-View-Presenter (MVP), реализующий следующие возможности:
- Просмотра каталога товаров с динамической загрузкой данных
- Детальный просмотр товаров в модальных окнах
- Управление корзиной с добавлением/удалением товаров
- Оформление заказа в два этапа:
  - Выбор способа оплаты и адреса доставки 
  - Ввод контактных данных (email и телефон)
- Валидация всех полей формы в реальном времени
- Отправка заказа на сервер с обработкой ответа
- Отображение подтверждения заказа с итоговой суммой

## Структура проекта
```
src/
├── components/
│   ├── base/				    # Базовые классы
│   │   ├── api.ts			        # Класс для работы с API
│   │   └── events.ts		        # EventEmitter для управления событиями
│   ├── models/                # Модели данных
│   │   └── AppStateModel.ts        # Централизованное состояние приложения
│   ├── presenters/             # Presenters для связи View и Model
│   │   ├── BasketPresenter.ts      # Управление логикой корзины
│   │   ├── ContactPresenter.ts     # Управление логикой контактов
│   │   ├── ModalPresenter.ts       # Управление модальными окнами
│   │   ├── OrderPresenter.ts       # Управление логикой заказа
│   │   ├── PagePresenter.ts        # Управление главной страницей
│   │   ├── ProductPresenter.ts     # Управление логикой товара
│   │   └── SuccessPresenter.ts     # Управление логикой успешного заказа
│   ├── services/		        # Сервисы приложения
│   │   ├── ApiService.ts	        # Работа с API магазина
│   │   ├── AppStateModal.ts	    # Централизованное состояние приложения
│   │   ├── BasketService.ts 		# Управление корзиной
│   │   ├── ModalService.ts		    # Управление модальными окнами
│   │   ├── OrderService.ts		    # Оформление заказов
│   │   └── ValidationService.ts	# Валидация данных
│   └── views/                  # View компоненты
│       ├── BasketItemView.ts       # Представление элемента в корзине
│       ├── BasketView.ts		    # Модальное окно корзины
│       ├── ContactsView.ts	        # Модальное окно контактов
│       ├── ModalView.ts			# Базовое модальное окно
│       ├── OrderView.ts		    # Модальное окно оформления заказа
│       ├── PageView.ts				# Главная страница
│       ├── ProductItemView.ts      # Представление товара в каталоге 
│       ├── ProductView.ts		    # Модальное окно товара
│       └── SuccessView.ts		    # Модальное окно успешного заказа
├── pages/
│   └── index.html			        # HTML страница
├── types/
│   ├── events.ts			        # Типы событий приложения
│   └── index.ts			        # Основные типы данных
├── utils/
│   ├── constants.ts		        # Константы приложения
│   └── utils.ts			        # Вспомогательные утилиты
├── index.ts				        # Точка входа приложения
└── scss/					    # Стили проекта
```

## API и компоненты

### Ключевые API endpoints:
- `GET Product List` - получение списка товаров
- `GET Product Item` - получение информации о конкретном товаре
- `POST Order` - оформление заказа

### Основные сервисы и модели:

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
          - Не публикует событий (рендеринг через StateEvents.CATALOG_STATE_UPDATED от AppStateModel)
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

2. **Basket Service**:
    - Управляет состоянием корзины через AppStateModal
    - Не слушает события напрямую (взаимодействие через презентеры и обработчики)
	- **Команды**:
		- addToCart(productId)
			- Добавляет товар в корзину через AppStateModel.basket
            - Вызывается через обработчики в index.ts
			- Публикует:
              - AppEvents.BASKET_ITEM_ADDED (при успехе)
              - AppEvents.BASKET_ITEM_ADD_ERROR (при ошибке)
              - AppEvents.BASKET_CONTENT_CHANGED
		- removeFromCart(productId)
			- Удаляет товар из корзины
            - Вызывается через обработчики в index.ts
			- Публикует:
              - AppEvents.BASKET_ITEM_REMOVED
              - AppEvents.BASKET_CONTENT_CHANGED
		- clearCart()
			- Очищает корзину полностью
			- Публикует: 
              - AppEvents.BASKET_CONTENT_CHANGED

3. **Modal Service**:
	- Управляет открытием / закрытием модальных окон
	- Слушает события:
      - AppEvents.UI_BUTTON_BASKET_CLICKED (от Кнопки "Корзина")
      - AppEvents.UI_PRODUCT_CLICKED (клик по карточке товара)
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
      - AppEvents.UI_ORDER_BUTTON_PAY_CLICKED - подтверждение оплаты
	- **Команды**:
      - Инициализация заказа при AppEvents.UI_ORDER_BUTTON_START_CLICKED
        - Сбрасывает данные заказа в AppStateModel
        - Публикует событие: AppEvents.ORDER_INITIATED (для инициализации процесса заказа)
      - prepareOrder(step: 'delivery' | 'payment')
        - Подготавливает заказ к отправке в зависимости от шага 
        - Для шага 'delivery': публикует AppEvents.ORDER_DELIVERY_COMPLETED
        - Для шага 'payment': проверяет валидность через AppStateModel.order.isValid
          - При валидности: публикует AppEvents.ORDER_READY
          - При невалидности: не публикует событий

5. **Validation Service**:
	- Проверяет корректность введенных данных в формах заказа
	- Слушает события:
		- AppEvents.UI_ORDER_INPUT_DELIVERY_CHANGED (из OrderView)
		- AppEvents.UI_ORDER_SELECT_PAYMENT_CHANGED (из OrderView)
		- ppEvents.UI_ORDER_INPUT_MAIL_CHANGED (из ContactsView)
		- AppEvents.UI_ORDER_INPUT_PHONE_CHANGED (из ContactsView)
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
            - AppEvents.UI_ORDER_BUTTON_PAYMENT_SET (для обновления состояния)
		- validateEmail(email)
          - Проверяет email по регулярному выражению
          - Вызывается по событию: AppEvents.UI_ORDER_INPUT_MAIL_CHANGED
          - Публикует:
            - AppEvents.ORDER_EMAIL_VALID (при успехе)
            - AppEvents.ORDER_EMAIL_VALIDATION_ERROR (при ошибке)
            - AppEvents.ORDER_EMAIL_SET (для обновления состояния)
		- validatePhone(phone)
          - Проверяет телефон по регулярному выражению
          - Вызывается по событию: AppEvents.UI_ORDER_INPUT_PHONE_CHANGED
          - Публикует:
            - AppEvents.ORDER_PHONE_VALID (при успехе)
            - AppEvents.ORDER_PHONE_VALIDATION_ERROR (при ошибке)
        - validateOrderForm(formData)
          - Комплексная валидация всей формы 

6. **AppStateModal (модель)**:
	- Централизованное хранилище состояния приложения
    - Слушает события:
      - AppEvents.ORDER_PAYMENT_SET - обновление способа оплаты 
      - AppEvents.ORDER_EMAIL_SET - обновление email 
      - AppEvents.ORDER_PHONE_SET - обновление телефона 
      - AppEvents.ORDER_DELIVERY_SET - обновление адреса доставки
      - AppEvents.ORDER_SUBMITTED - очистка после успешного заказа
	- **Свойства**:
		- catalog: IProduct[] - список товаров
		- basket: string[] - товары в корзине (объекты, а не ID)
        - basketTotal: number - общая сумма корзины
		- order: IOrderFormState - данные заказа
		- preview: string | null - ID просматриваемого товара
	- **Команды**:
      - Сеттеры:
        - set catalog(items: IProduct[]) - обновляет каталог, публикует StateEvents.CATALOG_STATE_UPDATED
        - set basket(items: IProduct[]) - обновляет корзину, публикует StateEvents.BASKET_STATE_CHANGED
        - set order(form: Partial<IOrderFormState>) - обновляет данные заказа, выполняет валидацию, публикует StateEvents.ORDER_STATE_FORM_UPDATED
        - set preview(id: string | null) - устанавливает ID просматриваемого товара, публикует StateEvents.PREVIEW_STATE_UPDATED
      - Геттеры:
        - get state(): IAppState - возвращает полное текущее состояние
        - basketTotal(): number - возвращает сумму корзины
      - Приватные методы:
        - updateBasketTotal():
          - Пересчитывает сумму корзины
        - validateOrder():
          - Проверяет валидность данных заказа
        - validateOrderFields() 
          - Возвращает массив ошибок валидации 

### Представления и их презентеры:

1. **Главная страница (PageView & PagePresenter)**
   **PageView (Представление)** 
   - Рендерит главную страницу приложения, включая каталог товаров и кнопку корзины
   - Публикует события UI:
     - AppEvents.UI_BUTTON_BASKET_CLICKED - при клике на кнопку корзины в хедере
     - AppEvents.UI_PRODUCT_CLICKED - при клике на карточку товара в каталоге (с передачей id товара)

   **PagePresenter (Презентер)**
   - Управляет View (PageView) на основе изменений в Model (AppStateModel)
   - Слушает события Модели:
     - StateEvents.CATALOG_STATE_UPDATED (от AppStateModel) - вызывает PageView.render() для отрисовки каталога
     - StateEvents.BASKET_STATE_CHANGED (от AppStateModel) - вызывает PageView.updateBasketCounter() для обновления счетчика

2. **Карточка товара в каталоге (ProductItemView)**
   - Является частью PageView, создается динамически для каждого товара
   - Публикует события:
     - Событие клика пробрасывается через замыкание до PageView, которое эмитит AppEvents.UI_PRODUCT_CLICKED

3. **Модальное окно карточки товара (ProductView & ProductPresenter)**
   **ProductView (Представление)**
   - Отображает детальную информацию о товаре 
   - Предоставляет кнопку добавления/удаления из корзины
   - Публикует события UI:
     - AppEvents.MODAL_PRODUCT_BASKET_ITEM_ADDED - при клике на кнопку "Купить". 
     - AppEvents.MODAL_PRODUCT_BASKET_ITEM_REMOVED - при клике на кнопку "Удалить из корзины"

   **ProductPresenter (Презентер)**
   - Управляет состоянием кнопки в ProductView на основе данных корзины из AppStateModel
   - Слушает события:
     - AppEvents.PRODUCT_DETAILS_LOADED (от ApiService) - вызывает ProductView.render() для отображения данных товара. 
     - AppEvents.BASKET_ITEM_ADDED (от BasketService) - вызывает ProductView.updateButtonState() для обновления кнопки, если ID совпадает. 
     - AppEvents.BASKET_ITEM_REMOVED (от BasketService) - вызывает ProductView.updateButtonState() для обновления кнопки, если ID совпадает. 

4. **Модальное окно корзины (BasketView & BasketPresenter)**
   **BasketView (Представление)**
	- Отображает список товаров в корзине, общую сумму и кнопку оформления
	- Публикует события UI:
      - AppEvents.UI_ORDER_BUTTON_START_CLICKED - при клике на кнопку "Оформить заказ"
      - (Через BasketItemView) Событие удаления товара пробрасывается в переданный колбэк, который emits AppEvents.MODAL_PRODUCT_BASKET_ITEM_REMOVED

   **BasketPresenter (Презентер)** 
   - Управляет BasketView, перерисовывая её при любом изменении состояния корзины
   - Слушает события Модели:
     - StateEvents.BASKET_STATE_CHANGED (от AppStateModel) - вызывает BasketView.render() для полного обновления содержимого корзины
     - AppEvents.BASKET_ITEM_ADDED (от BasketService) - вызывает BasketView.render()
     - AppEvents.BASKET_ITEM_REMOVED (от BasketService) - вызывает BasketView.render()
     - AppEvents.BASKET_CONTENT_CHANGED (от BasketService) - вызывает BasketView.render()

5. **Модальное окно оформления заказа (OrderView & OrderPresenter)**
   **OrderView (Представление)**
   - Отображает форму ввода адреса доставки и выбора способа оплаты
   - Публикует события UI:
     - AppEvents.UI_ORDER_INPUT_DELIVERY_CHANGED - при изменении поля адреса
     - AppEvents.UI_ORDER_SELECT_PAYMENT_CHANGED - при изменении способа оплаты (через клик по кнопке)
     - AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED - при клике на кнопку "Далее"

   **OrderPresenter (Презентер)**
   - Инициализирует и обновляет OrderView на основе состояния заказа из AppStateModel
   - Слушает события:
     - AppEvents.ORDER_INITIATED (от OrderService) - вызывает OrderView.render() для инициализации формы
     - AppEvents.ORDER_VALIDATION_ERROR (от ValidationService/AppStateModel) - вызывает OrderView.showErrors() для отображения ошибок

6. **Модальное окно контактных данных (ContactsView & ContactsPresenter)**
   **ContactsView (Представление)**  
   - Отображает форму ввода контактных данных (email и телефон)
   - Публикует события UI:
     - AppEvents.UI_ORDER_INPUT_MAIL_CHANGED - при изменении поля email
     - AppEvents.UI_ORDER_INPUT_PHONE_CHANGED - при изменении поля телефона
     - AppEvents.UI_ORDER_BUTTON_PAY_CLICKED - при клике на кнопку "Оплатить" (сабмит формы)

   **ContactsPresenter (Презентер)**
   - Управляет ContactsView, отображая текущие данные и ошибки из AppStateModel.order
   - Слушает события:
     - AppEvents.ORDER_INITIATED (от OrderService) - вызывает ContactsView.render() для инициализации формы
     - AppEvents.ORDER_VALIDATION_ERROR (от ValidationService/AppStateModel) - вызывает ContactsView.showErrors() для отображения ошибок

7. **Модальное окно подтверждения заказа (SuccessView & SuccessPresenter)**
   **SuccessView (Представление)** 
   - Отображает сообщение об успешном оформлении заказа и итоговую сумму
   - Публикует события UI:
     - AppEvents.MODAL_CLOSED - при клике на кнопку закрытия

   **SuccessPresenter (Презентер)**
   - Управляет отображением успешного заказа в SuccessView
   - Слушает события:
     - AppEvents.ORDER_SUBMITTED (от ApiService) - вызывает SuccessView.render() с итоговой суммой

8. **Базовое модальное окно (ModalView) и управление модалками (ModalPresenter)**
   **ModalView (Базовое представление)**
   - Реализует базовую логику открытия/закрытия модального окна
   - Предоставляет метод render(content) для отображения контента

   **ModalPresenter (Презентер)**
   - Координирует отображение модальных окон, выступая как менеджер представлений
   - Слушает события:
     - AppEvents.MODAL_OPENED (от ModalService) - управляет открытием конкретного модального окна из переданного списка views, закрывая все остальные
     - AppEvents.MODAL_CLOSED - закрывает все модальные окна

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

```

## Архитектурный подход

Проект использует гибридную событийно-ориентированную архитектуру, сочетающую паттерны Model-View-Presenter (MVP) и Посредник (Mediator), с четким разделением ответственности между компонентами

1. Централизованное состояние (Единый источник истины):
   - Модель AppStateModel является центральным хранилищем всего состояния приложения (каталог, корзина, данные заказа)
   - Все изменения состояния происходят строго через сеттеры модели, которые автоматически публикуют соответствующие события (StateEvents)
2. Событийная коммуникация (Шина событий):
   - Центральный EventEmitter служит шиной событий для всех компонентов
   - Взаимодействие между несвязанными компонентами (Сервисы, Презентеры, Модель) происходит исключительно через публикацию и подписку на строго типизированные события (AppEvents, StateEvents)
3. Разделение ответственности:
   - Model (AppStateModel): Управление данными, бизнес-логика состояния (валидация заказа, расчет суммы корзины)
   - View (*View): Отрисовка UI, обработка пользовательского ввода (DOM-манипуляции, клики, ввод данных). Публикуют пользовательские события (UI_*)
   - Presenter (*Presenter): Связующее звено. Слушают события от Модели (об изменении состояния) и View (о действиях пользователя). Реагируют на них, вызывая методы Сервисов для выполнения действий или обновляя View новыми данными из Модели. Содержат основную логику взаимодействия
   - Service (*Service): Сервисы. Инкапсулируют специфическую бизнес-логику и side-effects (работа с API, управление модальными окнами, валидация полей). Предоставляют чистый API для вызова Презентерами.
4. Однонаправленный поток данных:
   - Поток данных в приложении преимущественно однонаправленный:
     - Пользовательское действие -> View публикует UI_* событие
     - Презентер ловит событие и вызывает метод Сервиса
     - Сервис выполняет действие и/или изменяет состояние через Модель
     - Модель публикует StateEvents о изменении состояния
     - Презентер ловит StateEvents и обновляет View новыми данными

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
Главная страница (PageView)
├── Каталог товаров (рендерится внутри PageView)
│   └── Карточка товара (ProductItemView)
├── Кнопка корзины в хедере
│   └── Счётчик товаров (обновляется из Model)
└── Система модальных окон (независимые компоненты)
    ├── Контейнер модального окна товара (#modal-product)
    │   └── Контент модального окна товара (ProductView)
    │       ├── Информация о товаре
    │       └── Кнопка "В корзину" / "Удалить"
    ├── Контейнер модального окна корзины (#modal-basket)
    │   └── Контент модального окна корзины (BasketView)
    │       ├── Список товаров (набор BasketItemView)
    │       ├── Общая сумма
    │       └── Кнопка "Оформить"
    ├── Контейнер модального окна заказа (#modal-order)
    │   └── Контент модального окна заказа (OrderView)
    │       ├── Поле "Адрес доставки"
    │       ├── Кнопка "Онлайн"
    │       ├── Кнопка "При получении"
    │       └── Кнопка "Далее"
    ├── Контейнер модального окна контактов (#modal-contacts)
    │   └── Контент модального окна контактов (ContactsView)
    │       ├── Поле "Email"
    │       ├── Поле "Телефон"
    │       └── Кнопка "Оплатить"
    └── Контейнер модального окна успеха (#modal-success)
        └── Контент модального окна успеха (SuccessView)
            └── Кнопка "За новыми покупками!"

Управление видимостью (open/close):
- Каждое модальное окно (ModalView) управляет своим контейнером (#modal-*)
- ModalPresenter координирует, какое именно окно должно быть открыто, на основе события MODAL_OPENED               
```

## Граф событий

1. **Инициализация приложения**:
	- DOMContentLoaded → index.ts инициализация
	- AppEvents.PAGE_MAIN_LOADED → ApiService.loadProducts()
      - Успех: сохраняет в AppStateModal.catalog → StateEvents.CATALOG_UPDATED → PagePresenter → PageView.render()
      - Ошибка: очищает каталог (AppStateModal.catalog = [])
   
2. **Просмотр товара**:
   - Клик на товар в PageView → AppEvents.UI_PRODUCT_CLICKED → ModalService.openProductModal()
     - AppEvents.MODAL_OPENED (type: 'product') + AppEvents.PRODUCT_DETAILS_REQUESTED
     - ApiService.loadProductDetails():
       - Найден в кэше (AppStateModal.state.catalog): AppEvents.PRODUCT_DETAILS_LOADED → ProductPresenter → ProductModal.renderProduct()
       - Не найден: запрос на сервер → AppEvents.PRODUCT_DETAILS_LOADED → ProductPresenter → ProductView.renderProduct()

3. **Работа с корзиной**:
	- Добавление товара:
	  - Клик "Купить" в ProductView → AppEvents.MODAL_PRODUCT_BASKET_ITEM_ADDED → Обработчик в index.ts → BasketService.addToBasket()
      - BasketService вызывает appState.basket = [...newItems]
      - StateEvents.BASKET_STATE_CHANGED (публикует AppStateModel) → PagePresenter → PageView.updateBasketCounter(), BasketPresenter → BasketView.render()
      - AppEvents.BASKET_ITEM_ADDED (публикует BasketService) → ProductPresenter → ProductView.updateButtonState() (если ID совпадает)
    
    - Удаление товара:
      - Клик "Удалить" в BasketItemView → Колбэк в BasketView → AppEvents.MODAL_PRODUCT_BASKET_ITEM_REMOVED → Обработчик в index.ts → BasketService.removeFromBasket()
      - BasketService вызывает appState.basket = [...newItems]
      - StateEvents.BASKET_STATE_CHANGED (публикует AppStateModel) → PagePresenter → PageView.updateBasketCounter(), BasketPresenter → BasketView.render()
      - AppEvents.BASKET_ITEM_REMOVED (публикует BasketService) → ProductPresenter → ProductView.updateButtonState() (если ID совпадает)
    
    - Открытие корзины:
      - Клик на иконку корзины в PageView → AppEvents.UI_BUTTON_BASKET_CLICKED → ModalService.openCartModal()
      - AppEvents.MODAL_OPENED (type: 'cart') → ModalPresenter → BasketModalView.open()
      - BasketView уже отрендерен и актуален благодаря реакции BasketPresenter на StateEvents.BASKET_STATE_CHANGED

4. **Оформление заказа**:
   - Инициализация:
     - Клик "Оформить" в BasketView → AppEvents.UI_ORDER_BUTTON_START_CLICKED → OrderService (сбрасывает форму) → AppEvents.ORDER_INITIATED → OrderPresenter → OrderView.render()
     - ModalService.openOrderModal() → AppEvents.MODAL_OPENED (type: 'order') → ModalPresenter → OrderModalView.open()
   
     - Ввод адреса и выбор оплаты:
       - Изменение адреса в OrderView → AppEvents.UI_ORDER_INPUT_DELIVERY_CHANGED → ValidationService.validateDelivery()
         - Успех: AppEvents.ORDER_DELIVERY_VALID → Обработчик в AppStateModel → appState.order = { address } → StateEvents.ORDER_STATE_FORM_UPDATED
         - Ошибка: AppEvents.ORDER_VALIDATION_ERROR → OrderPresenter → OrderView.showErrors()
       - Выбор оплаты в OrderView → AppEvents.UI_ORDER_SELECT_PAYMENT_CHANGED → ValidationService.validatePayment()
         - Успех: AppEvents.ORDER_PAYMENT_VALID + AppEvents.UI_ORDER_BUTTON_PAYMENT_SET → Обработчик в AppStateModel → appState.order = { payment } → StateEvents.ORDER_STATE_FORM_UPDATED
         - Ошибка: AppEvents.ORDER_PAYMENT_VALIDATION_ERROR → OrderPresenter → OrderView.showErrors()
     
     - Кнопка "Далее" в OrderView → AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED → OrderService.prepareOrder('delivery') → AppEvents.ORDER_DELIVERY_COMPLETED → ModalService.openContactsModal()
       - AppEvents.MODAL_OPENED (type: 'contacts') → ModalPresenter → ContactsModalView.open()
   
     - Ввод контактов:
       - Изменение email в ContactsView → AppEvents.UI_ORDER_INPUT_MAIL_CHANGED → ValidationService.validateEmail()
         - Успех: AppEvents.ORDER_EMAIL_VALID + AppEvents.ORDER_EMAIL_SET → Обработчик в AppStateModel → appState.order = { email } → StateEvents.ORDER_STATE_FORM_UPDATED
         - Ошибка: AppEvents.ORDER_EMAIL_VALIDATION_ERROR → ContactsPresenter → ContactsView.showErrors()
     
     - Изменение телефона в ContactsView → AppEvents.UI_ORDER_INPUT_PHONE_CHANGED → ValidationService.validatePhone()
       - Успех: AppEvents.ORDER_PHONE_VALID + AppEvents.ORDER_PHONE_SET → Обработчик в AppStateModel → appState.order = { phone } → StateEvents.ORDER_STATE_FORM_UPDATED
       - Ошибка: AppEvents.ORDER_PHONE_VALIDATION_ERROR → ContactsPresenter → ContactsView.showErrors()
     
     - Кнопка "Оплатить" в ContactsView → AppEvents.UI_ORDER_BUTTON_PAY_CLICKED → OrderService.prepareOrder('payment')
       - Проверяет appState.state.order.isValid (рассчитано моделью)
       - Если valid: AppEvents.ORDER_READY → ApiService.submitOrder()

5. **Успешное оформление**:
	- SuccessPresenter подписан на AppEvents.ORDER_SUBMITTED → SuccessView.render(data.total)
    - Клик "За новыми покупками!" → AppEvents.MODAL_CLOSED → ModalPresenter → SuccessModalView.close()

6. **Закрытие модальных окон**:
	- Клик на крестик/оверлей → ModalView.close() → AppEvents.MODAL_CLOSED (вручную)
    - AppEvents.MODAL_CLOSED → ModalPresenter → Закрывает все модальные окна

## Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — Файл с основными типами данных и интерфейсами (IProduct, IOrder, IAppState и т.д.)
- src/types/events.ts — Файл с константами событий (AppEvents, StateEvents)
- src/index.ts — Точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с утилитами (ensureElement, cloneTemplate)
- src/components/models/AppStateModel.ts — Модель состояния приложения
- src/components/services/ — Директория с сервисами, инкапсулирующими специфическую логику (API, Корзина, Модалки, Заказы, Валидация)
- src/components/views/ — Директория с представлениями (Views), где каждый класс отвечает за отрисовку своего компонента и генерацию UI-событий
- src/components/presenters/ — Директория с презентерами
- src/components/base/events.ts — Реализация класса EventEmitter 