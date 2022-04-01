import {
    TransporterFactory,
    GatewayTypes,
    Dependency,
} from 'core-framework';

export const transporter = TransporterFactory.create({
    gatewayType: GatewayTypes.REST,
    dependency: Dependency.AXIOS,
});