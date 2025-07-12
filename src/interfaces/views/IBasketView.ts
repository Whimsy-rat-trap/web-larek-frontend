import { Product } from '../../types';
import { IView } from '../IView';

export interface IBasketView extends IView {
	updateItems(items: Product[]): void;
	updateTotal(total: number): void;
	updateCounter(count: number): void;
}