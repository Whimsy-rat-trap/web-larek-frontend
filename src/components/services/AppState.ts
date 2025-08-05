import { EventEmitter } from "../base/events";
import { IAppState, IOrderFormState, IProduct, IValidationError, PaymentMethod } from '../../types';
import { AppEvents, StateEvents } from '../../types/events';

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

	constructor(private events: EventEmitter) {
		events.on(AppEvents.ORDER_PAYMENT_SET, (data: { method: PaymentMethod }) => {
			this.order = { payment: data.method };
		});

		events.on(AppEvents.ORDER_EMAIL_SET, (data: { email: string }) => {
			this.order = { email: data.email };
		});

		events.on(AppEvents.ORDER_PHONE_SET, (data: { phone: string }) => {
			this.order = { phone: data.phone }; // Исправлено: было data.email
		});

		events.on(AppEvents.ORDER_DELIVERY_SET, (data: { address: string }) => {
			this.order = { address: data.address };
		});
	}

	get state(): IAppState {
		return this._state;
	}

	set catalog(items: IProduct[]) {
		this._state.catalog = items;
		this.events.emit(StateEvents.CATALOG_UPDATED, {
			catalog: this._state.catalog
		});
	}

	set basket(items: IProduct[]) {
		this._state.basket = items;
		this.updateBasketTotal();
		this.events.emit(StateEvents.BASKET_UPDATED, {
			basket: this._state.basket,
			basketTotal: this._state.basketTotal
		});
		this.events.emit(AppEvents.BASKET_UPDATED);
	}

	private updateBasketTotal(): void {
		this._state.basketTotal = this._state.basket.reduce(
			(sum, item) => sum + (item.price || 0),
			0
		);
	}

	get basketTotal(): number {
		return this._state.basketTotal;
	}

	set order(form: Partial<IOrderFormState>) {
		this._state.order = {
			...this._state.order,
			...form,
			isValid: this.validateOrder(form),
			errors: this.validateOrderFields(form)
		};

		this.events.emit(StateEvents.ORDER_FORM_UPDATED, {
			order: this._state.order
		});
	}

	private validateOrder(form: Partial<IOrderFormState>): boolean {
		const newState = { ...this._state.order, ...form };
		return !!newState.address && !!newState.payment &&
			!!newState.email && !!newState.phone;
	}

	private validateOrderFields(form: Partial<IOrderFormState>): IValidationError[] {
		const errors: IValidationError[] = [];
		const newState = { ...this._state.order, ...form };

		if (!newState.address) {
			errors.push({ field: 'address', message: 'Введите адрес доставки' });
		}

		if (!newState.payment) {
			errors.push({ field: 'payment', message: 'Выберите способ оплаты' });
		}

		if (!newState.email) {
			errors.push({ field: 'email', message: 'Введите email' });
		}

		if (!newState.phone) {
			errors.push({ field: 'phone', message: 'Введите телефон' });
		}

		return errors;
	}

	set preview(id: string | null) {
		this._state.preview = id;
		this.events.emit(StateEvents.PREVIEW_UPDATED, {
			preview: this._state.preview
		});
	}
}