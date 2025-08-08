import { AppStateModel } from '../models/AppStateModel';
import { ModalView } from '../views/ModalView';

export class ModalPresenter {
	constructor(
		private view: ModalView,
		private model: AppStateModel,
	){
	}
}