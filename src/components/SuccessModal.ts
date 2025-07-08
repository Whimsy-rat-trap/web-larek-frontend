import { ensureElement, cloneTemplate } from "../utils/utils";
import { Basket } from "./Basket";
import { Order } from "./Order";
import { Contacts } from "./Contacts";

export class SuccessModal {
    private modal: HTMLElement;
    private template: HTMLTemplateElement;
    private basket: Basket;
    private contactsModal: HTMLElement;
    private paymentModal: HTMLElement;
    private order: Order;
    private contacts: Contacts;
    private closeModalFn: (modal: HTMLElement) => void;

    constructor(
        modal: HTMLElement,
        template: HTMLTemplateElement,
        basket: Basket,
        contactsModal: HTMLElement,
        paymentModal: HTMLElement,
        order: Order,
        contacts: Contacts,
        closeModal: (modal: HTMLElement) => void
    ) {
        this.modal = ensureElement<HTMLElement>(modal);
        this.template = ensureElement<HTMLTemplateElement>(template);
        this.basket = basket;
        this.contactsModal = ensureElement<HTMLElement>(contactsModal);
        this.paymentModal = ensureElement<HTMLElement>(paymentModal);
        this.order = order;
        this.contacts = contacts;
        this.closeModalFn = closeModal;
    }

    private setupEventListeners(content: HTMLElement): void {
        // Обработчик для кнопки "За новыми покупками!"
        const continueButton = content.querySelector('.order-success__close');
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                this.closeAndReset();
            });
        }

        // Обработчик для крестика
        const closeButton = this.modal.querySelector('.modal__close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.closeAndReset();
            });
        }

        // Обработчик клика вне модального окна
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeAndReset();
            }
        });
    }

    private closeAndReset(): void {
        this.close();
        this.clearForms();
        this.clearBasket();
    }

    private clearForms(): void {
        // Очищаем форму оплаты
        this.order.resetForm();

        // Очищаем форму контактов
        this.contacts.resetForm();
    }

    public show(): void {
        // Закрываем модальное окно контактов
        this.closeModalFn(this.contactsModal);

        // Получаем данные из корзины
        const basketState = this.basket.getState();
        const total = basketState.total;

        // Создаем содержимое из шаблона
        const content = cloneTemplate<HTMLElement>(this.template);
        const description = content.querySelector('.order-success__description');

        if (description) {
            description.textContent = `Списано ${total} синапсов`;
        }

        // Очищаем и добавляем новое содержимое
        const modalContent = this.modal.querySelector('.modal__content');
        if (modalContent) {
            modalContent.innerHTML = '';
            modalContent.appendChild(content);
        }

        // Настраиваем обработчики событий после добавления в DOM
        this.setupEventListeners(content);

        // Показываем модальное окно
        this.modal.classList.add('modal_active');
    }

    private close(): void {
        this.closeModalFn(this.modal);
    }

    private clearBasket(): void {
        this.basket.clearBasket();
    }
}