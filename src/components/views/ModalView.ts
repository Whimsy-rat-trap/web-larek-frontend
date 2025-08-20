import { EventEmitter } from "../base/events";
import { ensureElement } from "../../utils/utils";

/**
 * Базовый класс модального окна
 * @class ModalView
 * @property {HTMLElement} container - Основной контейнер модального окна
 * @property {HTMLElement} content - Контейнер для содержимого модального окна
 * @property {HTMLElement} closeButton - Кнопка закрытия модального окна
 * @property {EventEmitter} eventEmitter - Эмиттер событий приложения
 */
export class ModalView {
	/**
	 * Контейнер для содержимого модального окна
	 * @protected
	 * @type {HTMLElement}
	 */
	protected content: HTMLElement;

	/**
	 * Кнопка закрытия модального окна
	 * @protected
	 * @type {HTMLElement}
	 */
	protected closeButton: HTMLElement;

	/**
	 * Создает экземпляр Modal
	 * @constructor
	 * @param container - Контейнер модального окна
	 * @param {EventEmitter} eventEmitter - Эмиттер событий приложения
	 */
	constructor(private container: HTMLElement, protected eventEmitter: EventEmitter) {
		this.content = ensureElement<HTMLElement>('.modal__content', this.container);
		this.closeButton = ensureElement<HTMLElement>('.modal__close', this.container);

		/**
		 * Обработчик клика по кнопке закрытия
		 * @private
		 */
		this.closeButton.addEventListener('click', this.close.bind(this));

		/**
		 * Обработчик клика по оверлею для закрытия
		 * @private
		 */
		this.container.addEventListener('click', (event) => {
			if (event.target === this.container) {
				this.close();
			}
		});
	}

	/**
	 * Открывает модальное окно
	 * @public
	 * @returns {void}
	 *
	 * @example
	 * // Открытие модального окна
	 * modal.open();
	 */
	open(): void {
		this.container.classList.add('modal_active');
	}

	/**
	 * Закрывает модальное окно
	 * @public
	 * @returns {void}
	 *
	 * @example
	 * // Закрытие модального окна
	 * modal.close();
	 */
	close(): void {
		this.container.classList.remove('modal_active');
	}

	/**
	 * Отображает содержимое в модальном окне и открывает его
	 * @public
	 * @param {HTMLElement} content - DOM-элемент для отображения в модальном окне
	 * @returns {void}
	 *
	 * @example
	 * // Рендер содержимого в модальном окне
	 * const content = document.createElement('div');
	 * content.textContent = 'Hello World';
	 * modal.render(content);
	 */
	render(content: HTMLElement): void {
		this.content.replaceChildren(content);
		this.open();
	}
}