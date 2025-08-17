import { ensureElement, cloneTemplate } from '../../utils/utils';

/**
 * Модальное окно успешного оформления заказа
 * @class SuccessView
 * @extends ModalView
 */
export class SuccessView {
	/**
	 * Создает экземпляр SuccessView
	 * @constructor
	 * @param onCloseClick
	 */
	constructor(private onCloseClick: () => void) {}

	/**
	 * Рендерит сообщение об успешном заказе
	 * @private
	 * @emits AppEvents.MODAL_CLOSED - При закрытии модального окна
	 * @returns {void}
	 */
	render(total: number): HTMLElement {
		// Получаем шаблон и клонируем его
		const template = ensureElement<HTMLTemplateElement>('#success');
		const success = cloneTemplate(template);

		// Находим элементы в DOM
		const description = ensureElement<HTMLElement>(
			'.order-success__description',
			success
		);
		const closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			success
		);

		description.textContent = `Списано ${total} синапсов`;

		// Настраиваем обработчик закрытия
		closeButton.addEventListener('click', () => {
			this.onCloseClick();
		});

		return success;
	}
}
