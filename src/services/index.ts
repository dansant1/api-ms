import { 
    GatewayBuilder,
    GatewayTypes,
} from 'core-framework';
import { ProductService } from './product.service';

const productService = ProductService.create({
    name: 'product',
    version: '1',
    port: 9000,
});

const services_query: Record<string, any>[] = [
    productService.getQuery()
];
const services_mutation: Record<string, any>[] = [
    productService.getMutation()
];
const schemas: string[] = [
    productService.getSchema(),
];

export const services = [
    {   
        ms: 'product',
        builder: GatewayBuilder.create(
            GatewayTypes.GraphQL, {
                services_query,
                services_mutation,
                schemas,
            },
        ),
        instance: productService,
    }
];