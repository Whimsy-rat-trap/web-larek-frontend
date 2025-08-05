import './scss/styles.scss';
import { EventEmitter } from "./components/base/events";
import { Api } from "./components/base/api";
import { ApiService } from "./components/services/ApiService";
import { CartService } from "./components/services/CartService";
import { ModalService } from "./components/services/ModalService";
import { OrderService } from "./components/services/OrderService";
import { ValidationService } from "./components/services/ValidationService";
import { Page } from "./components/Page";
import { ProductModal } from "./components/ProductModal";
import { CartModal } from "./components/CartModal";
import { OrderModal } from "./components/OrderModal";
import { ContactsModal } from "./components/ContactsModal";
import { SuccessModal } from "./components/SuccessModal";
import { API_URL } from "./utils/constants";
import { AppEvents } from "./types/events";
import { AppState } from "./components/services/AppState";

/**
 * Инициализация приложения после загрузки страницы
 */
document.addEventListener('DOMContentLoaded', () => {
	const eventEmitter = new EventEmitter();
	const api = new Api(API_URL);

	const appState = new AppState(eventEmitter);
	const cartService = new CartService(eventEmitter, appState);
	const apiService = new ApiService(api, eventEmitter, appState);
	const modalService = new ModalService(eventEmitter);
	const orderService = new OrderService(eventEmitter, appState);
	const validationService = new ValidationService(eventEmitter);

	const page = new Page(eventEmitter);
	const productModal = new ProductModal(eventEmitter);
	const cartModal = new CartModal(eventEmitter, cartService);
	const orderModal = new OrderModal(eventEmitter);
	const successModal = new SuccessModal(eventEmitter, cartService); // CartService реализует ICartServiceForSuccess
	const contactsModal = new ContactsModal(eventEmitter); // CartService реализует ICartServiceForContacts

	// Публикация события загрузки страницы
	eventEmitter.emit(AppEvents.PAGE_MAIN_LOADED);
});