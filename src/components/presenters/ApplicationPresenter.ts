import { BasePresenter } from '../base/BasePresenter';
import { CatalogPresenter } from './CatalogPresenter';
import { BasketPresenter } from './BasketPresenter';
import { OrderPresenter } from './OrderPresenter';
import { ModalManager } from '../views/ModalManager';
import { ensureElement } from '../../utils/utils';
import { AppData } from '../models/AppData';
import * as console from 'node:console';

export class ApplicationPresenter extends BasePresenter<null, AppData> {
	private productPresenter: CatalogPresenter;
	private basketPresenter: BasketPresenter;
	private orderPresenter: OrderPresenter;
	private modalManager: ModalManager;

	constructor(model: AppData) {
		super(null, model, null);
	}

	protected init(): void {
		this.modalManager = ModalManager.getInstance();
		this.setupPresenters();
		this.modalManager.setupCloseHandlers();
	}

	private setupPresenters(): void {
		// Получаем все необходимые DOM элементы
		const galleryContainer = ensureElement<HTMLElement>('.gallery');
		const productModal = ensureElement<HTMLElement>('#product-modal');
		const basketModal = ensureElement<HTMLElement>('#basket-modal');
		const paymentModal = ensureElement<HTMLElement>('#payment-modal');
		const contactsModal = ensureElement<HTMLElement>('#contacts-modal');
		const successModalElement = ensureElement<HTMLElement>('#success-modal');

		const cardCatalogTemplate =
			ensureElement<HTMLTemplateElement>('#card-catalog');
		const cardPreviewTemplate =
			ensureElement<HTMLTemplateElement>('#card-preview');
		const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
		const basketItemTemplate =
			ensureElement<HTMLTemplateElement>('#card-basket');
		const successTemplate = ensureElement<HTMLTemplateElement>('#success');
		const basketCounter = ensureElement<HTMLElement>('.header__basket-counter');

		// Создаем презентеры
		this.productPresenter = new CatalogPresenter(
			galleryContainer,
			productModal,
			cardCatalogTemplate,
			cardPreviewTemplate,
			this.model.catalog
		);

		this.basketPresenter = new BasketPresenter(
			basketModal,
			paymentModal,
			basketTemplate,
			basketItemTemplate,
			basketCounter,
			this.model.basket
		);

		this.orderPresenter = new OrderPresenter(
			paymentModal,
			contactsModal,
			successModalElement,
			successTemplate,
			this.basketPresenter,
			this.model.order
		);
	}

	public async initialize(): Promise<void> {
		try {
			await this.productPresenter.initialize();
		} catch (error) {
			console.error('Ошибка инициализации приложения:', error);
		}
	}

	protected bindEvents(): void {
	}
}
