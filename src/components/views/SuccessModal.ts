import { ensureElement, cloneTemplate } from "../../utils/utils";
import { BasketView } from "./BasketView";
import { OrderView } from "./OrderView";
import { ContactsView } from "./ContactsView";
import {AppData} from "../models/AppData";

export class SuccessModal {
    private modal: HTMLElement;
    private template: HTMLTemplateElement;
    private basket: BasketView;
    private contactsModal: HTMLElement;
    private paymentModal: HTMLElement;
    private order: OrderView;
    private contacts: ContactsView;
    private closeModalFn: (modal: HTMLElement) => void;
    private appData: AppData;

    constructor(
        modal: HTMLElement,
        template: HTMLTemplateElement,
        basket: BasketView,
        contactsModal: HTMLElement,
        paymentModal: HTMLElement,
        order: OrderView,
        contacts: ContactsView,
        closeModal: (modal: HTMLElement) => void,
        appData: AppData
    ) {
        this.modal = ensureElement<HTMLElement>(modal);
        this.template = ensureElement<HTMLTemplateElement>(template);
        this.basket = basket;
        this.contactsModal = ensureElement<HTMLElement>(contactsModal);
        this.paymentModal = ensureElement<HTMLElement>(paymentModal);
        this.order = order;
        this.contacts = contacts;
        this.closeModalFn = closeModal;
        this.appData = appData;
    }

    private close(): void {
        this.closeModalFn(this.modal);
    }

    private clearBasket(): void {
        this.basket.clearBasket();
    }

    private clearForms(): void {
        this.order.resetForm();
        this.contacts.resetForm();
    }

    private closeAndReset(): void {
        this.close();
        this.clearForms();
        this.clearBasket();
    }

    private setupEventListeners(content: HTMLElement): void {
        const continueButton = content.querySelector('.order-success__close');
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                this.closeAndReset();
            });
        }

        const closeButton = this.modal.querySelector('.modal__close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.closeAndReset();
            });
        }

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeAndReset();
            }
        });
    }

    public async show(): Promise<void> {
        this.closeModalFn(this.contactsModal);

        const basketState = this.basket.getState();
        const total = basketState.total;

        const orderData = this.order.getOrderData();
        const contactsData = this.contacts.getContactsData();

        const fullOrder = {
            ...orderData,
            ...contactsData,
            items: basketState.items.map(item => item.id),
            total: total
        };

        try {
            const response = await this.appData.submitOrder(fullOrder);
            const successTotal = response.total;

            const content = cloneTemplate<HTMLElement>(this.template);
            const description = content.querySelector('.order-success__description');

            if (description) {
                description.textContent = `Списано ${successTotal} синапсов`;
            }

            const modalContent = this.modal.querySelector('.modal__content');
            if (modalContent) {
                modalContent.innerHTML = '';
                modalContent.appendChild(content);
            }

            this.setupEventListeners(content);
            this.modal.classList.add('modal_active');

            this.basket.clearBasket();
            this.clearForms();
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
        }
    }
}