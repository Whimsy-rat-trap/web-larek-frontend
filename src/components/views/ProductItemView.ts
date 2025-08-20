import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';
import { CDN_URL, settings, CategoryType } from '../../utils/constants';

/**
 * Представление элемента товара в каталоге
 * @class ProductItemView
 * @property {HTMLElement} element - HTML-элемент товара
 */
export class ProductItemView {
	readonly element: HTMLElement;

	/**
	 * Конструктор класса ProductItemView
	 * @constructor
	 * @param {IProduct} product - Данные товара
	 * @param {Function} clickHandler - Обработчик клика на карточку
	 */
	constructor(
		product: IProduct,
		private clickHandler: () => void
	) {

		const template = ensureElement<HTMLTemplateElement>('#card-catalog');
		this.element = template.content.cloneNode(true) as HTMLElement;

		const title = ensureElement<HTMLElement>('.card__title', this.element);
		const image = ensureElement<HTMLImageElement>('.card__image', this.element);
		const category = ensureElement<HTMLElement>('.card__category', this.element);
		const price = ensureElement<HTMLElement>('.card__price', this.element);
		const cardElement = ensureElement<HTMLElement>('.card', this.element);

		title.textContent = product.title;
		image.src = `${CDN_URL}${product.image}`;
		image.alt = product.title;
		category.textContent = product.category;
		price.textContent = product.price
			? `${product.price} синапсов`
			: 'Бесценно';

		// Настраиваем класс категории
		const categoryName = product.category as CategoryType;
		const categoryClass = `card__category_${settings.categories[categoryName]}`;
		category.classList.add(categoryClass);

		// Настраиваем обработчик клика
		cardElement.addEventListener('click', () => {
			this.clickHandler();
		});
	}
}