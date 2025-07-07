import { ensureElement } from "../utils/utils";
import { Product } from "../types";

export class Order {
    private paymentMethod: string | null = null;
    private deliveryAddress: string | null = null;
    private formElement: HTMLFormElement;
    private nextButton: HTMLButtonElement;
    private errorsElement: HTMLElement;
    private paymentButtons: NodeListOf<HTMLButtonElement>;
    private addressInput: HTMLInputElement;

    constructor(private modal: HTMLElement) {
        this.initializeForm();
        this.setupEventListeners();
        this.nextButton.disabled = true;
        this.nextButton.classList.add('button_alt-active');
        this.updateButtonState();
    }

    private initializeForm(): void {
        // Проверяем, есть ли уже форма в модальном окне
        const existingForm = this.modal.querySelector('form[name="order"]');
        if (existingForm) {
            this.formElement = existingForm as HTMLFormElement;
        } else {
            // Если формы нет - создаем из шаблона
            const template = ensureElement<HTMLTemplateElement>('#order');
            const content = template.content.cloneNode(true) as DocumentFragment;
            this.modal.querySelector('.modal__content').appendChild(content);
            this.formElement = ensureElement<HTMLFormElement>('form[name="order"]', this.modal);
        }

        this.nextButton = ensureElement<HTMLButtonElement>('.order__button', this.formElement);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.formElement);
        this.paymentButtons = this.formElement.querySelectorAll('.order__buttons .button_alt');
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.formElement);
    }

    private setupEventListeners(): void {
        // Обработчики для кнопок оплаты
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.selectPaymentMethod(button);
            });
        });

        // Обработчик поля адреса
        this.addressInput.addEventListener('input', () => {
            this.deliveryAddress = this.addressInput.value.trim();
            this.clearErrors();
            this.updateButtonState();
        });

        // Обработчик отправки формы
        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateForm();
        });
    }

    public selectPaymentMethod(selectedButton: HTMLButtonElement): void {
        // Снимаем выделение со всех кнопок
        this.paymentButtons.forEach(button => {
            button.classList.remove('button_alt_active');
        });

        // Выделяем выбранную кнопку
        selectedButton.classList.add('button_alt_active');
        this.paymentMethod = selectedButton.getAttribute('name');
        this.clearError('payment');
        this.updateButtonState();
    }

    public validateForm(): boolean {
        this.clearErrors();
        let isValid = true;

        if (!this.paymentMethod) {
            this.showError('Необходимо выбрать вид оплаты');
            isValid = false;
        }

        if (!this.deliveryAddress) {
            this.showError('Необходимо указать адрес доставки');
            isValid = false;
        }

        return isValid;
    }

    private clearErrors(): void {
        this.errorsElement.textContent = '';
    }

    private showError(message: string): void {
        const errorElement = document.createElement('div');
        errorElement.textContent = message;
        errorElement.style.color = 'red';
        errorElement.style.marginTop = '10px';
        this.errorsElement.appendChild(errorElement);
    }

    private clearError(type: 'payment' | 'address'): void {
        this.errorsElement.textContent = '';
    }

    private updateButtonState(): void {
        const isFormValid = !!this.paymentMethod && !!this.deliveryAddress;
        this.nextButton.disabled = !isFormValid;

        // Обновляем стили
        if (isFormValid) {
            this.nextButton.classList.remove('button_alt-active');
        } else {
            this.nextButton.classList.add('button_alt-active');
        }
    }

    public getOrderData(): { payment: string | null; address: string | null } {
        return {
            payment: this.paymentMethod,
            address: this.deliveryAddress
        };
    }
}