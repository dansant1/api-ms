const DB_ENGINES = process.env.DB_ENGINES_URL;

export const events = {
    EVENT_CREATE_PRODUCT_V1: `${DB_ENGINES}db/product/save`,
}