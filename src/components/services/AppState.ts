import { EventEmitter } from "../base/events";
import { IAppState, IProduct, IOrderFormState } from "../../types";

/**
 * Сервис управления состоянием приложения
 */
export class AppState {
	private _state: IAppState = {
		catalog: [],
		basket: [],
		order: {
			payment: null,
			address: '',
			email: '',
			phone: '',
			isValid: false,
			errors: []
		},
		preview: null
	};

	constructor(private events: EventEmitter) {}

	// Получение текущего состояния
	get state(): IAppState {
		return this._state;
	}

	// Обновление каталога товаров
	set catalog(items: IProduct[]) {
		this._state.catalog = items;
		this.events.emit('state:catalog:updated', this._state.catalog);
	}

	// Обновление корзины
	set basket(items: string[]) {
		this._state.basket = items;
		this.events.emit('state:basket:updated', this._state.basket);
	}

	// Обновление состояния заказа
	set order(form: Partial<IOrderFormState>) {
		this._state.order = { ...this._state.order, ...form };
		this.events.emit('state:order:updated', this._state.order);
	}

	// Обновление превью товара
	set preview(id: string | null) {
		this._state.preview = id;
		this.events.emit('state:catalog:updated', { catalog: this._state.catalog });
	}
}