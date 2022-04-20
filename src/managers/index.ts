export * from './PAPI.manager';
import {
    ProductManager,
} from './product.manager';

export const ProductManagerInstance = ProductManager.create();