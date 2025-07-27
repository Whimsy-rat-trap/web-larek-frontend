import { EventEmitter } from "../base/events";
import { IAppState, IProduct, IOrderFormState } from "../../types";
import { AppEvents, StateEvents } from '../../types/events';

/**
 * Сервис управления состоянием приложения
 * @class AppState
 * @property {IAppState} state - Текущее состояние приложения
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

	/** Получение текущего состояния */
	get state(): IAppState {
		return this._state;
	}

	/** Обновление каталога товаров */
	set catalog(items: IProduct[]) {
		this._state.catalog = items;
		this.events.emit(StateEvents.CATALOG_UPDATED, {
			catalog: this._state.catalog
		});
	}

	/** Обновление корзины */
	set basket(items: IProduct[]) {
		this._state.basket = items;
		this.events.emit(StateEvents.BASKET_UPDATED, {
			basket: this._state.basket
		});
		// Эмитим событие обновления корзины
		this.events.emit(AppEvents.CART_UPDATED);
	}

	/** Обновление состояния заказа */
	set order(form: Partial<IOrderFormState>) {
		this._state.order = {
			...this._state.order,
			...form,
			isValid: this.validateOrder(form)
		};
		this.events.emit(StateEvents.ORDER_FORM_UPDATED, {
			order: this._state.order
		});
	}

	private validateOrder(form: Partial<IOrderFormState>): boolean {
		return !!form.address && !!form.payment &&
			!!form.email && !!form.phone;
	}

	/** Обновление превью товара */
	set preview(id: string | null) {
		this._state.preview = id;
		this.events.emit(StateEvents.PREVIEW_UPDATED, {
			preview: this._state.preview
		});
	}
}