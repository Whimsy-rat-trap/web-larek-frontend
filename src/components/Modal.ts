import { EventEmitter } from "./base/events";
import { ensureElement } from "../utils/utils";

export class Modal {
	protected container: HTMLElement;
	protected content: HTMLElement;
	protected closeButton: HTMLElement;

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

	open(): void {
		this.container.classList.add('modal_active');
	}

	close(): void {
		this.container.classList.remove('modal_active');
	}

	render(content: HTMLElement): void {
		this.content.replaceChildren(content);
		this.open();
	}
}