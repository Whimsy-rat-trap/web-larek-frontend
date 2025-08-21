import { ensureElement, cloneTemplate } from '../../utils/utils';
import { IProduct } from '../../types';
import { BasketItemView } from './BasketItemView';

export class BasketView {
	constructor(
		private container: HTMLElement,
		private checkoutButtonClick: () => void,
		private deleteButtonClick: (productId: string) => void
	) {}

	render(items: IProduct[], totalPrice: number): HTMLElement {
		const basketTemplateElement = ensureElement<HTMLTemplateElement>('#basket');
		const basketElement = cloneTemplate(basketTemplateElement);
		const basketPriceElement = ensureElement<HTMLElement>(
			'.basket__price',
			basketElement
		);
		const basketListElement = ensureElement<HTMLElement>(
			'.basket__list',
			basketElement
		);
		const checkoutButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			basketElement
		);

		basketPriceElement.textContent = `${totalPrice} синапсов`;

		if (items.length === 0) {
			const emptyMessage = document.createElement('p');
			emptyMessage.className = 'basket__empty';
			emptyMessage.textContent = 'Пустая корзина';
			basketListElement.appendChild(emptyMessage);
			checkoutButton.disabled = true;
		} else {
			const basketItems = items.map((item: IProduct, index: number) => {
				const basketItemView = new BasketItemView(
					item,
					index + 1,
					() => this.deleteButtonClick(item.id)
				);
				return basketItemView.element;
			});

			basketListElement.append(...basketItems);
			checkoutButton.disabled = false;
		}

		checkoutButton.addEventListener('click', () => {
			this.checkoutButtonClick();
		});

		this.container.replaceChildren(basketElement);

		return basketElement;
	}
}