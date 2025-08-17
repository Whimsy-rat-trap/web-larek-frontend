import { ensureElement, cloneTemplate } from '../../utils/utils';
import { IProduct } from '../../types';
import { BasketItemView } from './BasketItemView';

/**
 * Модальное окно корзины
 * @class BasketView
 */
export class BasketView {
	private readonly basketElement: HTMLElement;
	private basketListElement: HTMLElement;
	private basketPriceElement: HTMLElement;
	private checkoutButton: HTMLButtonElement;

	/**
	 * Конструктор класса CartModal
	 * @constructor
	 * @param checkoutButtonClick
	 * @param deleteButtonClick
	 */
	constructor(
		private checkoutButtonClick: () => void,
		private deleteButtonClick: (productId: string) => void
	) {
		const basketTemplateElement = ensureElement<HTMLTemplateElement>('#basket');
		this.basketElement = cloneTemplate(basketTemplateElement);
		this.basketListElement = ensureElement<HTMLElement>(
			'.basket__list',
			this.basketElement
		);
		this.basketPriceElement = ensureElement<HTMLElement>(
			'.basket__price',
			this.basketElement
		);
		this.checkoutButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.basketElement
		);
	}

	/**
	 * Рендерит содержимое корзины
	 */
	render(items: IProduct[], totalPrice: number): HTMLElement {
		this.basketListElement.innerHTML = '';
		this.basketPriceElement.textContent = `${totalPrice} синапсов`;

		if (items.length === 0) {
			const emptyMessage = document.createElement('p');
			emptyMessage.className = 'basket__empty';
			emptyMessage.textContent = 'Пустая корзина';
			this.basketListElement.appendChild(emptyMessage);
			this.checkoutButton.disabled = true;
		} else {
			items.forEach((item: IProduct, index: number) => {
				const cartItemView = new BasketItemView(item, index + 1, () =>
					this.deleteButtonClick(item.id)
				);
				this.basketListElement.appendChild(cartItemView.element);
			});
			this.checkoutButton.disabled = false;
		}

		this.checkoutButton.addEventListener('click', () => {
			this.checkoutButtonClick();
		});

		return this.basketElement;
	}
}
