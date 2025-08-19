/**
 * Модуль работы с событиями
 * @module Events
 */


/**
 * Тип имени события
 * @typedef {string | RegExp} EventName
 */
type EventName = string | RegExp;

/**
 * Тип подписчика на событие
 * @typedef {Function} Subscriber
 */
type Subscriber = Function;

/**
 * Тип данных события
 * @typedef {Object} EmitterEvent
 * @property {string} eventName - Имя события
 * @property {unknown} data - Данные события
 */
type EmitterEvent = {
    eventName: string,
    data: unknown
};

/**
 * Интерфейс работы с событиями
 * @interface IEvents
 */
export interface IEvents {
	/**
	 * Подписка на событие
	 * @template T
	 * @param {EventName} event - Имя события или регулярное выражение
	 * @param {(data: T) => void} callback - Колбек обработчик
	 */
    on<T extends object>(event: EventName, callback: (data: T) => void): void;

		/**
		 * Генерация события
		 * @template T
		 * @param {string} event - Имя события
		 * @param {T} [data] - Данные события
		 */
    emit<T extends object>(event: string, data?: T): void;

		/**
		 * Создание триггера события
		 * @template T
		 * @param {string} event - Имя события
		 * @param {Partial<T>} [context] - Контекстные данные
		 * @returns {(data: T) => void} Функция-триггер
		 */
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}


/**
 * Брокер событий, классическая реализация
 * @class EventEmitter
 * @implements {IEvents}
 */
export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;

		/**
		 * Конструктор EventEmitter
		 */
    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }

		/**
		 * Подписка на событие
		 * @template T
		 * @param {EventName} eventName - Имя события или регулярное выражение
		 * @param {(event: T) => void} callback - Колбек обработчик
		 */
    on<T extends object>(eventName: EventName, callback: (event: T) => void) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        this._events.get(eventName)?.add(callback);
    }

		/**
		 * Отписка от события
		 * @param {EventName} eventName - Имя события или регулярное выражение
		 * @param {Subscriber} callback - Колбек обработчик
		 */
    off(eventName: EventName, callback: Subscriber) {
        if (this._events.has(eventName)) {
            this._events.get(eventName)!.delete(callback);
            if (this._events.get(eventName)?.size === 0) {
                this._events.delete(eventName);
            }
        }
    }

		/**
		 * Генерация события
		 * @template T
		 * @param {string} eventName - Имя события
		 * @param {T} [data] - Данные события
		 */
    emit<T extends object>(eventName: string, data?: T) {
				console.log(eventName, data);
        this._events.forEach((subscribers, name) => {
            if (name === '*') subscribers.forEach(callback => callback({
                eventName,
                data
            }));
            if (name instanceof RegExp && name.test(eventName) || name === eventName) {
                subscribers.forEach(callback => callback(data));
            }
        });
    }

		/**
		 * Подписка на все события
		 * @param {(event: EmitterEvent) => void} callback - Колбек обработчик
		 */
    onAll(callback: (event: EmitterEvent) => void) {
        this.on("*", callback);
    }

		/**
		 * Отписка от всех событий
		 */
    offAll() {
        this._events = new Map<string, Set<Subscriber>>();
    }

		/**
		 * Создание триггера события
		 * @template T
		 * @param {string} eventName - Имя события
		 * @param {Partial<T>} [context] - Контекстные данные
		 * @returns {(data: T) => void} Функция-триггер
		 */
    trigger<T extends object>(eventName: string, context?: Partial<T>) {
        return (event: object = {}) => {
            this.emit(eventName, {
                ...(event || {}),
                ...(context || {})
            });
        };
    }
}

