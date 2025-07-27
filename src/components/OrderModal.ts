import { Modal } from "./Modal";
import { EventEmitter } from "./base/events";
import { ensureElement, cloneTemplate } from "../utils/utils";
import { AppEvents } from "../types/events";
import { PaymentMethod } from "../types";

export class OrderModal extends Modal {
	private nextButton: HTMLButtonElement;
	private addressInput: HTMLInputElement;
	private errorContainer: HTMLElement;
	private onlinePaymentButton: HTMLButtonElement;
	private cashPaymentButton: HTMLButtonElement;
	private paymentSelected: PaymentMethod | null = null;
	private addressEntered = false;

	constructor(eventEmitter: EventEmitter) {
		super(eventEmitter);
		eventEmitter.on(AppEvents.ORDER_INITIATED, () => this.renderOrderForm());
	}

	private renderOrderForm(): void {
		const template = ensureElement<HTMLTemplateElement>('#order');
		const form = cloneTemplate(template);

		this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', form);
		this.onlinePaymentButton = ensureElement<HTMLButtonElement>('button[name="card"]', form);
		this.cashPaymentButton = ensureElement<HTMLButtonElement>('button[name="cash"]', form);
		this.nextButton = ensureElement<HTMLButtonElement>('.order__button', form);
		this.errorContainer = ensureElement<HTMLElement>('.form__errors', form);

		// Обработчики событий
		this.addressInput.addEventListener('input', () => {
			this.addressEntered = this.addressInput.value.trim().length > 0;
			this.updateValidationState();
		});

		this.onlinePaymentButton.addEventListener('click', () => {
			this.paymentSelected = 'online';
			this.onlinePaymentButton.classList.add('button_alt-active');
			this.cashPaymentButton.classList.remove('button_alt-active');
			this.updateValidationState();
		});

		this.cashPaymentButton.addEventListener('click', () => {
			this.paymentSelected = 'cash';
			this.cashPaymentButton.classList.add('button_alt-active');
			this.onlinePaymentButton.classList.remove('button_alt-active');
			this.updateValidationState();
		});

		this.nextButton.addEventListener('click', (event) => {
			event.preventDefault();
			if (this.isFormValid()) {
				this.eventEmitter.emit(AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED);
			}
		});

		super.render(form);
	}

	private updateValidationState(): void {
		this.errorContainer.innerHTML = '';

		if (this.paymentSelected && !this.addressEntered) {
			this.showError('address', 'Необходимо ввести адрес');
		} else if (this.addressEntered && !this.paymentSelected) {
			this.showError('payment', 'Необходимо выбрать способ оплаты');
		} else if (!this.paymentSelected && !this.addressEntered) {
			// Не показываем ошибки если ничего не выбрано/не введено
			this.errorContainer.innerHTML = '';
		}

		this.nextButton.disabled = !this.isFormValid();
	}

	private isFormValid(): boolean {
		return !!this.paymentSelected && this.addressEntered;
	}

	private showError(field: string, message: string): void {
		this.errorContainer.innerHTML = ''; // Очищаем предыдущие ошибки
		const errorElement = document.createElement('div');
		errorElement.className = `form__error`;
		errorElement.textContent = message;
		this.errorContainer.appendChild(errorElement);
	}
}