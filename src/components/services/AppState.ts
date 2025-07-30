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
		basketTotal: 0,
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
		this.updateBasketTotal(); // Вызываем отдельный метод для обновления суммы
		this.events.emit(StateEvents.BASKET_UPDATED, {
			basket: this._state.basket,
			basketTotal: this._state.basketTotal
		});
		this.events.emit(AppEvents.CART_UPDATED);
	}

	/** Обновление суммы корзины */
	private updateBasketTotal(): void {
		this._state.basketTotal = this._state.basket.reduce((sum, item) => sum + (item.price || 0), 0);
	}

	/** Геттер для суммы корзины */
	get basketTotal(): number {
		return this._state.basketTotal;
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