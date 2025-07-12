import { ICardActions, Product } from '../../types';
import { CardView } from './CardView';

export class CardListView {
	private cards: CardView[] = [];

	constructor(
		private container: HTMLElement,
		private template: HTMLTemplateElement,
		private actions?: ICardActions
	) {}

	clear(): void {
		this.container.innerHTML = '';
		this.cards = [];
	}

	addCard(product: Product): CardView {
		const card = new CardView(this.template, this.actions);
		const cardElement = card.render(product);
		this.container.appendChild(cardElement);
		this.cards.push(card);
		return card;
	}

	addCards(products: Product[]): void {
		this.clear();
		products.forEach(product => this.addCard(product));
	}
}