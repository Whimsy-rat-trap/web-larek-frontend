import { AppStateModel } from '../models/AppStateModel';
import { OrderModalView } from '../views/OrderModalView';
import { AppEvents } from '../../types/events';
import { EventEmitter } from '../base/events';

export class OrderPresenter {
	constructor(
		private view: OrderModalView,
		private model: AppStateModel,
		private eventEmitter: EventEmitter,
	){
		eventEmitter.on(AppEvents.ORDER_INITIATED, () => this.view.renderOrderForm());
	}
}