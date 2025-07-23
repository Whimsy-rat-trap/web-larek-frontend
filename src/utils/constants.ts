export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
	// Настройки валидации
	validation: {
		email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		phone: /^\+?[\d\s\-\(\)]{7,}$/,
	},

	// Категории товаров и их классы
	categories: {
		'софт-скил': 'soft',
		'другое': 'other',
		'дополнительное': 'additional',
		'кнопка': 'button',
		'хард-скил': 'hard'
	}
};