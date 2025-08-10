import './scss/styles.scss';
import { EventEmitter } from "./components/base/events";
import { Api } from "./components/base/api";
import { ApiService } from "./components/services/ApiService";
import { CartService } from "./components/services/CartService";
import { ModalService } from "./components/services/ModalService";
import { OrderService } from "./components/services/OrderService";
import { ValidationService } from "./components/services/ValidationService";
import { PageView } from "./components/views/PageView";
import { ProductModalView } from "./components/views/ProductModalView";
import { CartModalView } from "./components/views/CartModalView";
import { OrderModalView } from "./components/views/OrderModalView";
import { ContactsModalView } from "./components/views/ContactsModalView";
import { SuccessModalView } from "./components/views/SuccessModalView";
import { API_URL } from "./utils/constants";
import { AppEvents } from "./types/events";
import { AppStateModel } from "./components/models/AppStateModel";

import { BasketPresenter } from "./components/presenters/BasketPresenter";
import { ContactsPresenter } from "./components/presenters/ContactsPresenter";
import { ModalPresenter } from "./components/presenters/ModalPresenter";
import { OrderPresenter } from "./components/presenters/OrderPresenter";
import { PagePresenter } from "./components/presenters/PagePresenter";
import { ProductPresenter } from "./components/presenters/ProductPresenter";
import { SuccessPresenter } from "./components/presenters/SuccessPresenter";

import { ModalView } from './components/views/ModalView';

const eventEmitter = new EventEmitter();

function basketButtonClick () {
	eventEmitter.emit(AppEvents.UI_BUTTON_BASKET_CLICKED);
}

function cardButtonClick(id: number) {
	eventEmitter.emit(AppEvents.UI_PRODUCT_CLICKED, { id: id });
}

function checkoutButtonClick() {
	eventEmitter.emit(AppEvents.UI_ORDER_BUTTON_START_CLICKED);
}

function deleteButtonClick(id: number) {
	this.eventEmitter.emit(AppEvents.MODAL_PRODUCT_BASKET_ITEM_REMOVED, { id: id });
}

function addToCartClick(id: string) {
	eventEmitter.emit(AppEvents.MODAL_PRODUCT_BASKET_ITEM_ADDED, { id: id });
}

function removeFromCartClick(id: string) {
	eventEmitter.emit(AppEvents.MODAL_PRODUCT_BASKET_ITEM_REMOVED, { id: id });
}

function requestButtonState(id: string, callback: (inCart: boolean) => void) {
	eventEmitter.emit(AppEvents.UI_MODAL_PRODUCT_BUTTON_STATE_CHANGED, { id, callback });
}

function orderAddressInput(address: string) {
	eventEmitter.emit(AppEvents.ORDER_DELIVERY_SET, { address });
}

function orderPaymentMethodSet(method: 'online' | 'cash') {
	eventEmitter.emit(AppEvents.UI_ORDER_BUTTON_PAYMENT_SET, { method });
}

function orderNextButtonClick() {
	eventEmitter.emit(AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED);
}

/**
 * Инициализация приложения после загрузки страницы
 */
document.addEventListener('DOMContentLoaded', () => {
	const api = new Api(API_URL);

	const appState = new AppStateModel(eventEmitter);
	const cartService = new CartService(eventEmitter, appState);
	const apiService = new ApiService(api, eventEmitter, appState);
	const modalService = new ModalService(eventEmitter);
	const orderService = new OrderService(eventEmitter, appState);
	const validationService = new ValidationService(eventEmitter);

	const page = new PageView(basketButtonClick, cardButtonClick);
	const productModal = new ProductModalView(addToCartClick, removeFromCartClick, requestButtonState);
	const cartModal = new CartModalView(checkoutButtonClick, deleteButtonClick, cartService);
	const orderModal = new OrderModalView(orderAddressInput, orderPaymentMethodSet, orderNextButtonClick);
	const successModal = new SuccessModalView(eventEmitter, cartService);
	const contactsModal = new ContactsModalView(eventEmitter);
	const modal = new ModalView(eventEmitter);

	const basketPresenter = new BasketPresenter(cartModal, appState, eventEmitter);
	const contactsPresenter = new ContactsPresenter(contactsModal, appState);
	const modalPresenter = new ModalPresenter(modal, appState);
	const orderPresenter = new OrderPresenter(orderModal, appState, eventEmitter);
	const pagePresenter = new PagePresenter(page, appState, eventEmitter);
	const productPresenter = new ProductPresenter(productModal, appState, eventEmitter);
	const successPresenter = new SuccessPresenter(successModal, appState);

	// Публикация события загрузки страницы
	eventEmitter.emit(AppEvents.PAGE_MAIN_LOADED);
});