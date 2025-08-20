import { ensureElement, cloneTemplate } from '../../utils/utils';
import { IValidationError } from '../../types';

export class ContactsView {
	private submitButton: HTMLButtonElement;
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;
	private errorContainer: HTMLElement;

	constructor(
		private container: HTMLElement,
		private contactsEmailSet: (email: string) => void,
		private contactsInputPhoneChanged: (phone: string) => void,
		private contactsPhoneSet: (phone: string) => void,
		private contactsButtonClicked: () => void
	) {}

	render(
		email: string,
		phone: string,
		errors: IValidationError[]
	): HTMLElement {
		const template = ensureElement<HTMLTemplateElement>('#contacts');
		const form = cloneTemplate(template);

		this.emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			form
		);
		this.phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			form
		);
		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			form
		);
		this.errorContainer = ensureElement<HTMLElement>('.form__errors', form);

		this.emailInput.value = email;
		this.phoneInput.value = phone;
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

		this.showErrors(errors);
		this.setSubmitButtonEnabled(errors.length === 0);

		this.container.replaceChildren(form);

		return form;
	}

	// New method to enable/disable submit button
	setSubmitButtonEnabled(enabled: boolean): void {
		this.submitButton.disabled = !enabled;
	}

	// Method to show validation errors
	showErrors(errors: IValidationError[]): void {
		this.errorContainer.innerHTML = '';
		errors.forEach((error) => {
			const errorElement = document.createElement('div');
			errorElement.className = `form__error`;
			errorElement.textContent = error.message;
			this.errorContainer.appendChild(errorElement);
		});
		this.setSubmitButtonEnabled(errors.length === 0);
	}
}