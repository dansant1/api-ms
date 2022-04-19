import { request, gql, GraphQLClient } from 'graphql-request';
import axios from 'axios';
import qs from 'qs';
import { Logger } from 'core-framework';

export class PAPIManager {

    static create(): PAPIManager {
        return new PAPIManager();
    }

    getToken = async () => {
        try {
            const params = {'grant_type': 'client_credentials',};  
            const base64 = Buffer.from(`${process.env.AUTH_USER}:${process.env.AUTH_PASS}`).toString('base64');
            const authorization = `Basic ${base64}`;
            const paramsString = qs.stringify(params);
            const requestToken = {
                method: 'post',
                url: `${process.env.PAPI_URL}/oauth/token`,
                headers: { 'Authorization': authorization, 'Content-Type': 'application/x-www-form-urlencoded' },
            };
            //@ts-ignore
            requestToken.data = paramsString;
            //@ts-ignore
            const { data } = await axios(requestToken);
            return data;
        } catch (error) {
            Logger.error(error.message);
            throw new Error(error.message);
        }
    }

    getCodSapClient(token: string) {
        const graphQLClient = new GraphQLClient(`${process.env.PAPI_URL}/products/codsap/key`, {
            headers: {
                'x-access-token': token,
            },
        });
        return graphQLClient;
    }
}

export const PAPInstance = PAPIManager.create();