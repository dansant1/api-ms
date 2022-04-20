import {
    knexInstance as knex,
} from '../config';

export class ProductManager {

    static create(): ProductManager {
        return new ProductManager();
    }

    public async create(data: Record<string, any>): Promise<any> {
        const { productData, skus = [] } = data;
        const productCreated = await knex('product')
        .insert(productData);
        for (const sku of skus) {
            console.log('PRODUCT CREATED=', productCreated);
            const skuCreated = await knex('sku')
            .insert({
                name: sku.name,
                code: sku.code,
                is_active: 1,
                product_id: productCreated[0],
            });
            for (const schedul of sku.schedule) {
                await knex('sku_schedule')
                .insert({
                    dispo_date: schedul.dispo.date,
                    intro_date: schedul.intro.date,
                    disco_date: schedul.disco.date,
                    country_id: 1,
                    sku_id: skuCreated[0],
                });
            }   
        }
        return productCreated;
    }

}

