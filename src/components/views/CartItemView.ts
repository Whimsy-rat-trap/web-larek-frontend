import { ensureElement, cloneTemplate } from "../../utils/utils";
import { IProduct } from "../../types";

/**
 * Представление элемента корзины
 * @class CartItemView
 * @property {HTMLElement} element - HTML-элемент товара в корзине
 */
export class CartItemView {
	readonly element: HTMLElement;

	/**
	 * Конструктор класса CartItemView
	 * @constructor
	 * @param {IProduct} item - Данные товара
	 * @param {number} index - Порядковый номер товара
	 * @param {Function} deleteButtonClick - Обработчик клика на кнопку удаления
	 */
	constructor(item: IProduct, index: number, private deleteButtonClick: Function) {
		const itemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
		this.element = cloneTemplate(itemTemplate);

		const title = ensureElement<HTMLElement>('.card__title', this.element);
		const price = ensureElement<HTMLElement>('.card__price', this.element);
		const indexElement = ensureElement<HTMLElement>('.basket__item-index', this.element);
		const deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.element);

		title.textContent = item.title;
		price.textContent = `${item.price} синапсов`;
		indexElement.textContent = index.toString();

		deleteButton.addEventListener('click', () => {
			this.deleteButtonClick();
		});
	}
}