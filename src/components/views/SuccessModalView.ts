import { ensureElement, cloneTemplate } from "../../utils/utils";
import { AppEvents } from "../../types/events";
import { ICartServiceForSuccess, IOrderResponse } from '../../types';

/**
 * Модальное окно успешного оформления заказа
 * @class SuccessModalView
 * @extends ModalView
 * @property {EventEmitter} eventEmitter - Эмиттер событий приложения
 * @property {ICartServiceForSuccess} cartService - Сервис корзины для получения данных
 */
export class SuccessModalView {
	/**
	 * Создает экземпляр SuccessModal
	 * @constructor
	 * @param {EventEmitter} eventEmitter - Эмиттер событий приложения
	 * @param {ICartServiceForSuccess} cartService - Сервис корзины
	 */
	constructor(private onCloseClick: Function, private cartService: ICartServiceForSuccess) {
	///
	}

	/**
	 * Рендерит сообщение об успешном заказе
	 * @private
	 * @emits AppEvents.MODAL_CLOSED - При закрытии модального окна
	 * @returns {void}
	 */
	renderSuccess(total: number): HTMLElement {
		// Получаем шаблон и клонируем его
		const template = ensureElement<HTMLTemplateElement>('#success');
		const success = cloneTemplate(template);

		// Находим элементы в DOM
		const description = ensureElement<HTMLElement>('.order-success__description', success);
		const closeButton = ensureElement<HTMLButtonElement>('.order-success__close', success);

		description.textContent = `Списано ${total} синапсов`;

		// Очищаем корзину
		this.cartService.clearCart();

		// Настраиваем обработчик закрытия
		closeButton.addEventListener('click', () => {
			this.onCloseClick();
		});

		return success;
	}
}