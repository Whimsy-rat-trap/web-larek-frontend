import { AppStateModel } from '../models/AppStateModel';
import { ContactsModalView } from '../views/ContactsModalView';
import { AppEvents } from '../../types/events';
import { EventEmitter } from '../base/events';

export class ContactsPresenter {
	constructor(
		private view: ContactsModalView,
		private model: AppStateModel,
		private eventEmitter: EventEmitter,
	){
		eventEmitter.on(AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED, () =>
			this.view.renderContactsForm());
	}
}