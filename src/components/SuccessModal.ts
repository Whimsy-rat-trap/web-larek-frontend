import { Modal } from "./Modal";
import { EventEmitter } from "./base/events";
import { ensureElement, cloneTemplate } from "../utils/utils";
import { AppEvents } from "../types/events";
import { IOrderResponse } from "../types";

/**
 * Модальное окно успешного оформления заказа
 * @class SuccessModal
 * @extends Modal
 */
export class SuccessModal extends Modal {
	constructor(
		protected eventEmitter: EventEmitter,
		private cartService: {
			getTotalPrice: () => number;
			clearCart: () => void;
		}
	) {
		super(eventEmitter);

		eventEmitter.on(AppEvents.MODAL_OPENED, (data: { type: string }) => {
			if (data.type === 'success') {
				this.renderSuccess();
			}
		});
	}

	/**
	 * Рендерит сообщение об успешном заказе
	 * @private
	 * @param {IOrderResponse} order - Данные заказа
	 */
	private renderSuccess(): void {
		const template = ensureElement<HTMLTemplateElement>('#success');
		const success = cloneTemplate(template);

		const description = ensureElement<HTMLElement>('.order-success__description', success);
		const closeButton = ensureElement<HTMLButtonElement>('.order-success__close', success);

		// Получаем сумму перед очисткой корзины
		const total = this.cartService.getTotalPrice();
		description.textContent = `Списано ${total} синапсов`;

		// Очищаем корзину после отображения суммы
		this.cartService.clearCart();

		closeButton.addEventListener('click', () => {
			this.close();
		});

		this.render(success);
	}
}