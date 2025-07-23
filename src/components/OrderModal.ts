import { Modal } from "./Modal";
import { EventEmitter } from "./base/events";
import { ensureElement, cloneTemplate } from "../utils/utils";
import { AppEvents } from "../utils/events";
import { PaymentMethod } from "../types";

export class OrderModal extends Modal {
	private nextButton: HTMLButtonElement;

	constructor(eventEmitter: EventEmitter) {
		super(eventEmitter);

		eventEmitter.on(AppEvents.ORDER_INITIATED, () => this.renderOrderForm());
	}

	private renderOrderForm(): void {
		const template = ensureElement<HTMLTemplateElement>('#order');
		const form = cloneTemplate(template);

		const addressInput = ensureElement<HTMLInputElement>('input[name="address"]', form);
		const onlinePaymentButton = ensureElement<HTMLButtonElement>('button[name="card"]', form);
		const cashPaymentButton = ensureElement<HTMLButtonElement>('button[name="cash"]', form);
		this.nextButton = ensureElement<HTMLButtonElement>('.order__button', form);

		addressInput.addEventListener('input', () => {
			this.eventEmitter.emit(AppEvents.UI_ORDER_INPUT_DELIVERY_CHANGED, {
				value: addressInput.value
			});
		});

		onlinePaymentButton.addEventListener('click', () => {
			this.selectPayment('online', onlinePaymentButton, cashPaymentButton);
		});

		cashPaymentButton.addEventListener('click', () => {
			this.selectPayment('cash', onlinePaymentButton, cashPaymentButton);
		});

		this.nextButton.addEventListener('click', (event) => {
			event.preventDefault();
			this.eventEmitter.emit(AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED);
		});

		super.render(form);
	}

	private selectPayment(
		method: PaymentMethod,
		onlineButton: HTMLButtonElement,
		cashButton: HTMLButtonElement
	): void {
		onlineButton.classList.toggle('button_alt-active', method === 'online');
		cashButton.classList.toggle('button_alt-active', method === 'cash');
		this.eventEmitter.emit(AppEvents.UI_ORDER_SELECT_PAYMENT_CHANGED, { value: method });
	}
}