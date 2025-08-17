import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';
import { CategoryType, CDN_URL, settings } from '../../utils/constants';

/**
 * Класс главной страницы приложения
 * @class PageView
 * @property {HTMLElement} gallery - Контейнер для отображения товаров
 * @property {HTMLElement} basketCounter - Элемент отображения количества товаров в корзине
 * @property {HTMLElement} basketButton - Кнопка открытия корзины
 */
export class PageView {
	private gallery: HTMLElement;
	private basketCounter: HTMLElement;
	private basketButton: HTMLElement;

	/**
	 * Создает экземпляр Page
	 * @constructor
	 */
	constructor(
		private basketButtonClick: () => void,
		private cardButtonClick: (productId: string) => void
	) {
		this.gallery = ensureElement<HTMLElement>('.gallery');
		this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
		this.basketButton = ensureElement<HTMLElement>('.header__basket');

		this.setupUIListeners();
	}

	/**
	 * Настраивает обработчики UI событий
	 */
	private setupUIListeners(): void {
		this.basketButton.addEventListener('click', () => {
			this.basketButtonClick();
		});
	}

	/**
	 * Отображает список товаров в галерее
	 * @private
	 * @param {IProduct[]} products - Массив товаров для отображения
	 */
	public render(products: IProduct[]): void {
		this.gallery.innerHTML = '';
		products.forEach((product) => {
			const productElement = this.createProductElement(product);
			this.gallery.appendChild(productElement);
		});
	}

	/**
	 * Создает DOM-элемент товара для каталога
	 * @private
	 * @param {IProduct} product - Данные товара
	 * @returns {HTMLElement} Созданный DOM-элемент товара
	 */
	private createProductElement(product: IProduct): HTMLElement {
		const template = ensureElement<HTMLTemplateElement>('#card-catalog');
		const card = template.content.cloneNode(true) as HTMLElement;

		const title = card.querySelector('.card__title') as HTMLElement;
		const image = card.querySelector('.card__image') as HTMLImageElement;
		const category = card.querySelector('.card__category') as HTMLElement;
		const price = card.querySelector('.card__price') as HTMLElement;

		// Заполняем данные товара
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
		card.querySelector('.card')?.addEventListener('click', () => {
			this.cardButtonClick(product.id);
		});

		return card as HTMLElement;
	}

	/**
	 * Обновляет счетчик товаров в корзине
	 * @private
	 * @param {number} count - Количество товаров в корзине
	 */
	public updateBasketCounter(count: number): void {
		this.basketCounter.textContent = count.toString();
	}
}
