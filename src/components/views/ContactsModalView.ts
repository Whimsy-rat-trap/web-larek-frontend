// ContactsModalView.ts
import { ensureElement, cloneTemplate } from "../../utils/utils";
import { AppEvents } from "../../types/events";
import { settings } from '../../utils/constants';

export class ContactsModalView {
	private submitButton: HTMLButtonElement;
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;
	private errorContainer: HTMLElement;

	constructor(
		private contactsEmailSet: Function,
		private contactsInputPhoneChanged: Function,
		private contactsPhoneSet: Function,
		private contactsButtonClicked: Function
	) {}

	renderContactsForm(): HTMLElement {
		const template = ensureElement<HTMLTemplateElement>('#contacts');
		const form = cloneTemplate(template);

		this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', form);
		this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', form);
		this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', form);
		this.errorContainer = ensureElement<HTMLElement>('.form__errors', form);

		// Initially disable the submit button
		this.submitButton.disabled = true;

		// Email input handler
		this.emailInput.addEventListener('input', () => {
			const email = this.emailInput.value.trim();
			this.contactsEmailSet(email);
		});

		// Phone input handler
		this.phoneInput.addEventListener('input', () => {
			let value = this.phoneInput.value;
			// Clean the input - only digits and +
			value = value.replace(/[^0-9+]/g, '');

			// Ensure + is only at the start
			if (value.includes('+')) {
				value = '+' + value.replace(/\+/g, '');
			}

			// Limit length
			if (value.length > 12) {
				value = value.substring(0, 12);
			}

			this.phoneInput.value = value;
			this.contactsInputPhoneChanged(value);
			this.contactsPhoneSet(value);
		});

		form.addEventListener('submit', (event) => {
			event.preventDefault();
			this.contactsButtonClicked();
		});

		return form;
	}

	// New method to enable/disable submit button
	setSubmitButtonEnabled(enabled: boolean): void {
		this.submitButton.disabled = !enabled;
	}

	// Method to show validation errors
	showError(message: string): void {
		this.errorContainer.innerHTML = '';
		const errorElement = document.createElement('div');
		errorElement.className = 'form__error';
		errorElement.textContent = message;
		this.errorContainer.appendChild(errorElement);
	}

	// Method to clear errors
	clearErrors(): void {
		this.errorContainer.innerHTML = '';
	}
}