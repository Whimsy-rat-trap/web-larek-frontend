import { ModalView } from "./ModalView";
import { ensureElement, cloneTemplate } from "../../utils/utils";
import { AppEvents } from "../../types/events";
import { IProduct } from "../../types";
import { CartItemView } from "./CartItemView";

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
				const cartItemView = new CartItemView(item, index + 1, () => this.deleteButtonClick(item));
				itemsList.appendChild(cartItemView.element);
			});
			checkoutButton.disabled = false;
		}

		checkoutButton.addEventListener('click', () => {
			this.checkoutButtonClick();
		});

		return cartElement;
	}
}