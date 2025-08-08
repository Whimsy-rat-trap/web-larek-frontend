import { ModalView } from "./ModalView";
import { EventEmitter } from "../base/events";
import { ensureElement, cloneTemplate } from "../../utils/utils";
import { AppEvents } from "../../types/events";
import { settings } from '../../utils/constants';

/**
 * Модальное окно для ввода контактных данных
 * @class ContactsModalView
 * @extends ModalView
 * @property {HTMLButtonElement} submitButton - Кнопка отправки формы
 * @property {HTMLInputElement} emailInput - Поле ввода email
 * @property {HTMLInputElement} phoneInput - Поле ввода телефона
 * @property {HTMLElement} errorContainer - Контейнер для отображения ошибок
 * @property {boolean} emailEntered - Флаг валидности email
 * @property {boolean} phoneEntered - Флаг валидности телефона
 */
export class ContactsModalView extends ModalView {
	private submitButton: HTMLButtonElement;
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;
	private errorContainer: HTMLElement;
	private emailEntered = false;
	private phoneEntered = false;

	/**
	 * Конструктор класса ContactsModal
	 * @constructor
	 * @param {EventEmitter} eventEmitter - Эмиттер событий приложения
	 */
	constructor(
		eventEmitter: EventEmitter,
	) {
		super(eventEmitter);
		eventEmitter.on(AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED, () => this.renderContactsForm());
	}

	/**
	 * Рендерит форму ввода контактных данных
	 * @private
	 * @emits AppEvents.ORDER_EMAIL_SET - При изменении email
	 * @emits AppEvents.UI_ORDER_INPUT_PHONE_CHANGED - При изменении телефона
	 * @emits AppEvents.ORDER_PHONE_SET - При изменении телефона
	 * @emits AppEvents.UI_ORDER_BUTTON_PAY_CLICKED - При клике на оплату
	 * @emits AppEvents.ORDER_READY - При готовности заказа
	 */
	private renderContactsForm(): void {
		const template = ensureElement<HTMLTemplateElement>('#contacts');
		const form = cloneTemplate(template);

		this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', form);
		this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', form);
		this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', form);
		this.errorContainer = ensureElement<HTMLElement>('.form__errors', form);

		// Обработчики событий
		this.emailInput.addEventListener('input', () => {
			const email = this.emailInput.value.trim();
			this.emailEntered = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
			this.eventEmitter.emit(AppEvents.ORDER_EMAIL_SET, { email });
			this.updateValidationState();
		});

		this.phoneInput.addEventListener('input', () => {
			// Ограничиваем ввод только цифрами и +
			let value = this.phoneInput.value.replace(/[^0-9+]/g, '');

			// Обеспечиваем, чтобы + был только в начале
			if (value.includes('+')) {
				value = '+' + value.replace(/\+/g, '');
			}

			// Ограничиваем длину (1 символ + и 11 цифр)
			if (value.length > 12) {
				value = value.substring(0, 12);
			}

			this.phoneInput.value = value;

			this.phoneEntered = /^\+[0-9]{11}$/.test(value);
			this.eventEmitter.emit(AppEvents.UI_ORDER_INPUT_PHONE_CHANGED, {
				value: this.phoneInput.value
			});
			this.eventEmitter.emit(AppEvents.ORDER_PHONE_SET, { phone: value });
			this.updateValidationState();
		});

		form.addEventListener('submit', (event) => {
			event.preventDefault();
			if (this.isFormValid()) {
				this.eventEmitter.emit(AppEvents.UI_ORDER_BUTTON_PAY_CLICKED);
			}
		});

		super.render(form);
	}

	/**
	 * Обновляет состояние валидации формы
	 * @private
	 */
	private updateValidationState(): void {
		this.errorContainer.innerHTML = '';

		if (this.emailEntered && !this.phoneEntered) {
			this.showError('phone', 'Необходимо ввести телефон');
		} else if (this.phoneEntered && !this.emailEntered) {
			this.showError('email', 'Необходимо ввести email');
		} else if (!this.emailEntered && !this.phoneEntered) {
			this.errorContainer.innerHTML = '';
		}

		this.submitButton.disabled = !this.isFormValid();
	}

	/**
	 * Проверяет валидность формы
	 * @private
	 * @returns {boolean} Возвращает true если форма валидна
	 */
	private isFormValid(): boolean {
		return this.emailEntered && this.phoneEntered;
	}

	/**
	 * Отображает сообщение об ошибке
	 * @private
	 * @param {string} field - Поле с ошибкой
	 * @param {string} message - Текст ошибки
	 */
	private showError(field: string, message: string): void {
		this.errorContainer.innerHTML = '';
		const errorElement = document.createElement('div');
		errorElement.className = `form__error`;
		errorElement.textContent = message;
		this.errorContainer.appendChild(errorElement);
	}
}