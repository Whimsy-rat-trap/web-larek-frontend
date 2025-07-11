import { BasePresenter } from '../base/BasePresenter';
import { BasketItem, IBasketItemActions } from '../BasketItem';
import { Product } from '../../types';

export class BasketItemPresenter extends BasePresenter {
    private basketItem: BasketItem;

    constructor(
        private template: HTMLTemplateElement,
        private actions: IBasketItemActions,
        model: any
    ) {
        super(null, model);
    }

    protected init(): void {
        this.basketItem = new BasketItem(this.template, this.actions);
    }

    public renderItem(product: Product, index: number): HTMLElement {
        return this.basketItem.render(product, index);
    }
}