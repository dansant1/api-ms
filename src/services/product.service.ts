import {
    Product, 
    CreateProducInput,
    Period,
} from '../contracts';
import {
    events,
} from '../events';
import {
    transporter,
} from '../config';

import { HttpMethods, Logger } from 'core-framework';

const {
    EVENT_CREATE_PRODUCT_V1,
} = events;

export class ProductService {

    #name: string;
    #version: string;
    #port: number;

    constructor(
        name: string, 
        version: string,
        port: number,
    ) {
        this.setName(name);
        this.setVersion(version);
        this.setPort(port);
    }

    static create(data: {
        name: string,
        version: string,
        port: number,
    }): ProductService {
        const {
            name,
            version,
            port,
        } = data;
        return new ProductService(
            name, 
            version,
            port,
        );
    }

    setName(name: string): void {
        this.#name = name;
    }

    getName(): string {
        return this.#name;
    }

    setPort(port: number): void {
        this.#port = port;
    }

    getPort(): number {
        return this.#port;
    }

    setVersion(version: string): void {
        this.#version = version;
    }

    getVersion(): string {
        return this.#version;
    }

    getQuery() {
        return {
            getProductFromMDMBySKU: this.getProductFromMDMBySKU,
            getProductFromMDMByCUC: this.getProductFromMDMByCUC,
            getProducts: this.getProducts,
            getDatesByCampaign: this.getDatesByCampaign,
        }
    }

    getMutation() {
        return {
            saveProduct: this.saveProduct,
        }
    }

    getSchema() {
        return this.getType();
    }

    
    getType() {
        return `
            type Query {
                getProductFromMDMBySKU(country_code: String!, country_id: String!, sku: String!): Product!
                getProductFromMDMByCUC(country_code: String!, country_id: String!, cuc: String!): Product!
                getDatesByCampaign(data: InputSchedule): DatesByCampaign!
                getProducts(limit: Int!, offset: Int): [Product]!
            }

            type DatesByCampaign {
                country_code: String!
                country_id: String!
                sku: String!
                schedule: [Schedule]
            }

            type Product {
                id: ID!
                code: String!
                name: String!
                description: String!
                photo_url: String
                has_variants: Boolean
                active_sku_list: String
                is_active: Boolean
                category_id: Int!
                brand_id: Int!
                business_unit_id: Int!
                tags: String!
                skus: [SKU]
            }

            type SKU {
                code: String!
                name: String!
                schedule: [Schedule]
            }

            type Schedule {
                dispo: CampaignDetail
                intro: CampaignDetail
                disco: CampaignDetail
            }

            type CampaignDetail {
                campaign: String
                date: String
            }

            type Period {
                id: ID!
                code: String
                fan_date: String
                start_date: String
                end_date: String
                country_id: String
                channel_id: String
            }

            type Mutation {
                saveProduct(data: CreateProducInput!): Product!
            }

            input CreateProducInput {
                code: String!
                name: String!
                description: String!
                photo_url: String
                has_variants: Boolean
                active_sku_list: String
                is_active: Boolean!
                category_id: Int
                brand_id: Int
                business_unit_id: Int
                tags: String
            }

            input InputSchedule {
                country_code: String!
                country_id: String!
                sku: String!
                schedule: [ISchedule]
            }

            input ISchedule {
                dispo: ICampaignDetail
                intro: ICampaignDetail
                disco: ICampaignDetail
            }

            input ICampaignDetail {
                campaign: String
                date: String
            }
        `;
    }

    public  async getProductFromMDMBySKU({
        metadata,
        params,
    }: {
        metadata: Record<string, unknown>,
        params: any,
    }): Promise<Product> {
        Logger.warn(`DATA=${JSON.stringify(metadata)}`);
        return {
            id: 1,
            code: '001',
            name: 'P1',
            description: 'descr',
            photo_url: 'www.photo.com',
            has_variants: true,
            active_sku_list: 'sku',
            is_active: true,
            category_id: 3,
            brand_id: 2,
            business_unit_id: 1,
            tags: 'tag_1, tag_2',
            skus: 
            [
                {
                    code: 'SK0001',
                    name: 'sku_01',
                    schedule: 
                    [
                        {
                            dispo: {
                                campaign: 'dispo_camp_01',
                                date: new Date().toISOString()
                            },
                            intro: {
                                campaign: 'intro_camp_01',
                                date: new Date().toISOString(),
                            },
                            disco: {
                                campaign: 'disco_camp_01',
                                date: new Date().toISOString(),
                            }
                        }
                    ]
                }
            ]
        };
    }

    public async getProductFromMDMByCUC({
        metadata,
        params,
    }: {
        metadata: Record<string, unknown>,
        params: any,
    }): Promise<Product> {
        Logger.warn(`DATA=${JSON.stringify(metadata)}`);
        return {
            id: 1,
            code: '001',
            name: 'P1',
            description: 'descr',
            photo_url: 'www.photo.com',
            has_variants: true,
            active_sku_list: 'sku',
            is_active: true,
            category_id: 3,
            brand_id: 2,
            business_unit_id: 1,
            tags: 'tag_1, tag_2',
            skus: 
            [
                {
                    code: 'SK0001',
                    name: 'sku_01',
                    schedule: 
                    [
                        {
                            dispo: {
                                campaign: 'dispo_camp_01',
                                date: new Date().toISOString()
                            },
                            intro: {
                                campaign: 'intro_camp_01',
                                date: new Date().toISOString(),
                            },
                            disco: {
                                campaign: 'disco_camp_01',
                                date: new Date().toISOString(),
                            }
                        }
                    ]
                }
            ]
        };
    }

    public getProducts({
        metadata,
    }: {
        metadata: Record<string, unknown>,
    }): Product[] {
        return [
            {
                id: 1,
                code: '001',
                name: 'P1',
                description: 'descr',
                photo_url: 'www.photo.com',
                has_variants: true,
                active_sku_list: 'sku',
                is_active: true,
                category_id: 3,
                brand_id: 2,
                business_unit_id: 1,
                tags: 'tag_1, tag_2'
            },
            {
                id: 2,
                code: '002',
                name: 'P2',
                description: 'descr',
                photo_url: 'www.photo.com',
                has_variants: true,
                active_sku_list: 'sku',
                is_active: true,
                category_id: 3,
                brand_id: 2,
                business_unit_id: 1,
                tags: 'tag_1, tag_2'
            }
        ];
    }

    public getDatesByCampaign({
        metadata,
    }: {
        metadata: Record<string, unknown>,
    }) {
        Logger.warn(`DATA=${JSON.stringify(metadata)}`);
        return {
            //@ts-ignore
            country_code: metadata?.data?.country_code,
            //@ts-ignore
            country_id: metadata?.data?.country_id,
            //@ts-ignore
            sku: metadata?.data?.sku,
            schedule: 
                [
                    {
                        dispo: {
                            campaign: 'dispo_camp_01',
                            date: new Date().toISOString()
                        },
                        intro: {
                            campaign: 'intro_camp_01',
                            date: new Date().toISOString(),
                        },
                        disco: {
                            campaign: 'disco_camp_01',
                            date: new Date().toISOString(),
                        }
                    }
                ]
        }
    }

    public async saveProduct({
        metadata,
    }: {
        metadata: Record<string, unknown>,
        params: CreateProducInput,
    }): Promise<Product> {
        const {
            data,
        } = await transporter.emit(EVENT_CREATE_PRODUCT_V1,);
        Logger.warn(`DB-ENGINES response=${data}`);
        return {
            id: 1,
            code: '001',
            name: 'P1',
            description: 'descr',
            photo_url: 'www.photo.com',
            has_variants: true,
            active_sku_list: 'sku',
            is_active: true,
            category_id: 3,
            brand_id: 2,
            business_unit_id: 1,
            tags: 'tag_1, tag_2'
        };
    }
}