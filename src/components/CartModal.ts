import { Modal } from "./Modal";
import { EventEmitter } from "./base/events";
import { ensureElement, cloneTemplate } from "../utils/utils";
import { AppEvents } from "../types/events";
import { IBasketState, IProduct } from "../types";

export class CartModal extends Modal {
	private checkoutButton: HTMLButtonElement;
	private itemsList: HTMLElement;
	private totalPrice: HTMLElement;
	private cartService: any;

	constructor(eventEmitter: EventEmitter, cartService: any) {
		super(eventEmitter);
		this.cartService = cartService;

		eventEmitter.on(AppEvents.MODAL_OPENED, (data: { type: string }) => {
			if (data.type === 'cart') {
				this.renderCart(cartService.getState());
			}
		});

		eventEmitter.on(AppEvents.CART_UPDATED, (data: IBasketState) =>
			this.renderCart(data));
	}

	private renderCart(state: IBasketState): void {
		const template = ensureElement<HTMLTemplateElement>('#basket');
		const cart = cloneTemplate(template);

		this.itemsList = ensureElement<HTMLElement>('.basket__list', cart);
		this.totalPrice = ensureElement<HTMLElement>('.basket__price', cart);
		this.checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', cart);

		this.itemsList.innerHTML = '';
		this.totalPrice.textContent = `${state.total} синапсов`;

		if (state.items.length === 0) {
			const emptyMessage = document.createElement('p');
			emptyMessage.className = 'basket__empty';
			emptyMessage.textContent = 'Пустая корзина';
			this.itemsList.appendChild(emptyMessage);
			this.checkoutButton.disabled = true;
		} else {
			state.items.forEach((id, index) => {
				const product = this.cartService.getProductById(id);
				if (product) {
					this.renderCartItem(product, index + 1);
				}
			});
			this.checkoutButton.disabled = false;
		}

		this.checkoutButton.addEventListener('click', () => {
			this.eventEmitter.emit(AppEvents.UI_ORDER_BUTTON_START_CLICKED);
			this.close();
		});

		super.render(cart);
	}

	private renderCartItem(product: IProduct, index: number): void {
		const itemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
		const item = cloneTemplate(itemTemplate);

		const title = item.querySelector('.card__title') as HTMLElement;
		const price = item.querySelector('.card__price') as HTMLElement;
		const indexElement = item.querySelector('.basket__item-index') as HTMLElement;
		const deleteButton = item.querySelector('.basket__item-delete') as HTMLButtonElement;

		title.textContent = product.title;
		price.textContent = `${product.price} синапсов`;
		indexElement.textContent = index.toString();

		deleteButton.addEventListener('click', () => {
			this.eventEmitter.emit(AppEvents.MODAL_CART_ITEM_REMOVED, { id: product.id });
		});

		this.itemsList.appendChild(item);
	}
}