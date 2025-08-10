import { ensureElement, cloneTemplate } from "../../utils/utils";
import { IProduct } from "../../types";
import { CDN_URL, settings } from '../../utils/constants';

/**
 * Модальное окно просмотра товара с возможностью добавления/удаления из корзины
 * @class ProductModalView
 * @property {HTMLButtonElement} addToCartButton - Кнопка добавления/удаления товара
 * @property {string|null} currentProductId - ID текущего отображаемого товара
 */
export class ProductModalView {
	private addToCartButton: HTMLButtonElement;
	currentProductId: string | null = null;

	/**
	 * Создает экземпляр ProductModal
	 * @constructor
	 * @param {EventEmitter} eventEmitter - Эмиттер событий приложения
	 */
	constructor(
		private requestButtonState: Function,
		private addToCartClick: Function,
		private removeFromCartClick: Function
	) {}

	/**
	 * Рендерит информацию о товаре в модальном окне
	 * @private
	 * @param {IProduct} product - Данные товара для отображения
	 * @emits AppEvents.UI_MODAL_PRODUCT_BUTTON_STATE_CHANGED - Для проверки состояния товара в корзине
	 */
	renderProduct(product: IProduct): void {
		this.currentProductId = product.id;
		const template = ensureElement<HTMLTemplateElement>('#card-preview');
		const card = cloneTemplate(template);

		const title = ensureElement<HTMLElement>('.card__title', card);
		const image = ensureElement<HTMLImageElement>('.card__image', card);
		const category = ensureElement<HTMLElement>('.card__category', card);
		const price = ensureElement<HTMLElement>('.card__price', card);
		const description = ensureElement<HTMLElement>('.card__text', card);
		this.addToCartButton = ensureElement<HTMLButtonElement>('.card__button', card);

		title.textContent = product.title;
		image.src = `${CDN_URL}${product.image}`;
		image.alt = product.title;
		category.textContent = product.category;
		description.textContent = product.description;

		if (product.price) {
			price.textContent = `${product.price} синапсов`;
			this.updateButtonState(product.id);
		} else {
			price.textContent = 'Бесценно';
			this.addToCartButton.disabled = true;
			this.addToCartButton.textContent = 'Недоступно';
		}

		const categorySlug = settings.categories[product.category] || 'other';
		category.className = `card__category card__category_${categorySlug}`;

	}

	/**
	 * Обновляет состояние кнопки в зависимости от наличия товара в корзине
	 * @private
	 * @param {string} productId - ID товара для проверки
	 * @emits AppEvents.UI_MODAL_PRODUCT_BUTTON_STATE_CHANGED - Запрашивает состояние товара в корзине
	 */
	updateButtonState(productId: string): void {
		if (!this.addToCartButton) return;

		this.requestButtonState(productId, (inCart: boolean) => {
				if (inCart) {
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
				this.addToCartButton.disabled = false;
		});
	}
}