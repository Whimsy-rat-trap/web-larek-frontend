import { EventEmitter } from "./base/events";
import { ensureElement } from "../utils/utils";
import { AppEvents } from "../types/events";
import { IProduct, IBasketState } from "../types";

/**
 * Класс главной страницы приложения
 * @class Page
 * @property {EventEmitter} eventEmitter - Эмиттер событий приложения
 * @property {HTMLElement} gallery - Контейнер для отображения товаров
 * @property {HTMLElement} basketCounter - Элемент отображения количества товаров в корзине
 * @property {HTMLElement} basketButton - Кнопка открытия корзины
 */
export class Page {
	private eventEmitter: EventEmitter;
	private gallery: HTMLElement;
	private basketCounter: HTMLElement;
	private basketButton: HTMLElement;

	/**
	 * Создает экземпляр Page
	 * @constructor
	 * @param {EventEmitter} eventEmitter - Эмиттер событий приложения
	 * @emits AppEvents.PAGE_MAIN_LOADED При инициализации
	 */
	constructor(eventEmitter: EventEmitter) {
		this.eventEmitter = eventEmitter;

		this.gallery = ensureElement<HTMLElement>('.gallery');
		this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
		this.basketButton = ensureElement<HTMLElement>('.header__basket');

		this.setupEventListeners();
		this.setupUIListeners();

		// Инициируем загрузку страницы
		this.eventEmitter.emit(AppEvents.PAGE_MAIN_LOADED);
	}

	/**
	 * Настраивает обработчики событий для главной страницы
	 * @private
	 * @listens AppEvents.PRODUCTS_LIST_LOADED При загрузке списка товаров вызывает renderProducts()
	 * @listens AppEvents.CART_UPDATED При обновлении корзины вызывает updateBasketCounter()
	 */
	private setupEventListeners() {
		this.eventEmitter.on(AppEvents.PRODUCTS_LIST_LOADED, (data: { items: IProduct[] }) =>
			this.renderProducts(data.items));
		this.eventEmitter.on(AppEvents.CART_UPDATED, (data: IBasketState) =>
			this.updateBasketCounter(data.items.length));
	}

	/**
	 * Настраивает обработчики UI событий
	 * @private
	 * @emits AppEvents.UI_BUTTON_CART_CLICKED При клике на кнопку корзины
	 */
	private setupUIListeners() {
		this.basketButton.addEventListener('click', () => {
			this.eventEmitter.emit(AppEvents.UI_BUTTON_CART_CLICKED);
		});
	}

	/**
	 * Отображает список товаров
	 * @private
	 * @param {IProduct[]} products - Массив товаров для отображения
	 */
	private renderProducts(products: IProduct[]) {
		this.gallery.innerHTML = '';
		products.forEach(product => {
			const productElement = this.createProductElement(product);
			this.gallery.appendChild(productElement);
		});
	}

	/**
	 * Создает DOM-элемент товара
	 * @private
	 * @param {IProduct} product - Данные товара
	 * @returns {HTMLElement} Созданный элемент товара
	 * @emits AppEvents.PRODUCT_DETAILS_REQUESTED При клике на товар
	 */
	private createProductElement(product: IProduct): HTMLElement {
		const template = ensureElement<HTMLTemplateElement>('#card-catalog');
		const card = template.content.cloneNode(true) as HTMLElement;

		const title = card.querySelector('.card__title') as HTMLElement;
		const image = card.querySelector('.card__image') as HTMLImageElement;
		const category = card.querySelector('.card__category') as HTMLElement;
		const price = card.querySelector('.card__price') as HTMLElement;

		title.textContent = product.title;
		image.src = product.image;
		image.alt = product.title;
		category.textContent = product.category;
		price.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';

		// Добавляем класс для категории
		const categoryClass = `card__category_${product.category.toLowerCase().replace(' ', '-')}`;
		category.classList.add(categoryClass);

		// Обработчик клика на товар
		card.querySelector('.card')?.addEventListener('click', () => {
			this.eventEmitter.emit(AppEvents.PRODUCT_DETAILS_REQUESTED, { id: product.id });
		});

		return card as HTMLElement;
	}

	/**
	 * Обновляет счетчик товаров в корзине
	 * @private
	 * @param {number} count - Количество товаров в корзине
	 */
	private updateBasketCounter(count: number) {
		this.basketCounter.textContent = count.toString();
	}
}