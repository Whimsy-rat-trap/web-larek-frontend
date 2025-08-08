import { AppStateModel } from '../models/AppStateModel';
import { ProductModalView } from '../views/ProductModalView';

export class ProductPresenter {
	constructor(
		private view: ProductModalView,
		private model: AppStateModel,
	){
	}
}