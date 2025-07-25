/**
 * Все события приложения
 * @namespace AppEvents
 */
export const AppEvents = {
	/** Событие загрузки главной страницы */
	PAGE_MAIN_LOADED: 'page:main:loaded',

	// Товары
	/** Событие загрузки списка товаров */
	PRODUCTS_LIST_LOADED: 'products_list:loaded',
	/** Событие запроса деталей товара */
	PRODUCT_DETAILS_REQUESTED: 'product:details_requested',
	/** Событие загрузки деталей товара */
	PRODUCT_DETAILS_LOADED: 'product:details_loaded',

	// Корзина
	/** Событие успешного добавления товара в корзину */
	CART_ITEM_ADDED: 'cart:item_added',
	/** Событие ошибки добавления товара в корзину */
	CART_ITEM_ADD_ERROR: 'cart:item_add_error',
	/** Событие успешного удаления товара из корзины */
	CART_ITEM_REMOVED: 'cart:item_removed',
	/** Событие обновления состояния корзины */
	CART_UPDATED: 'cart:updated',
	/** Событие очистки корзины */
	CART_CLEAR: 'cart:clear',

	// Заказ
	/** Событие успешного создания заказа */
	ORDER_INITIATED: 'order:initiated',
	/** Событие введения адреса доставки */
	ORDER_DELIVERY_SET: 'order:delivery_set',
	/** Событие выбора способа оплаты */
	ORDER_PAYMENT_SET: 'order:payment_set',
	/** Событие формирования заказа */
	ORDER_READY: 'order:ready',
	/** Событие отправки заказа на сервер */
	ORDER_SENT: 'order:sent',
	/** Событие успешной отправки заказа на сервер */
	ORDER_SUBMITTED: 'order:submitted',

	// Валидация
	/** Событие успешной валидации адреса доставки */
	ORDER_DELIVERY_VALID: 'order:delivery_valid',
	/** Событие ошибки валидации */
	ORDER_VALIDATION_ERROR: 'order:validation_error',
	/** Событие успешной валидации способа оплаты */
	ORDER_PAYMENT_VALID: 'order:payment:valid',
	/** Событие ошибки валидации способа оплаты */
	ORDER_PAYMENT_VALIDATION_ERROR: 'payment:validation_error',
	/** Событие успешной валидации email */
	ORDER_EMAIL_VALID: 'email:valid',
	/** Событие ошибки валидации email */
	ORDER_EMAIL_VALIDATION_ERROR: 'email:validation_error',
	/** Событие успешной валидации телефона */
	ORDER_PHONE_VALID: 'phone:valid',
	/** Событие ошибки валидации телефона */
	ORDER_PHONE_VALIDATION_ERROR: 'phone:validation_error',

	// UI события
	/** Событие клика по кнопке "В корзину" */
	UI_BUTTON_CART_CLICKED: 'ui:button:cart:clicked',
	/** Событие клика по кнопке "Оформить заказ" */
	UI_ORDER_BUTTON_START_CLICKED: 'ui:order:button:start_clicked',
	/** Событие клика по кнопке "Далее" */
	UI_ORDER_BUTTON_NEXT_CLICKED: 'ui:order:button:next:clicked',
	/** Событие клика по кнопке выбора способа оплаты */
	UI_ORDER_BUTTON_PAYMENT_CLICKED: 'ui:order:button:payment:clicked',
	/** Событие изменения формы адреса доставки заказа */
	UI_ORDER_INPUT_DELIVERY_CHANGED: 'ui:order:input:delivery:changed',
	/** Событие изменения способа оплаты заказа */
	UI_ORDER_SELECT_PAYMENT_CHANGED: 'ui:order:select:payment:changed',
	/** Событие изменения формы почты доставки заказа */
	UI_ORDER_INPUT_MAIL_CHANGED: 'ui:order:input:mail:changed',
	/** Событие изменения формы телефона доставки заказа */
	UI_ORDER_INPUT_PHONE_CHANGED: 'ui:order:input:phone:changed',

	// Модальные окна
	/** Событие открытия модального окна корзины */
	MODAL_OPENED: 'modal:opened',
	/** Событие закрытия модального окна корзины */
	MODAL_CLOSED: 'modal:closed',
	/** Событие добавления товара в корзину */
	MODAL_PRODUCT_CART_ITEM_ADDED: 'modal:product:cart_item_added',
	/** Событие удаления товара из корзины */
	MODAL_CART_ITEM_REMOVED: 'modal:cart:item_removed'
};

export const StateEvents = {
	/** Событие обновления каталога товаров */
	CATALOG_UPDATED: 'state:catalog:updated',
	/** Событие обновления корзины */
	BASKET_UPDATED: 'state:basket:updated',
	/** Событие обновления формы заказа */
	ORDER_FORM_UPDATED: 'state:order:updated',
	/** Событие обновления превью товара */
	PREVIEW_UPDATED: 'state:preview:updated'
} as const;