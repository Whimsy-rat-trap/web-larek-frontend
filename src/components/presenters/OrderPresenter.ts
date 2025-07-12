import { BasePresenter } from '../base/BasePresenter';
import { Order } from '../views/Order';
import { Contacts } from '../views/Contacts';
import { SuccessModal } from '../views/SuccessModal';
import { ModalManager } from '../views/ModalManager';

export class OrderPresenter extends BasePresenter {
    private order: Order;
    private contacts: Contacts;
    private successModal: SuccessModal;
    private modalManager: ModalManager;

    constructor(
        private paymentModal: HTMLElement,
        private contactsModal: HTMLElement,
        private successModalElement: HTMLElement,
        private successTemplate: HTMLTemplateElement,
        private basketPresenter: any, // BasketPresenter
        model: any
    ) {
        super(null, model);
        this.modalManager = ModalManager.getInstance();
    }

    protected init(): void {
        this.setupComponents();
        this.setupEventListeners();
    }

    private setupComponents(): void {
        this.order = new Order(this.paymentModal);
        this.contacts = new Contacts(this.contactsModal);

        this.successModal = new SuccessModal(
            this.successModalElement,
            this.successTemplate,
            this.basketPresenter.getBasket(),
            this.contactsModal,
            this.paymentModal,
            this.order,
            this.contacts,
            (modal) => this.modalManager.closeModal(modal),
            this.model
        );
    }

    private setupEventListeners(): void {
        // Обработчик для модального окна оплаты
        this.paymentModal.addEventListener('click', (e) => {
            this.handlePaymentModalClick(e);
        });

        // Обработчик для модального окна контактов
        this.contactsModal.addEventListener('click', (e) => {
            this.handleContactsModalClick(e);
        });
    }

    private handlePaymentModalClick(e: MouseEvent): void {
        const target = e.target as HTMLElement;

        // Выбор способа оплаты
        const paymentButton = target.closest<HTMLButtonElement>('.button_alt');
        if (paymentButton) {
            e.preventDefault();
            this.order.selectPaymentMethod(paymentButton);
            return;
        }

        // Кнопка "Далее"
        const nextButton = target.closest<HTMLButtonElement>('.order__button');
        if (nextButton) {
            e.preventDefault();
            if (!nextButton.hasAttribute('disabled') && this.order.validateAndProceed()) {
                this.modalManager.closeModal(this.paymentModal);
                this.modalManager.openModal(this.contactsModal);
            }
        }
    }

    private handleContactsModalClick(e: MouseEvent): void {
        const target = e.target as HTMLElement;

        // Обработка кнопки "Оплатить"
        const payButton = target.closest<HTMLButtonElement>('.modal__actions .button');
        if (payButton) {
            e.preventDefault();

            if (this.contacts.validateForm(true)) {
                this.modalManager.closeModal(this.contactsModal);
                this.successModal.show();
                this.contacts.resetForm();
            }
        }
    }
}