import { Modal } from "./Modal";
import { EventEmitter } from "./base/events";
import { ensureElement, cloneTemplate } from "../utils/utils";
import { AppEvents } from "../utils/events";
import { IBasketState } from "../types";

export class CartModal extends Modal {
	private checkoutButton: HTMLButtonElement;

	constructor(eventEmitter: EventEmitter) {
		super(eventEmitter);

		eventEmitter.on(AppEvents.CART_UPDATED, (data: IBasketState) =>
			this.renderCart(data));
	}

	private renderCart(state: IBasketState): void {
		const template = ensureElement<HTMLTemplateElement>('#basket');
		const cart = cloneTemplate(template);

		const itemsList = ensureElement<HTMLElement>('.basket__list', cart);
		const totalPrice = ensureElement<HTMLElement>('.basket__price', cart);
		this.checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', cart);

		itemsList.innerHTML = '';
		totalPrice.textContent = `${state.total} синапсов`;

		this.checkoutButton.addEventListener('click', () => {
			this.eventEmitter.emit(AppEvents.UI_ORDER_BUTTON_START_CLICKED);
			this.close();
		});

		super.render(cart);
	}
}