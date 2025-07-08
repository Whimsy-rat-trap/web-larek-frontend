import { ensureElement } from "../utils/utils";

export class Order {
    private paymentMethod: string | null = null;
    private deliveryAddress: string | null = null;
    private formElement: HTMLFormElement;
    private nextButton: HTMLButtonElement; // Явно указываем тип
    private paymentButtons: NodeListOf<HTMLButtonElement>; // Явно указываем тип
    private addressInput: HTMLInputElement;
    private paymentHint: HTMLElement;
    private addressHint: HTMLElement;

    constructor(private modal: HTMLElement) {
        this.initializeForm();
        this.setupEventListeners();
        this.updateButtonState();
    }

    private initializeForm(): void {
        const existingForm = this.modal.querySelector('form[name="order"]');
        if (existingForm) {
            this.formElement = existingForm as HTMLFormElement;
        } else {
            const template = ensureElement<HTMLTemplateElement>('#order');
            const content = template.content.cloneNode(true) as DocumentFragment;
            this.modal.querySelector('.modal__content').innerHTML = '';
            this.modal.querySelector('.modal__content').appendChild(content);
            this.formElement = ensureElement<HTMLFormElement>('form[name="order"]', this.modal);
        }

        this.nextButton = ensureElement<HTMLButtonElement>('.order__button', this.formElement);
        this.paymentButtons = this.formElement.querySelectorAll<HTMLButtonElement>('.order__buttons .button_alt');
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.formElement);
			this.paymentHint = ensureElement<HTMLElement>('.hint-payment', this.formElement);
			this.addressHint = ensureElement<HTMLElement>('.hint-address', this.formElement);
    }

    private setupEventListeners(): void {
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.selectPaymentMethod(button);
                this.validateForm();
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.deliveryAddress = this.addressInput.value.trim();
            this.validateForm();
        });

        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateAndProceed();
        });
    }

    public selectPaymentMethod(selectedButton: HTMLButtonElement): void {
        this.paymentButtons.forEach(button => {
            button.classList.remove('button_alt_active');
        });

        selectedButton.classList.add('button_alt_active');
        this.paymentMethod = selectedButton.getAttribute('name');
        this.validateForm();
    }

    public validateForm(): boolean {
        let isValid = true;

        // Проверка способа оплаты
        if (!this.paymentMethod) {
            isValid = false;
            this.paymentHint.classList.add('active');
        } else {
            this.paymentHint.classList.remove('active');
        }

        // Проверка адреса
        if (!this.deliveryAddress) {
            isValid = false;
            this.addressHint.classList.add('active');
        } else {
            this.addressHint.classList.remove('active');
        }

        this.updateButtonState();
        return isValid;
    }

    public validateAndProceed(): boolean {
        const isValid = this.validateForm();
        return isValid;
    }

    private updateButtonState(): void {
        const isFormValid = !!this.paymentMethod && !!this.deliveryAddress;

        // Явно устанавливаем атрибут disabled
        if (isFormValid) {
            this.nextButton.removeAttribute('disabled');
            this.nextButton.classList.remove('button_alt-active');
        } else {
            this.nextButton.setAttribute('disabled', '');
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