import { ensureElement, cloneTemplate } from '../utils/utils';
import { Product } from '../types';
import { CDN_URL } from '../utils/constants';

export class Basket {
    private items: Product[] = [];
    private total = 0;
    private basketTemplate: HTMLTemplateElement;
    private basketItemTemplate: HTMLTemplateElement;
    private basketModal: HTMLElement;
    private basketCounter: HTMLElement;

    constructor() {
        this.basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
        this.basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
        this.basketModal = ensureElement<HTMLElement>('#basket-modal');
        this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter');

			//счётчик
			this.updateCounter();

		}

    // Добавить товар в корзину
    addItem(product: Product): void {
        if (product.price === null) {
            console.warn(`Товар "${product.title}" не может быть добавлен в корзину - цена не указана`);
            return;
        }

        // Проверяем, есть ли уже такой товар в корзине
        const existingItem = this.items.find(item => item.id === product.id);
        if (!existingItem) {
            this.items.push(product);
            this.total += product.price;
            this.updateBasket();
        }
    }

    // Удалить товар из корзины
    removeItem(productId: string): void {
        const itemIndex = this.items.findIndex(item => item.id === productId);
        if (itemIndex !== -1) {
            const item = this.items[itemIndex];
            if (item.price !== null) {
                this.total -= item.price;
            }
            this.items.splice(itemIndex, 1);
            this.updateBasket();
        }
    }

    // Очистить корзину
    clearBasket(): void {
        this.items = [];
        this.total = 0;
        this.updateBasket();
    }

		private updateCounter(): void {
			this.basketCounter.textContent = this.items.length.toString();
		}

    // Обновить отображение корзины
    private updateBasket(): void {
				this.updateCounter();
        this.basketCounter.textContent = this.items.length.toString();

        const basketContent = this.basketModal.querySelector('.modal__content');
        if (!basketContent) return;

        const basketElement = cloneTemplate<HTMLElement>(this.basketTemplate);
        const basketList = basketElement.querySelector('.basket__list');
        const basketPrice = basketElement.querySelector('.basket__price');

        if (basketList && basketPrice) {
            // Очищаем список перед обновлением
            basketList.innerHTML = '';

            // Добавляем все товары из корзины
            this.items.forEach((item, index) => {
                const basketItemElement = cloneTemplate<HTMLElement>(this.basketItemTemplate);

                basketItemElement.querySelector('.basket__item-index')!.textContent = (index + 1).toString();
                basketItemElement.querySelector('.card__title')!.textContent = item.title;
                basketItemElement.querySelector('.card__price')!.textContent = `${item.price} синапсов`;

								// Устанавливаем data-id для возможности удаления
								basketItemElement.dataset.id = item.id;

                // Добавляем обработчик для кнопки удаления
                const deleteButton = basketItemElement.querySelector('.basket__item-delete');
                if (deleteButton) {
                    deleteButton.addEventListener('click', () => {
                        this.removeItem(item.id);
                    });
                }

                basketList.appendChild(basketItemElement);
            });

            basketPrice.textContent = `${this.total} синапсов`;
        }

        basketContent.innerHTML = '';
        basketContent.appendChild(basketElement);
    }

    // Получить текущее состояние корзины
    getState() {
        return {
            items: this.items,
            total: this.total
        };
    }
}