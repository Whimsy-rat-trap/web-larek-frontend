import { Modal } from "./Modal";
import { EventEmitter } from "./base/events";
import { ensureElement, cloneTemplate } from "../utils/utils";
import { AppEvents } from "../types/events";
import { IProduct } from "../types";

export class CartModal extends Modal {
	private checkoutButton: HTMLButtonElement;

	constructor(eventEmitter: EventEmitter, private cartService: {
		getCartItems: () => IProduct[];
		getTotalPrice: () => number;
	}) {
		super(eventEmitter);

		eventEmitter.on(AppEvents.MODAL_OPENED, (data: { type: string }) => {
			if (data.type === 'cart') this.renderCart();
		});

		eventEmitter.on(AppEvents.CART_UPDATED, () => this.renderCart());
	}

	private renderCart(): void {
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
			this.eventEmitter.emit(AppEvents.UI_ORDER_BUTTON_START_CLICKED);
		});

		super.render(cartElement);
	}

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
			this.eventEmitter.emit(AppEvents.MODAL_CART_ITEM_REMOVED, { id: item.id });
		});

		container.appendChild(itemElement);
	}
}