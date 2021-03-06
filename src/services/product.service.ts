import { gql } from 'graphql-request';
import { Logger } from 'core-framework';
import {
    Product, 
    CreateProducInput,
} from '../contracts';
import {
    events,
} from '../events';
import {
    ProductManagerInstance,
} from '../managers';
import {
    PAPInstance,
} from '../managers';

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
                category: Category!
                brand: Brand
                business_unit: BusinessUnit
            }

            type Category {
                id: String
                name: String
            }

            type Brand {
                id: String
                name: String
            }

            input ICategory {
                id: String
                name: String
            }

            input IBrand {
                id: String
                name: String
            }

            type BusinessUnit {
                id: String
                name: String
            }

            input IBusinessUnit {
                id: String
                name: String
            }

            type SKU {
                code: String!
                name: String!
                schedule: [Schedule]
            }

            input ISKU {
                code: String!
                name: String!
                schedule: [ISchedule]
            }

            type Schedule {
                dispo: CampaignDetail
                intro: CampaignDetail
                disco: CampaignDetail
            }

            input ICampaignDetail {
                campaign_year: String
                campaign_period: String
                date: String
            }

            type CampaignDetail {
                campaign_year: String
                campaign_period: String
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
                skus: [ISKU]
                category: ICategory!
                brand: IBrand!
                business_unit: IBusinessUnit
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

        `;
    }

    public  async getProductFromMDMBySKU({
        metadata,
        params,
    }: {
        metadata: Record<string, any>,
        params: any,
    }): Promise<Product> {
        Logger.warn(`DATA=${JSON.stringify(metadata)}`);
        const {
            //@ts-ignore
            access_token,
        } = await PAPInstance.getToken();
        const query = gql`{
            list (codsap: ["${metadata?.sku}"]) {
                codsap,
                codcategoria,
                codmarca,
                codproductogenerico,
                codunidadnegocio,
                desproductosap,
                desnombreproductowebredes,
                desresumen,
                descategoria,
                desmarca,
                deswebredes,
                desmarca,
                desunidadnegocio,
                descategoria, 
                detallepais {  
                    codpais,
                    campanadispo,
                    campanadescontinuacion,
                    campanaintro
                },
                fotoproductofondoblancowebredes
            }
        }`;
        const response = await PAPInstance.getCodSapClient(access_token).request(query);
        console.log('RESPONSE=', response);
        const papiData = response.list[0];
        const dataCountry = papiData.detallepais.filter((detail) => detail.codpais === metadata?.country_code);
        const schedule = [];
        dataCountry.forEach(element => {
            schedule.push({
                dispo: {
                    campaign_year: element.campanadispo.substring(0, 4),
                    campaign_period: element.campanadispo.slice(-2),
                    date: new Date().toISOString(),
                },
                intro: {
                    campaign_year: element.campanaintro.slice(-4),
                    campaign_period: element.campanaintro.substring(0, 2),
                    date: new Date().toISOString(),
                },
                disco: {
                    campaign_year: element.campanadescontinuacion.substring(0, 4),
                    campaign_period: element.campanadescontinuacion.slice(-2),
                    date: new Date().toISOString(),
                }
            });
        });
        return {
            id: metadata?.sku,
            code: metadata?.sku,
            name: papiData.desnombreproductowebredes,
            description: papiData.deswebredes,
            photo_url: papiData.fotoproductofondoblancowebredes[0],
            has_variants: papiData.codproductogenerico === '' ? false : true,
            active_sku_list: '',
            is_active: true,
            category_id: papiData.codcategoria,
            brand_id: papiData.codmarca,
            business_unit_id: papiData.codunidadnegocio,
            tags: '',
            skus: 
            [
                {
                    code: papiData.codsap,
                    name: papiData.desnombreproductowebredes,
                    schedule
                }
            ],
            category: {
                id: papiData.codcategoria,
                name: papiData.descategoria,
            },
            brand: {
                id: papiData.codmarca,
                name: papiData.desmarca,
            },
            business_unit: {
                id: papiData.codunidadnegocio,
                name: papiData.desunidadnegocio
            }
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
        const {
            //@ts-ignore
            access_token,
        } = await PAPInstance.getToken();
        const query = gql`{
            listProductoGenerico (codproductogenerico: [ "${metadata?.cuc}"]) {
                codsap,
                codcategoria,
                codcategoriaproductocon,
                codproductogenerico,
                desdefaultvariant,
                fotopreviavideo,
                desnombreproductowebredes,
                deswebredes,
                desmarca,
                detallepais {
                    codpais,
                    campanadispo,
                    campanapreventa,
                    campanaintro,
                    campanadescontinuacion,
                    campanadescontinuaciondia
                },
                fotoproductofondoblancowebredes,
                codunidadnegocio,
                codcuc,
                codmarca,
                desnegocio
            }
            }`;
        const response = await PAPInstance.getCodSapClient(access_token).request(query);
        console.log('RESPONSE=', response);
        const papiData = response.listProductoGenerico.length > 0 ? response.listProductoGenerico[0] : {};
        const skuList = response.listProductoGenerico;
        const sku = [];
        
        skuList.forEach(element => {
            const dataCountry = element.detallepais.filter((detail) => detail.codpais === metadata?.country_code);
            const schedule = [];
            dataCountry.forEach(elemento => {
                schedule.push({
                    dispo: {
                        campaign_year: elemento.campanadispo.substring(0, 4),
                        campaign_period: elemento.campanadispo.slice(-2),
                        date: new Date().toISOString(),
                    },
                    intro: {
                        campaign_year: elemento.campanaintro.slice(-4),
                        campaign_period: elemento.campanaintro.substring(0, 2),
                        date: new Date().toISOString(),
                    },
                    disco: {
                        campaign_year: elemento.campanadescontinuacion.substring(0, 4),
                        campaign_period: elemento.campanadescontinuacion.slice(-2),
                        date: new Date().toISOString(),
                    }
                });
            });
            sku.push({
                code: element.codsap,
                name: element.desnombreproductowebredes,
                schedule,
            })
        });
        return {
            //@ts-ignore
            id: metadata?.cuc,
            //@ts-ignore
            code: metadata?.cuc,
            name: papiData?.desnombreproductowebredes,
            description: papiData?.deswebredes,
            photo_url: papiData?.fotoproductofondoblancowebredes[0],
            has_variants: papiData?.codproductogenerico === '' ? false : true,
            active_sku_list: '',
            is_active: true,
            category_id: papiData?.codcategoria,
            brand_id: papiData?.codmarca,
            business_unit_id: papiData?.codunidadnegocio,
            tags: '',
            skus: sku,
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
        Logger.warn(`DATA=${JSON.stringify(metadata.data)}`);
        const input = metadata.data as any;
        const productData = {
            code: input?.code,
            name: input?.name,
            description: input?.description,
            photo_url: input?.photo_url,
            has_variants: input?.has_variants,
            active_sku_list: input?.active_sku_list,
            is_active: input?.is_active,
            category_id: input?.category_id,
            brand_id: input?.brand_id,
            business_unit_id: input?.business_unit_id,
            tags: input?.tags,
        }
        const skus = input?.skus || [];
        const product = await ProductManagerInstance.create({
            productData,
            skus
        });
        return {
            id: product[0],
            ...productData,
            ...skus,
        };
    }
}