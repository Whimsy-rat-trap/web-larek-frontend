import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Product } from '../../types';

export interface IBasketItemActions {
	onDelete?: (productId: string) => void;
}

export class BasketItemView {
	protected element: HTMLElement;
	protected indexElement: HTMLElement;
	protected titleElement: HTMLElement;
	protected priceElement: HTMLElement;
	protected deleteButton: HTMLElement;

	constructor(template: HTMLTemplateElement, actions?: IBasketItemActions) {
		this.element = cloneTemplate(template);
		this.indexElement = ensureElement('.basket__item-index', this.element);
		this.titleElement = ensureElement('.card__title', this.element);
		this.priceElement = ensureElement('.card__price', this.element);
		this.deleteButton = ensureElement('.basket__item-delete', this.element);

		if (actions?.onDelete) {
			this.deleteButton.addEventListener('click', () => {
				const productId = this.element.dataset.id;
				if (productId) {
					actions.onDelete!(productId);
				}
			});
		}
	}

	render(product: Product, index: number): HTMLElement {
		this.element.dataset.id = product.id;
		this.indexElement.textContent = (index + 1).toString();
		this.titleElement.textContent = product.title;
		this.priceElement.textContent = `${product.price} синапсов`;

		return this.element;
	}
}