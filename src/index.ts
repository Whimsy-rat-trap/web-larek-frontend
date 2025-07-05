import './scss/styles.scss';
import { ensureElement, cloneTemplate } from './utils/utils';
import { ICardActions, Product } from './types';
import { CardList } from './components/CardList';
import { Api } from './components/base/api';
import { AppData } from './components/AppData';
import { API_URL } from './utils/constants';
import { Card } from './components/Card';
import { Basket } from './components/Basket';

// Получаем DOM-элементы
const productModal = ensureElement<HTMLElement>('#product-modal');
const basketModal = ensureElement<HTMLElement>('#basket-modal');
const paymentModal = ensureElement<HTMLElement>('#payment-modal');
const contactsModal = ensureElement<HTMLElement>('#contacts-modal');
const successModal = ensureElement<HTMLElement>('#success-modal');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

// Инициализация API и данных приложения
const api = new Api(API_URL);
const appData = new AppData(api);
const basket = new Basket();

// Функции для управления модальными окнами
function toggleBodyScroll(enable: boolean) {
	document.body.classList.toggle('_modal-open', !enable);
}

function openModal(modal: HTMLElement) {
	modal.classList.add('modal_active');
	toggleBodyScroll(false);
	// Прокручиваем к началу модального окна
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

		// Находим товар в каталоге
		const product = appData.catalog.find(item => item.id === cardId);
		if (!product) return;

		// Клонируем шаблон для модального окна
		const modalContent = productModal.querySelector('.modal__content');
		if (!modalContent) return;

		// Создаем карточку для превью
		const previewCard = new Card(cardPreviewTemplate);
		previewCard.render(product);
		modalContent.innerHTML = '';
		modalContent.appendChild(previewCard.render(product));

		// Добавляем обработчик для кнопки "В корзину"
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

// Обработчики для всех модальных окон
document.addEventListener('DOMContentLoaded', () => {
	// Кнопка корзины в хедере
	const basketButton = document.querySelector('.header__basket');
	if (basketButton) {
		basketButton.addEventListener('click', () => {
			openModal(basketModal);
		});
	}

	// Находим все кнопки закрытия модальных окон
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

	// Оформление заказа в корзине
	const checkoutButton = document.querySelector('#basket-modal .button');
	if (checkoutButton) {
		checkoutButton.addEventListener('click', () => {
			closeModal(basketModal);
			openModal(paymentModal);
		});
	}

	// Выбор способа оплаты
	const paymentButtons = document.querySelectorAll('#payment-modal .button_alt');
	paymentButtons.forEach(button => {
		button.addEventListener('click', () => {
			paymentButtons.forEach(btn => btn.classList.remove('button_active'));
			button.classList.add('button_active');
		});
	});

	// Переход от оплаты к контактам
	const nextButton = document.querySelector('#payment-modal .modal__actions .button');
	if (nextButton) {
		nextButton.addEventListener('click', (e) => {
			e.preventDefault();
			closeModal(paymentModal);
			openModal(contactsModal);
		});
	}

	// Кнопка оплаты в контактах
	const payButton = document.querySelector('#contacts-modal .modal__actions .button');
	if (payButton) {
		payButton.addEventListener('click', (e) => {
			e.preventDefault();
			closeModal(contactsModal);
			openModal(successModal);
		});
	}
});