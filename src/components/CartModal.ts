import { Modal } from "./Modal";
import { EventEmitter } from "./base/events";
import { ensureElement, cloneTemplate } from "../utils/utils";
import { AppEvents } from "../types/events";
import { ICart, ICartItem } from '../types';

export class CartModal extends Modal {
	private checkoutButton: HTMLButtonElement;
	private itemsList: HTMLElement;
	private totalPrice: HTMLElement;

	constructor(eventEmitter: EventEmitter, private cartService: any) {
		super(eventEmitter);

		eventEmitter.on(AppEvents.MODAL_OPENED, (data: { type: string }) => {
			if (data.type === 'cart') {
				this.renderCart(this.cartService.getCart());
			}
		});

		eventEmitter.on(AppEvents.CART_UPDATED, (cart: ICart) =>
			this.renderCart(cart));
	}

	private renderCart(cart: ICart): void {
		const template = ensureElement<HTMLTemplateElement>('#basket');
		const cartElement = cloneTemplate(template);

		this.itemsList = ensureElement<HTMLElement>('.basket__list', cartElement);
		this.totalPrice = ensureElement<HTMLElement>('.basket__price', cartElement);
		this.checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', cartElement);

		this.itemsList.innerHTML = '';
		this.totalPrice.textContent = `${cart.total} синапсов`;

		if (cart.items.length === 0) {
			const emptyMessage = document.createElement('p');
			emptyMessage.className = 'basket__empty';
			emptyMessage.textContent = 'Пустая корзина';
			this.itemsList.appendChild(emptyMessage);
			this.checkoutButton.disabled = true;
		} else {
			cart.items.forEach((item, index) => {
				this.renderCartItem(item, index + 1);
			});
			this.checkoutButton.disabled = false;
		}

		this.checkoutButton.addEventListener('click', () => {
			this.eventEmitter.emit(AppEvents.UI_ORDER_BUTTON_START_CLICKED);
			this.close();
		});

		super.render(cartElement);
	}

	private renderCartItem(item: ICartItem, index: number): void {
		const itemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
		const itemElement = cloneTemplate(itemTemplate);

		const title = itemElement.querySelector('.card__title') as HTMLElement;
		const price = itemElement.querySelector('.card__price') as HTMLElement;
		const indexElement = itemElement.querySelector('.basket__item-index') as HTMLElement;
		const deleteButton = itemElement.querySelector('.basket__item-delete') as HTMLButtonElement;

		title.textContent = item.title;
		price.textContent = `${item.price} синапсов`;
		indexElement.textContent = index.toString();

		deleteButton.addEventListener('click', () => {
			this.eventEmitter.emit(AppEvents.MODAL_CART_ITEM_REMOVED, { id: item.id });
		});

		this.itemsList.appendChild(itemElement);
	}
}