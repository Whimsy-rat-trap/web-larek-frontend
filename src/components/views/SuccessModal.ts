import { ensureElement, cloneTemplate } from "../../utils/utils";
import { BasketView } from "./BasketView";
import { OrderView } from "./OrderView";
import { ContactsView } from "./ContactsView";
import {Order} from "../models/Order";
import { PaymentMethod } from '../../types';
import { ApiService } from '../services/ApiService';

export class SuccessModal {
    private modal: HTMLElement;
    private template: HTMLTemplateElement;
    private basket: BasketView;
    private contactsModal: HTMLElement;
    private paymentModal: HTMLElement;
    private orderView: OrderView;
    private contacts: ContactsView;
    private closeModalFn: (modal: HTMLElement) => void;
    private order: Order;

    constructor(
        modal: HTMLElement,
        template: HTMLTemplateElement,
        basket: BasketView,
        contactsModal: HTMLElement,
        paymentModal: HTMLElement,
        orderView: OrderView,
        contacts: ContactsView,
        closeModal: (modal: HTMLElement) => void,
        order: Order
    ) {
        this.modal = ensureElement<HTMLElement>(modal);
        this.template = ensureElement<HTMLTemplateElement>(template);
        this.basket = basket;
        this.contactsModal = ensureElement<HTMLElement>(contactsModal);
        this.paymentModal = ensureElement<HTMLElement>(paymentModal);
        this.orderView = orderView;
        this.contacts = contacts;
        this.closeModalFn = closeModal;
        this.order = order;
    }

    private close(): void {
        this.closeModalFn(this.modal);
    }

    private clearBasket(): void {
        this.basket.clearBasket();
    }

    private clearForms(): void {
        this.orderView.resetForm();
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

        const orderData = this.orderView.getOrderData();
        const contactsData = this.contacts.getContactsData();
        basketState.items.map(item => item.id);

        this.order.paymentMethod = orderData.payment as PaymentMethod;
        this.order.email = contactsData.email;
        this.order.phone = contactsData.phone;
        this.order.address = orderData.address;
        this.order.products = basketState.items;

        try {
            const apiService = new ApiService();
            const response = await apiService.submitOrder(this.order);
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