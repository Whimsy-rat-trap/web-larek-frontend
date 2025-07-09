import { cloneTemplate, ensureElement } from '../utils/utils';
import { ICardActions, Product  } from '../types';
import { CDN_URL } from '../utils/constants';

export class Card {
	protected element: HTMLElement;
	protected categoryElement: HTMLElement;
	protected titleElement: HTMLElement;
	protected imageElement: HTMLImageElement;
	protected priceElement: HTMLElement;
	protected descriptionElement: HTMLElement | null;

	constructor(template: HTMLTemplateElement, actions?: ICardActions) {
		this.element = cloneTemplate(template);
		this.categoryElement = ensureElement('.card__category', this.element);
		this.titleElement = ensureElement('.card__title', this.element);
		this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.element);
		this.priceElement = ensureElement('.card__price', this.element);
		this.descriptionElement = this.element.querySelector('.card__text');

		if (actions?.onClick) {
			this.element.addEventListener('click', actions.onClick);
		}
	}

	setCategory(value: string): void {
		this.categoryElement.textContent = value;

		// Очищаем все классы категорий
		this.categoryElement.className = 'card__category';

		// Добавляем соответствующий класс
		const categoryClass = this.getCategoryClass(value);
		this.categoryElement.classList.add(`card__category_${categoryClass}`);
	}

	private getCategoryClass(category: string): string {
		const lowerCategory = category.toLowerCase();
		if (lowerCategory.includes('софт') || lowerCategory.includes('soft')) return 'soft';
		if (lowerCategory.includes('хард') || lowerCategory.includes('hard')) return 'hard';
		if (lowerCategory.includes('дополн') || lowerCategory.includes('additional')) return 'additional';
		if (lowerCategory.includes('кнопк') || lowerCategory.includes('button')) return 'button';
		return 'other';
	}

	render(product: Product): HTMLElement {
		this.element.dataset.id = product.id;
		this.titleElement.textContent = product.title;
		this.setCategory(product.category);

		// Обработка изображения
		this.imageElement.src = product.image.startsWith('/')
			? `${CDN_URL}${product.image}`
			: product.image;
		this.imageElement.alt = product.title;

		// Обработка цены
		this.priceElement.textContent = product.price !== null
			? `${product.price} синапсов`
			: 'Бесценно';

		// Обработка описания (если есть поле в шаблоне)
		if (this.descriptionElement && product.description) {
			this.descriptionElement.textContent = product.description;
		}

		return this.element;
	}
}