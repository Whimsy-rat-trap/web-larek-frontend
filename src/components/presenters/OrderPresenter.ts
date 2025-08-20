import { AppStateModel } from '../models/AppStateModel';
import { OrderView } from '../views/OrderView';
import { AppEvents } from '../../types/events';
import { EventEmitter } from '../base/events';

export class OrderPresenter {
	constructor(
		private view: OrderView,
		private model: AppStateModel,
		private eventEmitter: EventEmitter
	) {
		this.view.render(
			this.model.state.order.payment,
			this.model.state.order.address,
			this.model.state.order.errors.filter(
				(error) => error.field === 'payment' || error.field === 'address'
			)
		);

		this.eventEmitter.on(AppEvents.ORDER_INITIATED, () =>
			this.view.render(
				this.model.state.order.payment,
				this.model.state.order.address,
				this.model.state.order.errors.filter(
					(error) => error.field === 'payment' || error.field === 'address'
				)
			)
		);
		this.eventEmitter.on(AppEvents.ORDER_VALIDATION_ERROR, () => {
			this.view.showErrors(
				this.model.state.order.errors.filter(
					(error) => error.field === 'payment' || error.field === 'address'
				)
			);
		});
	}
}
