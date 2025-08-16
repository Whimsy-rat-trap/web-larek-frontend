// ContactsPresenter.ts
import { AppStateModel } from '../models/AppStateModel';
import { ContactsModalView } from '../views/ContactsModalView';
import { AppEvents } from '../../types/events';
import { EventEmitter } from '../base/events';

export class ContactsPresenter {
	private isEmailValid = false;
	private isPhoneValid = false;

	constructor(
		private view: ContactsModalView,
		private model: AppStateModel,
		private eventEmitter: EventEmitter,
	) {
		this.setupEventListeners();
	}

	private setupEventListeners(): void {
		// Handle validation events
		this.eventEmitter.on(AppEvents.ORDER_EMAIL_VALID, () => {
			this.isEmailValid = true;
			this.updateSubmitButton();
		});

		this.eventEmitter.on(AppEvents.ORDER_EMAIL_VALIDATION_ERROR, () => {
			this.isEmailValid = false;
			this.updateSubmitButton();
		});

		this.eventEmitter.on(AppEvents.ORDER_PHONE_VALID, () => {
			this.isPhoneValid = true;
			this.updateSubmitButton();
		});

		this.eventEmitter.on(AppEvents.ORDER_PHONE_VALIDATION_ERROR, () => {
			this.isPhoneValid = false;
			this.updateSubmitButton();
		});

		// Handle pay button click
		this.eventEmitter.on(AppEvents.UI_ORDER_BUTTON_PAY_CLICKED, () => {
			if (this.isFormValid()) {
				this.eventEmitter.emit(AppEvents.MODAL_OPENED, { type: 'success' });
			}
		});
	}

	private isFormValid(): boolean {
		return this.isEmailValid && this.isPhoneValid;
	}

	private updateSubmitButton(): void {
		this.view.setSubmitButtonEnabled(this.isFormValid());
	}
}