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
 * @property {HTMLButtonElement} addToCartButton - Кнопка добавления в корзину
 */
export class ProductModal extends Modal {
	private addToCartButton: HTMLButtonElement;

	/**
	 * Создает экземпляр ProductModal
	 * @constructor
	 * @param {EventEmitter} eventEmitter - Эмиттер событий приложения
	 * @listens AppEvents.PRODUCT_DETAILS_LOADED - Событие загрузки данных товара
	 */
	constructor(eventEmitter: EventEmitter) {
		super(eventEmitter);

		eventEmitter.on(AppEvents.PRODUCT_DETAILS_LOADED, (data: IProduct) =>
			this.renderProduct(data));
	}

	/**
	 * Рендерит информацию о товаре в модальном окне
	 * @private
	 * @param {IProduct} product - Данные товара для отображения
	 * @emits AppEvents.MODAL_PRODUCT_BASKET_ITEM_ADDED - При клике на кнопку добавления в корзину
	 *
	 * Структура рендеринга:
	 * 1. Клонирует шаблон карточки товара
	 * 2. Заполнение данных:
	 *    - Название товара
	 *    - Изображение (с CDN)
	 *    - Категория (с преобразованием в CSS класс)
	 *    - Описание
	 *    - Цена (или "Бесценно" если цена отсутствует)
	 * 3. Настройка кнопки добавления в корзину:
	 *    - Активирует если товар доступен
	 *    - Блокирует если товар недоступен
	 * 4. Отображение модального окна
	 */
	private renderProduct(product: IProduct): void {
		const template = ensureElement<HTMLTemplateElement>('#card-preview');
		const card = cloneTemplate(template);

		// Получаем элементы DOM
		const title = ensureElement<HTMLElement>('.card__title', card);
		const image = ensureElement<HTMLImageElement>('.card__image', card);
		const category = ensureElement<HTMLElement>('.card__category', card);
		const price = ensureElement<HTMLElement>('.card__price', card);
		const description = ensureElement<HTMLElement>('.card__text', card);
		this.addToCartButton = ensureElement<HTMLButtonElement>('.card__button', card);

		// Заполняем данные
		title.textContent = product.title;
		image.src = `${CDN_URL}${product.image}`;
		image.alt = product.title;
		category.textContent = product.category;
		description.textContent = product.description;

		// Обработка цены и кнопки
		if (product.price) {
			price.textContent = `${product.price} синапсов`;
			this.addToCartButton.disabled = false;
			this.addToCartButton.textContent = 'В корзину';

			this.addToCartButton.addEventListener('click', () => {
				this.eventEmitter.emit(AppEvents.MODAL_PRODUCT_BASKET_ITEM_ADDED, { id: product.id });
				this.close();
			});
		} else {
			price.textContent = 'Бесценно';
			this.addToCartButton.disabled = true;
			this.addToCartButton.textContent = 'Недоступно';
		}

		// Обработка категории (CSS класс)
		const categorySlug = settings.categories[product.category] || 'other';
		category.className = `card__category card__category_${categorySlug}`;

		super.render(card);
	}
}