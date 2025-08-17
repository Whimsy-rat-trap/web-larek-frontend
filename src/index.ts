import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { Api } from './components/base/api';
import { ApiService } from './components/services/ApiService';
import { BasketService } from './components/services/BasketService';
import { ModalService } from './components/services/ModalService';
import { OrderService } from './components/services/OrderService';
import { ValidationService } from './components/services/ValidationService';
import { PageView } from './components/views/PageView';
import { ProductView } from './components/views/ProductView';
import { BasketView } from './components/views/BasketView';
import { OrderView } from './components/views/OrderView';
import { ContactsModalView } from './components/views/ContactsModalView';
import { SuccessView } from './components/views/SuccessView';
import { API_URL } from './utils/constants';
import { AppEvents } from './types/events';
import { AppStateModel } from './components/models/AppStateModel';
import { BasketPresenter } from './components/presenters/BasketPresenter';
import { ContactsPresenter } from './components/presenters/ContactsPresenter';
import { ModalPresenter } from './components/presenters/ModalPresenter';
import { OrderPresenter } from './components/presenters/OrderPresenter';
import { PagePresenter } from './components/presenters/PagePresenter';
import { ProductPresenter } from './components/presenters/ProductPresenter';
import { SuccessPresenter } from './components/presenters/SuccessPresenter';
import { ModalView } from './components/views/ModalView';
import { PaymentMethod } from './types';

const eventEmitter = new EventEmitter();

const appState = new AppStateModel(eventEmitter);

const basketService = new BasketService(eventEmitter, appState);

function basketButtonClick() {
	eventEmitter.emit(AppEvents.UI_BUTTON_BASKET_CLICKED);
}

function cardButtonClick(productId: string) {
	eventEmitter.emit(AppEvents.UI_PRODUCT_CLICKED, { id: productId });
}

function checkoutButtonClick() {
	eventEmitter.emit(AppEvents.UI_ORDER_BUTTON_START_CLICKED);
}

function deleteButtonClick(productId: string) {
	basketService.removeFromBasket(productId);
}

function addToBasketClick(productId: string) {
	basketService.addToBasket(productId);
}

function removeFromBasketClick(productId: string) {
	basketService.removeFromBasket(productId);
}

function orderAddressInput(address: string) {
	eventEmitter.emit(AppEvents.ORDER_DELIVERY_SET, { address });
}

function orderPaymentMethodSet(method: PaymentMethod) {
	eventEmitter.emit(AppEvents.UI_ORDER_BUTTON_PAYMENT_SET, { method });
}

function orderNextButtonClick() {
	eventEmitter.emit(AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED);
}

function successCloseClick() {
	eventEmitter.emit(AppEvents.MODAL_CLOSED);
}

function contactsEmailSet(email: string) {
	eventEmitter.emit(AppEvents.UI_ORDER_INPUT_MAIL_CHANGED, { value: email });
	eventEmitter.emit(AppEvents.ORDER_EMAIL_SET, { email });
}

function contactsInputPhoneChanged(value: string) {
	eventEmitter.emit(AppEvents.UI_ORDER_INPUT_PHONE_CHANGED, { value });
}

function contactsPhoneSet(phone: string) {
	eventEmitter.emit(AppEvents.ORDER_PHONE_SET, { phone });
}

function contactsButtonClicked() {
	eventEmitter.emit(AppEvents.UI_ORDER_BUTTON_PAY_CLICKED);
}

/**
 * Инициализация приложения после загрузки страницы
 */
document.addEventListener('DOMContentLoaded', () => {
	const api = new Api(API_URL);

	const apiService = new ApiService(api, eventEmitter, appState);
	const modalService = new ModalService(eventEmitter);
	const orderService = new OrderService(eventEmitter, appState);
	const validationService = new ValidationService(eventEmitter);

	const pageView = new PageView(basketButtonClick, cardButtonClick);
	const productView = new ProductView(addToBasketClick, removeFromBasketClick);
	const basketView = new BasketView(checkoutButtonClick, deleteButtonClick);
	const orderView = new OrderView(
		orderAddressInput,
		orderPaymentMethodSet,
		orderNextButtonClick
	);
	const contactsModal = new ContactsModalView(
		contactsEmailSet,
		contactsInputPhoneChanged,
		contactsPhoneSet,
		contactsButtonClicked
	);
	const successView = new SuccessView(successCloseClick);
	const modalView = new ModalView(eventEmitter);

	const basketPresenter = new BasketPresenter(
		basketView,
		appState,
		eventEmitter
	);
	const contactsPresenter = new ContactsPresenter(
		contactsModal,
		appState,
		eventEmitter
	);
	const modalPresenter = new ModalPresenter(
		modalView,
		appState,
		eventEmitter,
		basketView,
		productView,
		orderView,
		contactsModal,
		successView
	);
	const orderPresenter = new OrderPresenter(orderView, appState, eventEmitter);
	const pagePresenter = new PagePresenter(pageView, appState, eventEmitter);
	const productPresenter = new ProductPresenter(
		productView,
		appState,
		eventEmitter
	);
	const successPresenter = new SuccessPresenter(
		successView,
		appState,
		eventEmitter
	);

	// Публикация события загрузки страницы
	eventEmitter.emit(AppEvents.PAGE_MAIN_LOADED);
});
