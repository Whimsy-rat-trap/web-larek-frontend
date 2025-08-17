import { ensureElement, cloneTemplate } from '../../utils/utils';
import { IValidationError, PaymentMethod } from '../../types';

/**
 * Модальное окно оформления заказа
 * @class OrderView
 * @property {HTMLButtonElement} nextButton - Кнопка перехода к следующему шагу
 * @property {HTMLInputElement} addressInput - Поле ввода адреса
 * @property {HTMLElement} errorContainer - Контейнер для отображения ошибок
 * @property {HTMLButtonElement} onlinePaymentButton - Кнопка выбора онлайн-оплаты
 * @property {HTMLButtonElement} cashPaymentButton - Кнопка выбора оплаты при получении
 * @property {PaymentMethod|null} paymentSelected - Выбранный способ оплаты
 */
export class OrderView {
	private nextButton: HTMLButtonElement;
	private addressInput: HTMLInputElement;
	private errorContainer: HTMLElement;
	private onlinePaymentButton: HTMLButtonElement;
	private cashPaymentButton: HTMLButtonElement;
	private paymentSelected: PaymentMethod | null = null;

	/**
	 * Создает экземпляр OrderModal
	 * @constructor
	 * @param orderAddressInput
	 * @param orderPaymentMethodSet
	 * @param orderNextButtonClick
	 */
	constructor(
		private orderAddressInput: (address: string) => void,
		private orderPaymentMethodSet: (method: PaymentMethod) => void,
		private orderNextButtonClick: () => void
	) {}

	/**
	 * Рендерит форму оформления заказа
	 */
	render(
		payment: PaymentMethod,
		address: string,
		errors: IValidationError[]
	): HTMLElement {
		const template = ensureElement<HTMLTemplateElement>('#order');
		const form = cloneTemplate(template);

		this.addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			form
		);
		this.onlinePaymentButton = ensureElement<HTMLButtonElement>(
			'button[name="card"]',
			form
		);
		this.cashPaymentButton = ensureElement<HTMLButtonElement>(
			'button[name="cash"]',
			form
		);
		this.nextButton = ensureElement<HTMLButtonElement>('.order__button', form);
		this.errorContainer = ensureElement<HTMLElement>('.form__errors', form);

		this.paymentSelected = payment;
		this.addressInput.value = address;
		this.updatePaymentButtons();

		// Обработчики событий
		this.addressInput.addEventListener('input', () => {
			this.orderAddressInput(this.addressInput.value);
		});

		this.onlinePaymentButton.addEventListener('click', () => {
			this.paymentSelected = 'online';
			this.updatePaymentButtons();
			this.orderPaymentMethodSet('online');
		});

		this.cashPaymentButton.addEventListener('click', () => {
			this.paymentSelected = 'cash';
			this.updatePaymentButtons();
			this.orderPaymentMethodSet('cash');
		});

		this.nextButton.addEventListener('click', (event) => {
			event.preventDefault();
			this.orderNextButtonClick();
		});

		this.showErrors(errors);
		this.nextButton.disabled = errors.length > 0;

		return form;
	}

	/**
	 * Обновляет состояние кнопок выбора способа оплаты
	 * @private
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
	 * Отображает сообщение об ошибке
	 * @private
	 * @param errors - список ошибок
	 */
	private showErrors(errors: IValidationError[]): void {
		this.errorContainer.innerHTML = '';
		errors.forEach((error) => {
			const errorElement = document.createElement('div');
			errorElement.className = `form__error`;
			errorElement.textContent = error.message;
			this.errorContainer.appendChild(errorElement);
		});
	}
}
