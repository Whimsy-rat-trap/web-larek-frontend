import { Modal } from "./Modal";
import { EventEmitter } from "./base/events";
import { ensureElement, cloneTemplate } from "../utils/utils";
import { AppEvents } from "../utils/events";
import { IOrderResponse } from "../types";

export class SuccessModal extends Modal {
	constructor(eventEmitter: EventEmitter) {
		super(eventEmitter);

		eventEmitter.on(AppEvents.ORDER_SUBMITTED, (data: IOrderResponse) =>
			this.renderSuccess(data));
	}

	private renderSuccess(order: IOrderResponse): void {
		const template = ensureElement<HTMLTemplateElement>('#success');
		const success = cloneTemplate(template);

		const description = ensureElement<HTMLElement>('.order-success__description', success);
		const closeButton = ensureElement<HTMLButtonElement>('.order-success__close', success);

		description.textContent = `Списано ${order.total} синапсов`;

		closeButton.addEventListener('click', () => {
			this.close();
			this.eventEmitter.emit(AppEvents.PAGE_MAIN_LOADED);
		});

		super.render(success);
	}
}