import { ensureElement, cloneTemplate } from "../../utils/utils";
import { AppEvents } from "../../types/events";
import { settings } from '../../utils/constants';

export class ContactsModalView {
	private submitButton: HTMLButtonElement;
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;
	private errorContainer: HTMLElement;
	// private emailEntered = false;
	// private phoneEntered = false;

	constructor(
		private contactsEmailSet: Function,
		private contactsPhoneSet: Function,
		private contactsInputPhoneChanged: Function,
		private contactsButtonClicked: Function
	) {}

	renderContactsForm(): HTMLElement {
		const template = ensureElement<HTMLTemplateElement>('#contacts');
		const form = cloneTemplate(template);

		this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', form);
		this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', form);
		this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', form);
		this.errorContainer = ensureElement<HTMLElement>('.form__errors', form);

		// Делаем кнопку сразу активной
		this.submitButton.disabled = false;

		// Обработчики событий (оставляем только эмиты событий без валидации)
		this.emailInput.addEventListener('input', () => {
			const email = this.emailInput.value.trim();
			// this.emailEntered = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
			this.contactsEmailSet(email);
			// this.updateValidationState();
		});

		this.phoneInput.addEventListener('input', () => {
			let value = this.phoneInput.value;
			// Оставляем только цифры и +
			value = value.replace(/[^0-9+]/g, '');

			// Обеспечиваем, чтобы + был только в начале
			if (value.includes('+')) {
				value = '+' + value.replace(/\+/g, '');
			}

			// Ограничиваем длину
			if (value.length > 12) {
				value = value.substring(0, 12);
			}

			this.phoneInput.value = value;
			// this.phoneEntered = /^\+[0-9]{11}$/.test(value);
			this.contactsInputPhoneChanged(value);
			this.contactsPhoneSet(value);
			// this.updateValidationState();
		});

		form.addEventListener('submit', (event) => {
			event.preventDefault();
			// if (this.isFormValid()) {
			this.contactsButtonClicked();
			// }
		});

		return form;
	}

	/*
	private updateValidationState(): void {
		this.errorContainer.innerHTML = '';

		if (this.emailEntered && !this.phoneEntered) {
			this.showError('phone', 'Необходимо ввести телефон');
		} else if (this.phoneEntered && !this.emailEntered) {
			this.showError('email', 'Необходимо ввести email');
		} else if (!this.emailEntered && !this.phoneEntered) {
			this.errorContainer.innerHTML = '';
		}

		this.submitButton.disabled = !this.isFormValid();
	}

	private isFormValid(): boolean {
		return this.emailEntered && this.phoneEntered;
	}

	private showError(field: string, message: string): void {
		this.errorContainer.innerHTML = '';
		const errorElement = document.createElement('div');
		errorElement.className = `form__error`;
		errorElement.textContent = message;
		this.errorContainer.appendChild(errorElement);
	}
	*/
}