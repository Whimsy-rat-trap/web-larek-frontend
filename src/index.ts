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
import { AppStateModal } from "./components/models/AppStateModal";

/**
 * Инициализация приложения после загрузки страницы
 */
document.addEventListener('DOMContentLoaded', () => {
	const eventEmitter = new EventEmitter();
	const api = new Api(API_URL);

	const appState = new AppStateModal(eventEmitter);
	const cartService = new CartService(eventEmitter, appState);
	const apiService = new ApiService(api, eventEmitter, appState);
	const modalService = new ModalService(eventEmitter);
	const orderService = new OrderService(eventEmitter, appState);
	const validationService = new ValidationService(eventEmitter);

	const page = new PageView(eventEmitter);
	const productModal = new ProductModalView(eventEmitter);
	const cartModal = new CartModalView(eventEmitter, cartService);
	const orderModal = new OrderModalView(eventEmitter);
	const successModal = new SuccessModalView(eventEmitter, cartService); // CartService реализует ICartServiceForSuccess
	const contactsModal = new ContactsModalView(eventEmitter); // CartService реализует ICartServiceForContacts

	// Публикация события загрузки страницы
	eventEmitter.emit(AppEvents.PAGE_MAIN_LOADED);
});