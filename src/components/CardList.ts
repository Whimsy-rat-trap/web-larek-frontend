import { ICardActions, Product } from '../types';
import { Card } from './Card';

export class CardList {
    private element: HTMLElement;
    private cards: Card[] = [];

    constructor(
        private container: HTMLElement,
        private cardTemplate: HTMLTemplateElement,
        private cardActions?: ICardActions
    ) {
        this.element = container;
    }

    clear() {
        this.element.innerHTML = '';
        this.cards = [];
    }

    addCard(product: Product) {
        const card = new Card(this.cardTemplate, this.cardActions);
        const cardElement = card.render(product);
        this.element.append(cardElement);
        this.cards.push(card);
        return card;
    }

    addCards(products: Product[]) {
        this.clear();
        products.forEach(product => {
            this.addCard(product);
        });
    }
}