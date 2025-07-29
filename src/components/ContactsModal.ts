import { Modal } from "./Modal";
import { EventEmitter } from "./base/events";
import { ensureElement, cloneTemplate } from "../utils/utils";
import { AppEvents } from "../types/events";

export class ContactsModal extends Modal {
	private submitButton: HTMLButtonElement;
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;
	private errorContainer: HTMLElement;
	private emailEntered = false;
	private phoneEntered = false;

	constructor(eventEmitter: EventEmitter) {
		super(eventEmitter);
		eventEmitter.on(AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED, () => this.renderContactsForm());
	}

	private renderContactsForm(): void {
		const template = ensureElement<HTMLTemplateElement>('#contacts');
		const form = cloneTemplate(template);

		this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', form);
		this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', form);
		this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', form);
		this.errorContainer = ensureElement<HTMLElement>('.form__errors', form);

		// Обработчики событий
		this.emailInput.addEventListener('input', () => {
			this.emailEntered = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.emailInput.value.trim());
			this.eventEmitter.emit(AppEvents.UI_ORDER_INPUT_MAIL_CHANGED, {
				value: this.emailInput.value
			});
			this.updateValidationState();
		});

		this.phoneInput.addEventListener('input', () => {
			this.phoneEntered = /^\+?\d[\d\s\-\(\)]{6,}\d$/.test(this.phoneInput.value.trim());
			this.eventEmitter.emit(AppEvents.UI_ORDER_INPUT_PHONE_CHANGED, {
				value: this.phoneInput.value
			});
			this.updateValidationState();
		});

		form.addEventListener('submit', (event) => {
			event.preventDefault();
			if (this.isFormValid()) {
				// Только открываем модальное окно успеха
				// Очистка корзины произойдет внутри SuccessModal
				this.eventEmitter.emit(AppEvents.MODAL_OPENED, { type: 'success' });

				// Позже, при подключении бэкенда, здесь будет:
				// this.eventEmitter.emit(AppEvents.ORDER_SUBMITTED);
			}
		});

		super.render(form);
	}

	private updateValidationState(): void {
		this.errorContainer.innerHTML = '';

		if (this.emailEntered && !this.phoneEntered) {
			this.showError('phone', 'Необходимо ввести телефон');
		} else if (this.phoneEntered && !this.emailEntered) {
			this.showError('email', 'Необходимо ввести email');
		} else if (!this.emailEntered && !this.phoneEntered) {
			// Не показываем ошибки если ничего не введено
			this.errorContainer.innerHTML = '';
		}

		this.submitButton.disabled = !this.isFormValid();
	}

	private isFormValid(): boolean {
		return this.emailEntered && this.phoneEntered;
	}

	private showError(field: string, message: string): void {
		this.errorContainer.innerHTML = ''; // Очищаем предыдущие ошибки
		const errorElement = document.createElement('div');
		errorElement.className = `form__error`;
		errorElement.textContent = message;
		this.errorContainer.appendChild(errorElement);
	}
}