import { Product } from '../../types';
import { IModel } from '../IModel';

export interface ICatalogModel extends IModel{
	get products(): Product[];
	set products(products: Product[]);
}