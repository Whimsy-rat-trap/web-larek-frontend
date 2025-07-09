import { ICardActions, Product } from '../types';
import { Card } from './Card';

export class CardList {
	private cards: Card[] = [];

	constructor(
		private container: HTMLElement,
		private template: HTMLTemplateElement,
		private actions?: ICardActions
	) {}

	clear(): void {
		this.container.innerHTML = '';
		this.cards = [];
	}

	addCard(product: Product): Card {
		const card = new Card(this.template, this.actions);
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