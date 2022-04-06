import {
    AppFactory,
    ServerBuilder,
    Protocols,
    GatewayTypes,
    Platforms,
    ConfigGraphQL,
    EnvConfigFactory,
    ConfigType,
} from 'core-framework';
import { 
    services, 
} from './services';

export const config = EnvConfigFactory.create({
    configType: ConfigType.ENV,
});
console.log('NODE_ENV=', config.get('NODE_ENV'));

const runner = async () => {
    for (const service of services) {
        const server = new ServerBuilder();
        server.setPort(service.instance.getPort());
        server.setPrefix(`/api/${service.instance.getName()}`);
        server.setProtolType(Protocols.HTTP);
        server.setServerType(Platforms.FASTIFY);
        server.setGatewayType(GatewayTypes.GraphQL);
        server.setEntryType(service.builder.buildGraphQL() as ConfigGraphQL);
        server.setConfig({ 
            logger: false,
        });
        const app = AppFactory.create(server);
        await app.listen('0.0.0.0');
    }
}

runner();

