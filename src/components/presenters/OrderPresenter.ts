import { AppStateModel } from '../models/AppStateModel';
import { OrderModalView } from '../views/OrderModalView';

export class OrderPresenter {
	constructor(
		private view: OrderModalView,
		private model: AppStateModel,
	){
	}
}