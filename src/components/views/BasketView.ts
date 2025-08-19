import { ensureElement, cloneTemplate } from '../../utils/utils';
import { IProduct } from '../../types';
import { BasketItemView } from './BasketItemView';

/**
 * Модальное окно корзины
 * @class BasketView
 */
export class BasketView {
	/**
	 * Конструктор класса CartModal
	 * @constructor
	 * @param container - контейнер для отрисовки содержимого
	 * @param checkoutButtonClick
	 * @param deleteButtonClick
	 */
	constructor(
		private container: HTMLElement,
		private checkoutButtonClick: () => void,
		private deleteButtonClick: (productId: string) => void
	) {}

	/**
	 * Рендерит содержимое корзины
	 */
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
			items.forEach((item: IProduct, index: number) => {
				const cartItemView = new BasketItemView(item, index + 1, () =>
					this.deleteButtonClick(item.id)
				);
				basketListElement.appendChild(cartItemView.element);
			});
			checkoutButton.disabled = false;
		}

		checkoutButton.addEventListener('click', () => {
			this.checkoutButtonClick();
		});

		this.container.replaceChildren(basketElement);

		return basketElement;
	}
}
