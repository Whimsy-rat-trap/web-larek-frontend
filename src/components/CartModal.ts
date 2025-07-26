import { Modal } from "./Modal";
import { EventEmitter } from "./base/events";
import { ensureElement, cloneTemplate } from "../utils/utils";
import { AppEvents } from "../types/events";
import { IBasketState } from "../types";

/**
 * Модальное окно корзины
 * @class CartModal
 * @extends Modal
 */
export class CartModal extends Modal {
	private checkoutButton: HTMLButtonElement;
	private emptyMessage: HTMLElement;
	private itemsList: HTMLElement;
	private totalPrice: HTMLElement;

	constructor(eventEmitter: EventEmitter) {
		super(eventEmitter);

		// Подписываемся на событие открытия корзины
		eventEmitter.on(AppEvents.MODAL_OPENED, (data: { type: string }) => {
			if (data.type === 'cart') {
				this.renderEmptyCart();
			}
		});

		eventEmitter.on(AppEvents.CART_UPDATED, (data: IBasketState) =>
			this.renderCart(data));
	}

	/**
	 * Рендерит содержимое корзины
	 * @private
	 * @param {IBasketState} state - Текущее состояние корзины
	 */
	private renderCart(state: IBasketState): void {
		const template = ensureElement<HTMLTemplateElement>('#basket');
		const cart = cloneTemplate(template);

		this.itemsList = ensureElement<HTMLElement>('.basket__list', cart);
		this.totalPrice = ensureElement<HTMLElement>('.basket__price', cart);
		this.emptyMessage = ensureElement<HTMLElement>('.basket__empty', cart);
		this.checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', cart);

		// Обновляем содержимое корзины
		this.updateCartContent(state);

		this.checkoutButton.addEventListener('click', () => {
			this.eventEmitter.emit(AppEvents.UI_ORDER_BUTTON_START_CLICKED);
			this.close();
		});

		super.render(cart);
	}

	/**
	 * Рендерит пустую корзину
	 * @private
	 */
	private renderEmptyCart(): void {
		const template = ensureElement<HTMLTemplateElement>('#basket');
		const cart = cloneTemplate(template);

		this.itemsList = ensureElement<HTMLElement>('.basket__list', cart);
		this.totalPrice = ensureElement<HTMLElement>('.basket__price', cart);
		this.checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', cart);

		// Создаем сообщение о пустой корзине
		const emptyMessage = document.createElement('p');
		emptyMessage.className = 'basket__empty';
		emptyMessage.textContent = 'Пустая корзина';

		// Очищаем список и добавляем сообщение
		this.itemsList.innerHTML = '';
		this.itemsList.appendChild(emptyMessage);

		// Обновляем общую сумму
		this.totalPrice.textContent = '0 синапсов';

		// Делаем кнопку неактивной, если корзина пуста
		this.checkoutButton.disabled = true;

		super.render(cart);
	}

	/**
	 * Обновляет содержимое корзины
	 * @private
	 * @param {IBasketState} state - Текущее состояние корзины
	 */
	private updateCartContent(state: IBasketState): void {
		this.itemsList.innerHTML = '';
		this.totalPrice.textContent = `${state.total} синапсов`;

		if (state.items.length === 0) {
			const emptyMessage = document.createElement('p');
			emptyMessage.className = 'basket__empty';
			emptyMessage.textContent = 'Пустая корзина';
			this.itemsList.appendChild(emptyMessage);
			this.checkoutButton.disabled = true;
		} else {
			this.checkoutButton.disabled = false;
		}
	}
}