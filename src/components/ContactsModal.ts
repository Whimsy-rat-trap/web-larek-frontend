import { Modal } from "./Modal";
import { EventEmitter } from "./base/events";
import { ensureElement, cloneTemplate } from "../utils/utils";
import { AppEvents } from "../utils/events";

export class ContactsModal extends Modal {
	constructor(eventEmitter: EventEmitter) {
		super(eventEmitter);

		eventEmitter.on(AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED, () =>
			this.renderContactsForm());
	}

	private renderContactsForm(): void {
		const template = ensureElement<HTMLTemplateElement>('#contacts');
		const form = cloneTemplate(template);

		const emailInput = ensureElement<HTMLInputElement>('input[name="email"]', form);
		const phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', form);
		const submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', form);

		emailInput.addEventListener('input', () => {
			this.eventEmitter.emit(AppEvents.UI_ORDER_INPUT_MAIL_CHANGED, {
				value: emailInput.value
			});
		});

		phoneInput.addEventListener('input', () => {
			this.eventEmitter.emit(AppEvents.UI_ORDER_INPUT_PHONE_CHANGED, {
				value: phoneInput.value
			});
		});

		form.addEventListener('submit', (event) => {
			event.preventDefault();
			this.eventEmitter.emit(AppEvents.UI_ORDER_BUTTON_PAYMENT_CLICKED);
		});

		super.render(form);
	}
}