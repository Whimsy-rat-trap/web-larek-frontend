import { EventEmitter } from "./base/events";
import { ensureElement } from "../utils/utils";

/**
 * Базовый класс модального окна
 * @class Modal
 * @property {HTMLElement} container - Контейнер модального окна
 * @property {HTMLElement} content - Контейнер содержимого модального окна
 * @property {HTMLElement} closeButton - Кнопка закрытия модального окна
 */
export class Modal {
	protected container: HTMLElement;
	protected content: HTMLElement;
	protected closeButton: HTMLElement;

	/**
	 * Создает экземпляр Modal
	 * @constructor
	 * @param {EventEmitter} eventEmitter - Эмиттер событий приложения
	 * @param {string} [containerId='modal-container'] - ID контейнера модального окна
	 */
	constructor(protected eventEmitter: EventEmitter, containerId = 'modal-container') {
		this.container = ensureElement<HTMLElement>(`#${containerId}`);
		this.content = ensureElement<HTMLElement>('.modal__content', this.container);
		this.closeButton = ensureElement<HTMLElement>('.modal__close', this.container);

		this.closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', (event) => {
			if (event.target === this.container) {
				this.close();
			}
		});
	}

	/**
	 * Открывает модальное окно
	 * @public
	 */
	open(): void {
		this.container.classList.add('modal_active');
	}

	/**
	 * Закрывает модальное окно
	 * @public
	 */
	close(): void {
		this.container.classList.remove('modal_active');
	}

	/**
	 * Отображает содержимое в модальном окне
	 * @public
	 * @param {HTMLElement} content - DOM-элемент для отображения
	 */
	render(content: HTMLElement): void {
		this.content.replaceChildren(content);
		this.open();
	}
}