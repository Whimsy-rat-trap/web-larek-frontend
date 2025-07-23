import { EventEmitter } from "./base/events";
import { ensureElement } from "../utils/utils";
import { AppEvents } from "../utils/events";
import { IProduct, IBasketState } from "../types";

export class Page {
	private eventEmitter: EventEmitter;
	private gallery: HTMLElement;
	private basketCounter: HTMLElement;
	private basketButton: HTMLElement;

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

	private setupEventListeners() {
		this.eventEmitter.on(AppEvents.PRODUCTS_LIST_LOADED, (data: { items: IProduct[] }) =>
			this.renderProducts(data.items));
		this.eventEmitter.on(AppEvents.CART_UPDATED, (data: IBasketState) =>
			this.updateBasketCounter(data.items.length));
	}

	private setupUIListeners() {
		this.basketButton.addEventListener('click', () => {
			this.eventEmitter.emit(AppEvents.UI_BUTTON_CART_CLICKED);
		});
	}

	private renderProducts(products: IProduct[]) {
		this.gallery.innerHTML = '';
		products.forEach(product => {
			const productElement = this.createProductElement(product);
			this.gallery.appendChild(productElement);
		});
	}

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

	private updateBasketCounter(count: number) {
		this.basketCounter.textContent = count.toString();
	}
}