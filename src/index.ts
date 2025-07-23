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

// Инициализация EventEmitter
const eventEmitter = new EventEmitter();

// Инициализация API
const api = new Api(API_URL);

// Инициализация сервисов
const apiService = new ApiService(api, eventEmitter); // Передаем экземпляр Api
const cartService = new CartService(eventEmitter);
const modalService = new ModalService(eventEmitter);
const orderService = new OrderService(eventEmitter);
const validationService = new ValidationService(eventEmitter);

// Инициализация компонентов
const page = new Page(eventEmitter);
const productModal = new ProductModal(eventEmitter);
const cartModal = new CartModal(eventEmitter);
const orderModal = new OrderModal(eventEmitter);
const contactsModal = new ContactsModal(eventEmitter);
const successModal = new SuccessModal(eventEmitter);