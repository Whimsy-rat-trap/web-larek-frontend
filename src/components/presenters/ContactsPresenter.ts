// ContactsPresenter.ts
import { AppStateModel } from '../models/AppStateModel';
import { ContactsView } from '../views/ContactsView';
import { AppEvents } from '../../types/events';
import { EventEmitter } from '../base/events';

export class ContactsPresenter {
	constructor(
		private view: ContactsView,
		private model: AppStateModel,
		private eventEmitter: EventEmitter,
	) {
		this.view.render(
			this.model.state.order.email,
			this.model.state.order.phone,
			this.model.state.order.errors.filter(
				(error) => error.field === 'email' || error.field === 'phone'
			)
		);
		this.setupEventListeners();
	}

	private setupEventListeners(): void {
		this.eventEmitter.on(AppEvents.ORDER_INITIATED, () =>
			this.view.render(
				this.model.state.order.payment,
				this.model.state.order.address,
				this.model.state.order.errors.filter(
					(error) => error.field === 'email' || error.field === 'phone'
				)
			)
		);
		this.eventEmitter.on(AppEvents.ORDER_VALIDATION_ERROR, () => {
			this.view.showErrors(
				this.model.state.order.errors.filter(
					(error) => error.field === 'email' || error.field === 'phone'
				)
			);
		});
	}
}