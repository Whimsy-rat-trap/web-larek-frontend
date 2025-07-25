import { Modal } from "./Modal";
import { EventEmitter } from "./base/events";
import { ensureElement, cloneTemplate } from "../utils/utils";
import { AppEvents } from "../types/events";
import { IProduct } from "../types";
import { CDN_URL, settings } from '../utils/constants';

/**
 * Модальное окно просмотра товара
 * @class ProductModal
 * @extends Modal
 */
export class ProductModal extends Modal {
	private addToCartButton: HTMLButtonElement;

	constructor(eventEmitter: EventEmitter) {
		super(eventEmitter);

		eventEmitter.on(AppEvents.PRODUCT_DETAILS_LOADED, (data: IProduct) =>
			this.renderProduct(data));
	}

	/**
	 * Рендерит информацию о товаре
	 * @private
	 * @param {IProduct} product - Данные товара
	 */
	private renderProduct(product: IProduct): void {
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
			this.addToCartButton.disabled = false;
			this.addToCartButton.textContent = 'В корзину';

			this.addToCartButton.addEventListener('click', () => {
				this.eventEmitter.emit(AppEvents.MODAL_PRODUCT_CART_ITEM_ADDED, { id: product.id });
				this.close();
			});
		} else {
			price.textContent = 'Бесценно';
			this.addToCartButton.disabled = true;
			this.addToCartButton.textContent = 'Недоступно';
		}

		// Обработка категории
		const categorySlug = settings.categories[product.category] || 'other';
		category.className = `card__category card__category_${categorySlug}`;

		super.render(card);
	}
}