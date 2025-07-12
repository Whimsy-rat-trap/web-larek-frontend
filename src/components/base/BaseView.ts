import { IView } from '../../interfaces/IView';
import { EventEmitter } from './events';

export abstract class BaseView implements IView {
	protected eventEmitter: EventEmitter;

	protected constructor(eventEmitter: EventEmitter) {
		this.eventEmitter = eventEmitter;
		this.bindEvents();
	}

	protected abstract bindEvents(): void;

	public abstract render(data?: any): HTMLElement;
}
