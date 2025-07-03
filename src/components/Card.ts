import { cloneTemplate, ensureElement } from '../utils/utils';
import { ICardActions, Product  } from '../types';

export class Card {
		protected _id: string; // Добавляем явное объявление свойства
		protected _title: string;
		protected _category: string;
		protected _image: string;
		protected _price: number | null;
		protected _description?: string;

    private element: HTMLElement;
    private categoryElement: HTMLElement;
    private titleElement: HTMLElement;
    private imageElement: HTMLImageElement;
    private priceElement: HTMLElement;

    constructor(private template: HTMLTemplateElement, private actions?: ICardActions) {
        this.element = cloneTemplate<HTMLElement>(template);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.element);
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.element);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.element);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.element);

        if (actions?.onClick) {
            this.element.addEventListener('click', actions.onClick);
        }
    }

	set id(value: string) {
		this._id = value;
		this.element.dataset.id = value;
	}

	set title(value: string) {
		this._title = value;
		this.titleElement.textContent = value;
	}

	set category(value: string) {
		this._category = value;
		this.categoryElement.textContent = value;
		// Добавляем класс в зависимости от категории
		const categoryClass = `card__category_${value.toLowerCase().replace(' ', '-')}`;
		this.categoryElement.className = 'card__category';
		this.categoryElement.classList.add(categoryClass);
	}

	set image(value: string) {
		this._image = value;
		this.imageElement.src = value;
		this.imageElement.alt = this._title;
	}

	set price(value: number | null) {
		this._price = value;
		this.priceElement.textContent = value ? `${value} синапсов` : 'Бесценно';
	}


	// Геттеры и сеттеры для свойств карточки
    render(data: Product): HTMLElement {
        this.id = data.id;
        this.title = data.title;
        this.category = data.category;
        this.image = data.image;
        this.price = data.price;
        return this.element;
    }
}