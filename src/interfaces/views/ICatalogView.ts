import { IView } from '../IView';
import { Product } from '../../types';

export interface ICatalogView extends IView{
	updateProducts(products: Product[]): void;
}