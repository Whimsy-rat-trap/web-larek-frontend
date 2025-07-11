import './scss/styles.scss';
import { ensureElement, cloneTemplate } from './utils/utils';
import { ICardActions, Product } from './types';
import { CardList } from './components/CardList';
import { Api } from './components/base/api';
import { AppData } from './components/AppData';
import { API_URL } from './utils/constants';
import { Card } from './components/Card';
import { Basket } from './components/Basket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { SuccessModal } from './components/SuccessModal';

// Получаем DOM-элементы
const productModal = ensureElement<HTMLElement>('#product-modal');
const basketModal = ensureElement<HTMLElement>('#basket-modal');
const paymentModal = ensureElement<HTMLElement>('#payment-modal');
const contactsModal = ensureElement<HTMLElement>('#contacts-modal');
const successModalElement = ensureElement<HTMLElement>('#success-modal');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Инициализация форм
const order = new Order(paymentModal);
const contacts = new Contacts(contactsModal);

// Инициализация API и данных приложения
const api = new Api(API_URL);
const appData = new AppData(api);
const basket = new Basket(
	ensureElement<HTMLTemplateElement>('#basket'),
	ensureElement<HTMLTemplateElement>('#card-basket'),
	basketModal,
	paymentModal,
	openModal,
	closeModal
);

// Инициализация модального окна успеха
const successModal = new SuccessModal(
	successModalElement,
	successTemplate,
	basket,
	contactsModal,
	paymentModal,
	order,
	contacts,
	closeModal,
	appData
);

async function initializeApp() {
	galleryContainer.innerHTML = '<p class="loading">Загрузка товаров...</p>';
	try {
		const products = await appData.getProducts();
		cardList.addCards(products);
	} catch (error) {
		console.error('Не удалось загрузить товары:', error);
		// Можно показать сообщение об ошибке пользователю
		galleryContainer.innerHTML = '<p class="error">Не удалось загрузить товары. Пожалуйста, попробуйте позже.</p>';
	}
}

// Функции для управления модальными окнами
function toggleBodyScroll(enable: boolean) {
	document.body.classList.toggle('_modal-open', !enable);
}

function openModal(modal: HTMLElement) {
	modal.classList.add('modal_active');
	toggleBodyScroll(false);
	modal.scrollTo(0, 0);
}

function closeModal(modal: HTMLElement) {
	modal.classList.remove('modal_active');
	toggleBodyScroll(true);
}

// Обработчик клика по карточке
const cardActions: ICardActions = {
	onClick: (event: MouseEvent) => {
		const cardElement = event.currentTarget as HTMLElement;
		const cardId = cardElement.dataset.id;
		if (!cardId) return;

		const product = appData.catalog.find(item => item.id === cardId);
		if (!product) return;

		const modalContent = productModal.querySelector('.modal__content');
		if (!modalContent) return;

		const previewCard = new Card(cardPreviewTemplate);
		previewCard.render(product);
		modalContent.innerHTML = '';
		modalContent.appendChild(previewCard.render(product));

		const addToCartButton = productModal.querySelector('.button');
		if (addToCartButton) {
			addToCartButton.addEventListener('click', () => {
				basket.addItem(product);
				closeModal(productModal);
			});
		}

		openModal(productModal);
	}
};

// Создание списка карточек
const cardList = new CardList(galleryContainer, cardCatalogTemplate, cardActions);

// Загрузка и отображение карточек
appData.getProducts()
	.then((products: Product[]) => {
		cardList.addCards(products);
	})
	.catch((error: Error) => {
		console.error('Ошибка при загрузке продуктов:', error);
	});

async function loadProducts() {
	try {
		const products = await appData.getProducts();
		const cardList = new CardList(
			galleryContainer,
			cardCatalogTemplate,
			{
				onClick: (event) => {
					const cardElement = event.currentTarget as HTMLElement;
					const productId = cardElement.dataset.id;
					const product = products.find(p => p.id === productId);

					if (product) {
						const previewCard = new Card(cardPreviewTemplate);
						const modalContent = productModal.querySelector('.modal__content');
						if (modalContent) {
							modalContent.innerHTML = '';
							modalContent.appendChild(previewCard.render(product));

							// Добавляем обработчик для кнопки "В корзину"
							const addButton = modalContent.querySelector('.button');
							if (addButton) {
								addButton.addEventListener('click', () => {
									basket.addItem(product);
									closeModal(productModal);
								});
							}
						}
						openModal(productModal);
					}
				}
			}
		);
		cardList.addCards(products);
	} catch (error) {
		console.error('Ошибка загрузки товаров:', error);
		galleryContainer.innerHTML = '<p class="error">Не удалось загрузить товары</p>';
	}
}

// Обработчики для всех модальных окон
document.addEventListener('DOMContentLoaded', () => {
	loadProducts().catch(error => {
		console.error('Failed to load products:', error);
		galleryContainer.innerHTML = '<p class="error">Ошибка загрузки товаров</p>';
	});

	initializeApp().catch(error => {
		console.error('App initialization failed:', error);
	});

	// Кнопка корзины в хедере
	const basketButton = document.querySelector('.header__basket');
	if (basketButton) {
		basketButton.addEventListener('click', () => {
			openModal(basketModal);
		});
	}

	// Кнопки закрытия модальных окон
	const closeButtons = document.querySelectorAll('.modal__close, .order-success__close');
	closeButtons.forEach(button => {
		button.addEventListener('click', () => {
			const modal = button.closest('.modal');
			if (modal) {
				closeModal(modal as HTMLElement);
			}
		});
	});

	// Закрытие по клику на оверлей
	document.querySelectorAll('.modal').forEach(modal => {
		modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				closeModal(modal as HTMLElement);
			}
		});
	});

	// Обработчики для кнопок внутри корзины
	const deleteItemButtons = document.querySelectorAll('.basket__item-delete');
	deleteItemButtons.forEach(button => {
		button.addEventListener('click', (e) => {
			const item = (e.currentTarget as HTMLElement).closest('.basket__item');
			if (item) {
				const productId = item.getAttribute('data-id');
				if (productId) {
					basket.removeItem(productId);
				}
			}
		});
	});

	// Обработчик для модального окна оплаты
	paymentModal.addEventListener('click', (e) => {
		const target = e.target as HTMLElement;

		// Выбор способа оплаты
		const paymentButton = target.closest<HTMLButtonElement>('.button_alt');
		if (paymentButton) {
			e.preventDefault();
			order.selectPaymentMethod(paymentButton);
			return;
		}

		// Кнопка "Далее" с правильной проверкой
		const nextButton = target.closest<HTMLButtonElement>('.order__button');
		if (nextButton) {
			e.preventDefault();
			// Проверяем disabled через hasAttribute для максимальной совместимости
			if (!nextButton.hasAttribute('disabled') && order.validateAndProceed()) {
				closeModal(paymentModal);
				openModal(contactsModal);
			}
		}
	});

	// Обработчик для модального окна контактов
	contactsModal.addEventListener('click', (e) => {
		const target = e.target as HTMLElement;

		// Обработка кнопки "Оплатить"
		const payButton = target.closest<HTMLButtonElement>('.modal__actions .button');
		if (payButton) {
			e.preventDefault();

			// Принудительно показываем ошибки при отправке
			if (contacts.validateForm(true)) {
				closeModal(contactsModal);
				successModal.show();
				contacts.resetForm();
			}
		}
	});
});