import { CartModalView } from '../views/CartModalView';
import { AppStateModel } from '../models/AppStateModel';

export class BasketPresenter {
	constructor(
		private view: CartModalView,
		private model: AppStateModel,
		){
	}
}