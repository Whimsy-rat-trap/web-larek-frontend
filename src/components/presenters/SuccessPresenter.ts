import { AppStateModel } from '../models/AppStateModel';
import { SuccessModalView } from '../views/SuccessModalView';

export class SuccessPresenter {
	constructor(
		private view: SuccessModalView,
		private model: AppStateModel,
	){
	}
}