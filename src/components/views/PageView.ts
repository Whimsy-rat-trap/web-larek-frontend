import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';
import { ProductItemView } from './ProductItemView';

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
	 * @param productElements
	 */
	public render(productElements: HTMLElement[]): void {
		this.gallery.innerHTML = '';
		this.gallery.append(...productElements);
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