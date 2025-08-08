import { AppStateModel } from '../models/AppStateModel';
import { ContactsModalView } from '../views/ContactsModalView';

export class ContactsPresenter {
	constructor(
		private view: ContactsModalView,
		private model: AppStateModel,
	){
	}
}