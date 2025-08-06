/**
 * Модуль для работы с API
 * @module API
 */

/**
 * Тип ответа API для списка элементов
 * @typedef {Object} ApiListResponse
 * @property {number} total - Общее количество элементов
 * @property {Type[]} items - Массив элементов
 */
export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

/**
 * Тип HTTP методов для отправки данных
 * @typedef {'POST' | 'PUT' | 'DELETE'} ApiPostMethods
 */
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

/**
 * Базовый класс для работы с API
 * @class Api
 * @property {string} baseUrl - Базовый URL API
 * @property {RequestInit} options - Настройки запроса
 */
export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

		/**
		 * Конструктор класса Api
		 * @param {string} baseUrl - Базовый URL API
		 * @param {RequestInit} options - Настройки запроса
		 */
    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

		/**
		 * Обработчик ответа от сервера
		 * @protected
		 * @param {Response} response - Ответ сервера
		 * @returns {Promise<object>} Промис с данными ответа или ошибкой
		 */
    protected handleResponse(response: Response): Promise<object> {
        if (response.ok) return response.json();
        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }

		/**
		 * GET запрос
		 * @param {string} uri - URI ресурса
		 * @returns {Promise<object>} Промис с данными ответа
		 */
    get(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse);
    }

		/**
		 * POST/PUT/DELETE запрос
		 * @param {string} uri - URI ресурса
		 * @param {object} data - Данные для отправки
		 * @param {ApiPostMethods} [method='POST'] - HTTP метод
		 * @returns {Promise<object>} Промис с данными ответа
		 */
    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse);
    }
}
