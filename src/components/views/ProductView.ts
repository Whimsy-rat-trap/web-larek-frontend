import { ensureElement, cloneTemplate } from '../../utils/utils';
import { IProduct } from '../../types';
import { CDN_URL, settings } from '../../utils/constants';

/**
 * Модальное окно просмотра товара с возможностью добавления/удаления из корзины
 * @class ProductView
 * @property {HTMLButtonElement} addToCartButton - Кнопка добавления/удаления товара
 * @property {string|null} currentProductId - ID текущего отображаемого товара
 */
export class ProductView {
	private addToCartButton: HTMLButtonElement;
	currentProductId: string | null = null;

	/**
	 * Создает экземпляр ProductModal
	 * @constructor
	 * @param container - контейнер для отрисовки содержимого
	 * @param addToCartClick - обработчик кнопки добавления товара в корзину
	 * @param removeFromCartClick
	 */
	constructor(
		private container: HTMLElement,
		private addToCartClick: (productId: string) => void,
		private removeFromCartClick: (productId: string) => void
	) {}

	/**
	 * Рендерит информацию о товаре в модальном окне
	 * @param {IProduct} product - Данные товара для отображения
	 * @param inBasket - Флаг того, что товар в корзине
	 */
	render(product: IProduct, inBasket: boolean): HTMLElement {
		this.currentProductId = product.id;
		const template = ensureElement<HTMLTemplateElement>('#card-preview');
		const card = cloneTemplate(template);

		const title = ensureElement<HTMLElement>('.card__title', card);
		const image = ensureElement<HTMLImageElement>('.card__image', card);
		const category = ensureElement<HTMLElement>('.card__category', card);
		const price = ensureElement<HTMLElement>('.card__price', card);
		const description = ensureElement<HTMLElement>('.card__text', card);
		this.addToCartButton = ensureElement<HTMLButtonElement>(
			'.card__button',
			card
		);

		title.textContent = product.title;
		image.src = `${CDN_URL}${product.image}`;
		image.alt = product.title;
		category.textContent = product.category;
		description.textContent = product.description;

		if (product.price) {
			price.textContent = `${product.price} синапсов`;
			this.updateButtonState(product.id, inBasket);
		} else {
			price.textContent = 'Бесценно';
			this.addToCartButton.disabled = true;
			this.addToCartButton.textContent = 'Недоступно';
		}

		const categorySlug = settings.categories[product.category] || 'other';
		category.className = `card__category card__category_${categorySlug}`;

		this.container.replaceChildren(card);

		return card;
	}

	/**
	 * Обновляет состояние кнопки в зависимости от наличия товара в корзине
	 * @private
	 * @param {string} productId - ID товара для проверки
	 * @param inBasket - Флаг того, что товар в корзине
	 */
	updateButtonState(productId: string, inBasket: boolean): void {
		if (inBasket) {
			this.addToCartButton.textContent = 'Удалить из корзины';
			this.addToCartButton.onclick = () => {
				this.removeFromCartClick(productId);
			};
		} else {
			this.addToCartButton.textContent = 'Купить';
			this.addToCartButton.onclick = () => {
				this.addToCartClick(productId);
			};
		}
	}
}
