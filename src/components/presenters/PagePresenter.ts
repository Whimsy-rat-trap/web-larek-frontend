import { AppStateModel } from '../models/AppStateModel';
import { PageView } from '../views/PageView';

export class PagePresenter {
	constructor(
		private view: PageView,
		private model: AppStateModel,
	){
	}
}