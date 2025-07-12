import { IView } from '../../interfaces/IView';
import { IModel } from '../../interfaces/IModel';

export abstract class BasePresenter<	TView extends IView,	TModel extends IModel> {
	protected view: TView;
	protected model: TModel;

	protected constructor(view: TView, model: TModel) {
		this.view = view;
		this.model = model;
		this.init();
	}

	protected abstract init(): void;
}
