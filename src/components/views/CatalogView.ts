import { ICardActions, Product } from '../../types';
import { CardView } from './CardView';
import { ICatalogView } from '../../interfaces/views/ICatalogView';
import { BaseView } from '../base/BaseView';
import { EventEmitter } from '../base/events';

export class CatalogView extends BaseView implements ICatalogView {
	private cards: CardView[] = [];
	private readonly container: HTMLElement;
	private readonly template: HTMLTemplateElement;
	private cardActions?: ICardActions;

	constructor(
		container: HTMLElement,
		template: HTMLTemplateElement,
		callbacks: {
			cardActions?: ICardActions;
		} = {},
		eventEmitter?: EventEmitter,
	) {
		super(eventEmitter)
		this.container = container;
		this.template = template;
		this.cardActions = callbacks.cardActions;
		this.bindEvents();
	}

	updateProducts(products: Product[]): void {
		this.clear();
		products.forEach((product) => {
			const card = new CardView(this.template, this.cardActions);
			const cardElement = card.render(product);
			this.container.appendChild(cardElement);
			this.cards.push(card);
		});
	}
	render(data: Product[]): HTMLElement {
		throw new Error('Method not implemented.');
	}

	clear(): void {
		this.container.innerHTML = '';
		this.cards = [];
	}

	protected bindEvents(): void {
	}
}