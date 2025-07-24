export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export type CategoryType =
	| 'софт-скил'
	| 'хард-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'другое';

export const settings = {
	// Настройки валидации
	validation: {
		email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		phone: /^\+?[\d\s\-\(\)]{7,}$/,
	},

	// Категории товаров и их классы
	categories: {
		'софт-скил': 'soft',
		'хард-скил': 'hard',
		'дополнительное': 'additional',
		'кнопка': 'button',
		'другое': 'other'
	} as Record<string, string>
};