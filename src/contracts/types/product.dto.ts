export interface Product {
    id: number,
    code: string,
    name: string,
    description: string,
    photo_url: string,
    has_variants: boolean,
    active_sku_list: string,
    is_active: boolean,
    category_id: number,
    brand_id: number,
    business_unit_id: number,
    tags: string,
    skus?: SKUs[],
    category?: Record<string, string>,
}

export interface SKUs {
        code: string,
        name: string,
        schedule: Schedules[]
}

export interface Schedules {
    dispo: {
        campaign: string,
        date: string
    },
    intro: {
        campaign: string,
        date: string,
    }
    disco: {
        campaign: string,
        date: string,
    }
}


