import { AppStateModel } from '../models/AppStateModel';
import { PageView } from '../views/PageView';
import { EventEmitter } from '../base/events';
import { StateEvents } from '../../types/events';
import { ProductItemView } from '../views/ProductItemView';

export class PagePresenter {
	constructor(
		private view: PageView,
		private model: AppStateModel,
		private eventEmitter: EventEmitter
	) {
		this.setupEventListeners();
	}

	private setupEventListeners(): void {
		this.eventEmitter.on(StateEvents.CATALOG_STATE_UPDATED, () =>
			this.renderProducts()
		);
		this.eventEmitter.on(StateEvents.BASKET_STATE_CHANGED, () =>
			this.view.updateBasketCounter(this.model.state.basket.length)
		);
	}

	private renderProducts(): void {
		const productElements = this.model.state.catalog.map(product => {
			const productItemView = new ProductItemView(
				product,
				() => this.eventEmitter.emit('ui:product:clicked', { id: product.id })
			);
			return productItemView.element;
		});

		this.view.render(productElements);
	}
}