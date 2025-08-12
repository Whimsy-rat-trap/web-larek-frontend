import { ensureElement, cloneTemplate } from "../../utils/utils";
import { AppEvents } from "../../types/events";
import { PaymentMethod } from "../../types";

/**
 * Модальное окно оформления заказа
 * @class OrderModalView
 * @extends ModalView
 * @property {HTMLButtonElement} nextButton - Кнопка перехода к следующему шагу
 * @property {HTMLInputElement} addressInput - Поле ввода адреса
 * @property {HTMLElement} errorContainer - Контейнер для отображения ошибок
 * @property {HTMLButtonElement} onlinePaymentButton - Кнопка выбора онлайн-оплаты
 * @property {HTMLButtonElement} cashPaymentButton - Кнопка выбора оплаты при получении
 * @property {PaymentMethod|null} paymentSelected - Выбранный способ оплаты
 * @property {boolean} addressEntered - Флаг заполнения адреса
 */
export class OrderModalView {
	private nextButton: HTMLButtonElement;
	private addressInput: HTMLInputElement;
	private errorContainer: HTMLElement;
	private onlinePaymentButton: HTMLButtonElement;
	private cashPaymentButton: HTMLButtonElement;
	private paymentSelected: PaymentMethod | null = null;
	private addressEntered = false;

	/**
	 * Создает экземпляр OrderModal
	 * @constructor
	 * @param {EventEmitter} eventEmitter - Эмиттер событий приложения
	 * @listens AppEvents.ORDER_INITIATED - Событие инициализации заказа
	 */
	constructor(private orderAddressInput: Function, private orderPaymentMethodSet: Function, private orderNextButtonClick: Function) {
	///
	}

	/**
	 * Рендерит форму оформления заказа
	 * @private
	 * @emits AppEvents.ORDER_DELIVERY_SET - При изменении адреса доставки
	 * @emits AppEvents.UI_ORDER_BUTTON_PAYMENT_SET - При изменении способа оплаты
	 * @emits AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED - При клике на кнопку "Далее"
	 */
	renderOrderForm(): HTMLElement {
		const template = ensureElement<HTMLTemplateElement>('#order');
		const form = cloneTemplate(template);

		this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', form);
		this.onlinePaymentButton = ensureElement<HTMLButtonElement>('button[name="card"]', form);
		this.cashPaymentButton = ensureElement<HTMLButtonElement>('button[name="cash"]', form);
		this.nextButton = ensureElement<HTMLButtonElement>('.order__button', form);
		this.errorContainer = ensureElement<HTMLElement>('.form__errors', form);

		// Обработчики событий
		this.addressInput.addEventListener('input', () => {
			this.addressEntered = this.addressInput.value.trim().length > 0;
			this.orderAddressInput(this.addressInput.value);
			this.updateValidationState();
		});

		this.onlinePaymentButton.addEventListener('click', () => {
			this.paymentSelected = 'online';
			this.updatePaymentButtons();
			this.orderPaymentMethodSet('online');
			this.updateValidationState();
		});

		this.cashPaymentButton.addEventListener('click', () => {
			this.paymentSelected = 'cash';
			this.updatePaymentButtons();
			this.orderPaymentMethodSet('cash');
			this.updateValidationState();
		});

		this.nextButton.addEventListener('click', (event) => {
			event.preventDefault();
			if (this.isFormValid()) {
				this.orderNextButtonClick();
			}
		});

		return form;
	}

	/**
	 * Обновляет состояние кнопок выбора способа оплаты
	 * @private
	 * @emits AppEvents.UI_ORDER_BUTTON_PAYMENT_SET - При изменении способа оплаты
	 */
	private updatePaymentButtons(): void {
		this.onlinePaymentButton.classList.remove('button_alt-active');
		this.cashPaymentButton.classList.remove('button_alt-active');

		if (this.paymentSelected === 'online') {
			this.onlinePaymentButton.classList.add('button_alt-active');
		} else if (this.paymentSelected === 'cash') {
			this.cashPaymentButton.classList.add('button_alt-active');
		}
	}

	/**
	 * Обновляет состояние валидации формы
	 * @private
	 */
	private updateValidationState(): void {
		this.errorContainer.innerHTML = '';

		if (this.paymentSelected && !this.addressEntered) {
			this.showError('address', 'Необходимо ввести адрес');
		} else if (this.addressEntered && !this.paymentSelected) {
			this.showError('payment', 'Необходимо выбрать способ оплаты');
		} else if (!this.paymentSelected && !this.addressEntered) {
			this.errorContainer.innerHTML = '';
		}

		this.nextButton.disabled = !this.isFormValid();
	}

	/**
	 * Проверяет валидность формы
	 * @private
	 * @returns {boolean} True если форма валидна, иначе False
	 */
	private isFormValid(): boolean {
		return !!this.paymentSelected && this.addressEntered;
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