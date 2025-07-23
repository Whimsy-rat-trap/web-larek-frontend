// Все события приложения
export const AppEvents = {
	// Инициализация
	PAGE_MAIN_LOADED: 'page:main:loaded',

	// Товары
	PRODUCTS_LIST_LOADED: 'products_list:loaded',
	PRODUCT_DETAILS_REQUESTED: 'product:details_requested',
	PRODUCT_DETAILS_LOADED: 'product:details_loaded',

	// Корзина
	CART_ITEM_ADDED: 'cart:item_added',
	CART_ITEM_ADD_ERROR: 'cart:item_add_error',
	CART_ITEM_REMOVED: 'cart:item_removed',
	CART_UPDATED: 'cart:updated',
	CART_CLEAR: 'cart:clear',

	// Заказ
	ORDER_INITIATED: 'order:initiated',
	ORDER_DELIVERY_SET: 'order:delivery_set',
	ORDER_PAYMENT_SET: 'order:payment_set',
	ORDER_READY: 'order:ready',
	ORDER_SENT: 'order:sent',
	ORDER_SUBMITTED: 'order:submitted',

	// Валидация
	ORDER_DELIVERY_VALID: 'order:delivery_valid',
	ORDER_VALIDATION_ERROR: 'order:validation_error',
	PAYMENT_VALID: 'payment:valid',
	PAYMENT_VALIDATION_ERROR: 'payment:validation_error',
	EMAIL_VALID: 'email:valid',
	EMAIL_VALIDATION_ERROR: 'email:validation_error',
	PHONE_VALID: 'phone:valid',
	PHONE_VALIDATION_ERROR: 'phone:validation_error',

	// UI события
	UI_BUTTON_CART_CLICKED: 'ui:button:cart:clicked',
	UI_ORDER_BUTTON_START_CLICKED: 'ui:order:button:start_clicked',
	UI_ORDER_BUTTON_NEXT_CLICKED: 'ui:order:button:next:clicked',
	UI_ORDER_BUTTON_PAYMENT_CLICKED: 'ui:order:button:payment:clicked',
	UI_ORDER_INPUT_DELIVERY_CHANGED: 'ui:order:input:delivery:changed',
	UI_ORDER_SELECT_PAYMENT_CHANGED: 'ui:order:select:payment:changed',
	UI_ORDER_INPUT_MAIL_CHANGED: 'ui:order:input:mail:changed',
	UI_ORDER_INPUT_PHONE_CHANGED: 'ui:order:input:phone:changed',

	// Модальные окна
	MODAL_OPENED: 'modal:opened',
	MODAL_CLOSED: 'modal:closed',
	MODAL_PRODUCT_CART_ITEM_ADDED: 'modal:product:cart_item_added',
	MODAL_CART_ITEM_REMOVED: 'modal:cart:item_removed'
};