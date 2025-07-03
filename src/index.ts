import './scss/styles.scss';
import { ensureElement } from './utils/utils';
import { ICardActions } from './types';
import { CardList } from './components/CardList';

const productModal = ensureElement<HTMLElement>('#product-modal');
const basketModal = ensureElement<HTMLElement>('#basket-modal');
const paymentModal = ensureElement<HTMLElement>('#payment-modal');
const contactsModal = ensureElement<HTMLElement>('#contacts-modal');
const successModal = ensureElement<HTMLElement>('#success-modal');

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const galleryContainer = ensureElement<HTMLElement>('.gallery');

// Обработчик клика по карточке
const cardActions: ICardActions = {
	onClick: (event: MouseEvent) => {
		const cardElement = event.currentTarget as HTMLElement;
		const cardId = cardElement.dataset.id;
		if (cardId) {
			console.log(`Карточка с ID ${cardId} была нажата`);
			// Здесь можно добавить логику для отображения детальной информации о продукте
		}
	}
};

// Создание списка карточек
const cardList = new CardList(galleryContainer, cardCatalogTemplate, cardActions);

// Загрузка и отображение карточек
api.getProducts()
	.then(products => {
		cardList.addCards(products);
	})
	.catch(error => {
		console.error('Ошибка при загрузке продуктов:', error);
	});

// Обработчики для всех модальных окон
document.addEventListener('DOMContentLoaded', () => {
    // Кнопка корзины в хедере
    const basketButton = document.querySelector('.header__basket');
    if (basketButton) {
        basketButton.addEventListener('click', () => {
            document.getElementById('basket-modal')?.classList.add('modal_active');
        });
    }

    // Находим все кнопки закрытия модальных окон и добавляем обработчики
    const closeButtons = document.querySelectorAll('.modal__close, .order-success__close');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.classList.remove('modal_active');
            }
        });
    });

    //Добавить в корзину
    const addToCartButtons = document.querySelectorAll('#product-modal .button');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Товар был добавлен в корзину');
        });
    });

    //Удаление из корзины
    const deleteItemButtons = document.querySelectorAll('.basket__item-delete');
    deleteItemButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Товар удален из корзины');
        });
    });

    //Оформление в корзине
    const checkoutButton = document.querySelector('#basket-modal .button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            document.getElementById('basket-modal')?.classList.remove('modal_active');
            document.getElementById('payment-modal')?.classList.add('modal_active');
        });
    }

    // Выбор способа оплаты
    const paymentButtons = document.querySelectorAll('#payment-modal .button_alt');
    paymentButtons.forEach(button => {
        button.addEventListener('click', () => {

        });
    });

    // Переход от оплаты к контактам
    const nextButton = document.querySelector('#payment-modal .modal__actions .button');
    if (nextButton) {
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('payment-modal')?.classList.remove('modal_active');
            document.getElementById('contacts-modal')?.classList.add('modal_active');
        });
    }

    // Кнопка оплаты в контактах
    const payButton = document.querySelector('#contacts-modal .modal__actions .button');
    if (payButton) {
        payButton.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('contacts-modal')?.classList.remove('modal_active');
            document.getElementById('success-modal')?.classList.add('modal_active');
        });
    }
});