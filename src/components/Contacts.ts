// contacts.ts
import { ensureElement } from "../utils/utils";

export class Contacts {
    private email: string | null = null;
    private phone: string | null = null;
    private formElement: HTMLFormElement;
    private submitButton: HTMLButtonElement;
    private errorsElement: HTMLElement;
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;

    constructor(private modal: HTMLElement) {
        // Проверяем, есть ли уже форма в модальном окне
        const existingForm = this.modal.querySelector('form[name="contacts"]');
        if (existingForm) {
            this.formElement = existingForm as HTMLFormElement;
        } else {
            // Если формы нет - создаем из шаблона
            const template = ensureElement<HTMLTemplateElement>('#contacts');
            const content = template.content.cloneNode(true) as DocumentFragment;
            this.modal.querySelector('.modal__content').innerHTML = ''; // Очищаем перед добавлением
            this.modal.querySelector('.modal__content').appendChild(content);
            this.formElement = ensureElement<HTMLFormElement>('form[name="contacts"]', this.modal);
        }

        this.initializeElements();
        this.setupEventListeners();
        this.updateButtonState();
    }

    private initializeElements(): void {
        this.submitButton = ensureElement<HTMLButtonElement>('.modal__actions .button', this.formElement);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.formElement);
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.formElement);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.formElement);
    }

    private setupEventListeners(): void {
        // Обработчик поля email
        this.emailInput.addEventListener('input', () => {
            this.email = this.emailInput.value.trim();
            this.clearErrors();
            this.updateButtonState();
        });

        // Обработчик поля телефона
        this.phoneInput.addEventListener('input', () => {
            this.phone = this.phoneInput.value.trim();
            this.clearErrors();
            this.updateButtonState();
        });

        // Обработчик отправки формы
        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateForm();
        });
    }

    public validateForm(): boolean {
        this.clearErrors();
        let isValid = true;

        if (!this.email) {
            this.showError('Необходимо указать почту');
            isValid = false;
        }

        if (!this.phone) {
            this.showError('Необходимо указать номер телефона');
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

    private updateButtonState(): void {
        const isFormValid = !!this.email && !!this.phone;
        this.submitButton.disabled = !isFormValid;

        // Обновляем стили кнопки
        if (isFormValid) {
            this.submitButton.classList.remove('button_alt-active');
        } else {
            this.submitButton.classList.add('button_alt-active');
        }
    }

    public getContactsData(): { email: string | null; phone: string | null } {
        return {
            email: this.email,
            phone: this.phone
        };
    }

    public resetForm(): void {
        this.email = null;
        this.phone = null;
        this.emailInput.value = '';
        this.phoneInput.value = '';
        this.clearErrors();
        this.updateButtonState();
    }
}