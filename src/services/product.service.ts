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
    EVENT_CREATE_POST_V1,
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
                getProductFromMDMBySKU(sku: String!): Product!
                getProductFromMDMByCUC(cuc: String!): Product!
                getProducts(limit: Int!, offset: Int): [Product]!
                getDatesByCampaign: [Period]!
            }

            type Product {
                id: ID!
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
        Logger.warn(`DATA=${JSON.stringify(params)}`);
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

    public getProductFromMDMByCUC({
        metadata,
    }: {
        metadata: Record<string, unknown>,
    }): Product {
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
    }): Period[] {
        return [{
            id: 1,
            code: '001',
            fan_date: '10/02/2022',
            start_date: '11/02/2022',
            end_date: '12/02/2022',
            country_id: '3',
            channel_id: '2'
        }]
    }

    public saveProduct({
        metadata,
    }: {
        metadata: Record<string, unknown>,
        params: CreateProducInput,
    }): Product {
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