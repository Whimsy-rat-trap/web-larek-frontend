import { ModalView } from "./ModalView";
import { ensureElement, cloneTemplate } from "../../utils/utils";
import { AppEvents } from "../../types/events";
import { IProduct } from "../../types";

/**
 * Модальное окно корзины
 * @class CartModalView
 * @extends ModalView
 * @property {HTMLButtonElement} checkoutButton - Кнопка оформления заказа
 * @property {Object} cartService - Сервис корзины
 * @property {Function} cartService.getCartItems - Получение товаров в корзине
 * @property {Function} cartService.getTotalPrice - Получение общей суммы
 */
export class CartModalView {
	private checkoutButton: HTMLButtonElement;

	/**
	 * Конструктор класса CartModal
	 * @constructor
	 * @param {EventEmitter} eventEmitter - Эмиттер событий
	 * @param {Object} cartService - Сервис корзины
	 * @param {Function} cartService.getCartItems - Получает товары в корзине
	 * @param {Function} cartService.getTotalPrice - Получает общую сумму
	 */
	constructor(private checkoutButtonClick: Function, private deleteButtonClick: Function, private cartService: {
		getCartItems: () => IProduct[];
		getTotalPrice: () => number;
	}) {
	}

	/**
	 * Рендерит содержимое корзины
	 * @private
	 * @emits AppEvents.UI_ORDER_BUTTON_START_CLICKED - При клике на оформление заказа
	 */
	renderCart(): HTMLElement {
		const template = ensureElement<HTMLTemplateElement>('#basket');
		const cartElement = cloneTemplate(template);
		const itemsList = ensureElement<HTMLElement>('.basket__list', cartElement);
		const totalPrice = ensureElement<HTMLElement>('.basket__price', cartElement);
		const checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', cartElement);

		itemsList.innerHTML = '';
		const items = this.cartService.getCartItems();
		totalPrice.textContent = `${this.cartService.getTotalPrice()} синапсов`;

		if (items.length === 0) {
			const emptyMessage = document.createElement('p');
			emptyMessage.className = 'basket__empty';
			emptyMessage.textContent = 'Пустая корзина';
			itemsList.appendChild(emptyMessage);
			checkoutButton.disabled = true;
		} else {
			items.forEach((item: IProduct, index: number) => {
				this.renderCartItem(item, index + 1, itemsList);
			});
			checkoutButton.disabled = false;
		}

		checkoutButton.addEventListener('click', () => {
			this.checkoutButtonClick();
		});

		return cartElement;
	}

	/**
	 * Рендерит отдельный элемент корзины
	 * @private
	 * @param {IProduct} item - Данные товара
	 * @param {number} index - Порядковый номер товара
	 * @param {HTMLElement} container - Контейнер для вставки элемента
	 * @emits AppEvents.MODAL_PRODUCT_BASKET_ITEM_REMOVED - При удалении товара из корзины
	 */
	private renderCartItem(item: IProduct, index: number, container: HTMLElement): void {
		const itemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
		const itemElement = cloneTemplate(itemTemplate);

		const title = ensureElement<HTMLElement>('.card__title', itemElement);
		const price = ensureElement<HTMLElement>('.card__price', itemElement);
		const indexElement = ensureElement<HTMLElement>('.basket__item-index', itemElement);
		const deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', itemElement);

		title.textContent = item.title;
		price.textContent = `${item.price} синапсов`;
		indexElement.textContent = index.toString();

		deleteButton.addEventListener('click', () => {
			this.deleteButtonClick();
		});

		container.appendChild(itemElement);
	}
}