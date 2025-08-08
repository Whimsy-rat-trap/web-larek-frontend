import { ModalView } from "./ModalView";
import { EventEmitter } from "../base/events";
import { ensureElement, cloneTemplate } from "../../utils/utils";
import { AppEvents } from "../../types/events";
import { ICartServiceForSuccess, IOrderResponse } from '../../types';
import { AppStateModal } from '../models/AppStateModal';

/**
 * Модальное окно успешного оформления заказа
 * @class SuccessModalView
 * @extends ModalView
 * @property {EventEmitter} eventEmitter - Эмиттер событий приложения
 * @property {ICartServiceForSuccess} cartService - Сервис корзины для получения данных
 */
export class SuccessModalView extends ModalView {
	/**
	 * Создает экземпляр SuccessModal
	 * @constructor
	 * @param {EventEmitter} eventEmitter - Эмиттер событий приложения
	 * @param {ICartServiceForSuccess} cartService - Сервис корзины
	 */
	constructor(
		protected eventEmitter: EventEmitter,
		private cartService: ICartServiceForSuccess
	) {
		super(eventEmitter);

		/**
		 * Подписка на событие открытия модального окна
		 * @listens AppEvents.MODAL_OPENED
		 */
		eventEmitter.on(AppEvents.MODAL_OPENED, (data: { type: string }) => {
			if (data.type === 'success') {
				this.renderSuccess();
			}
		});
	}

	/**
	 * Рендерит сообщение об успешном заказе
	 * @private
	 * @emits AppEvents.CART_CLEAR - После очистки корзины
	 * @emits AppEvents.MODAL_CLOSED - При закрытии модального окна
	 * @returns {void}
	 */
	private renderSuccess(): void {
		// Получаем шаблон и клонируем его
		const template = ensureElement<HTMLTemplateElement>('#success');
		const success = cloneTemplate(template);

		// Находим элементы в DOM
		const description = ensureElement<HTMLElement>('.order-success__description', success);
		const closeButton = ensureElement<HTMLButtonElement>('.order-success__close', success);

		// Устанавливаем сумму заказа
		const total = this.cartService.getTotalPrice();
		description.textContent = `Списано ${total} синапсов`;

		// Очищаем корзину
		this.cartService.clearCart();

		// Настраиваем обработчик закрытия
		closeButton.addEventListener('click', () => {
			this.close();
		});

		// Рендерим модальное окно
		this.render(success);
	}
}