import { IView } from '../../interfaces/IView';
import { IModel } from '../../interfaces/IModel';
import { EventEmitter } from './events';

export abstract class BasePresenter<
	TView extends IView,
	TModel extends IModel
> {
	protected view: TView;
	protected model: TModel;
	protected eventEmitter: EventEmitter;

	protected constructor(
		view: TView,
		model: TModel,
		eventEmitter: EventEmitter
	) {
		this.view = view;
		this.model = model;
		this.eventEmitter = eventEmitter;
		this.bindEvents();
		this.init();
	}

	protected abstract bindEvents(): void;

	protected abstract init(): void;
}
