import { ensureElement } from "../../utils/utils";

export class ContactsView {
    private formElement: HTMLFormElement;
    private submitButton: HTMLButtonElement;
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;
    private emailHint: HTMLElement;
    private phoneHint: HTMLElement;

    constructor(private modal: HTMLElement) {
        this.initializeForm();
        this.setupEventListeners();
        this.updateButtonState();
    }

    private initializeForm(): void {
        const existingForm = this.modal.querySelector('form[name="contacts"]');
        if (existingForm) {
            this.formElement = existingForm as HTMLFormElement;
        } else {
            const template = ensureElement<HTMLTemplateElement>('#contacts');
            const content = template.content.cloneNode(true) as DocumentFragment;
            this.modal.querySelector('.modal__content').innerHTML = '';
            this.modal.querySelector('.modal__content').appendChild(content);
            this.formElement = ensureElement<HTMLFormElement>('form[name="contacts"]', this.modal);
        }

        this.submitButton = ensureElement<HTMLButtonElement>('.modal__actions .button', this.formElement);
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.formElement);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.formElement);
        this.emailHint = ensureElement<HTMLElement>('.hint-email', this.formElement);
        this.phoneHint = ensureElement<HTMLElement>('.hint-phone', this.formElement);

        // Валидация полей
        this.emailInput.required = true;
        this.emailInput.pattern = "[^@\\s]+@[^@\\s]+\\.[^@\\s]+";
        this.phoneInput.required = true;
        this.phoneInput.pattern = "^\\+?[0-9\\s\\-\\(\\)]+$";
    }

    private setupEventListeners(): void {
        this.emailInput.addEventListener('input', () => {
            this.validateField(this.emailInput);
            this.updateButtonState();
        });

        this.phoneInput.addEventListener('input', () => {
            this.validateField(this.phoneInput);
            this.updateButtonState();
        });

        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateAndProceed();
        });
    }

    public validateAndProceed(): boolean {
        const isValid = this.validateForm(true);
        return isValid;
    }

    public validateForm(forceShowErrors = false): boolean {
        const isEmailValid = this.validateField(this.emailInput, forceShowErrors);
        const isPhoneValid = this.validateField(this.phoneInput, forceShowErrors);

        this.updateButtonState();
        return isEmailValid && isPhoneValid;
    }

    private validateField(input: HTMLInputElement, forceShowError = false): boolean {
        const isValid = input.checkValidity();
        const hasValue = !!input.value.trim();

        // Получаем соответствующий элемент подсказки
        const hintElement = input === this.emailInput
            ? this.emailHint
            : this.phoneHint;

        // Показываем подсказку если:
        // 1. Принудительно показать ошибки (при отправке) ИЛИ
        // 2. Поле было изменено (hasValue) И оно невалидно
        const shouldShowHint = !isValid && (forceShowError || hasValue);
        hintElement.classList.toggle('active', shouldShowHint);

        // Добавляем/убираем класс ошибки для поля ввода
        input.classList.toggle('invalid', !isValid && (forceShowError || hasValue));

        return isValid;
    }

    private updateButtonState(): void {
        const isEmailValid = this.emailInput.checkValidity();
        const isPhoneValid = this.phoneInput.checkValidity();
        const isFormValid = isEmailValid && isPhoneValid;

        this.submitButton.disabled = !isFormValid;
        this.submitButton.classList.toggle('button_alt-active', !isFormValid);
    }

    public getContactsData(): { email: string; phone: string } {
        return {
            email: this.emailInput.value,
            phone: this.phoneInput.value
        };
    }

    public resetForm(): void {
        this.formElement.reset();
        this.emailHint.classList.remove('active');
        this.phoneHint.classList.remove('active');
        this.updateButtonState();
    }
}