import { 
    GatewayBuilder,
    GatewayTypes,
} from 'core-framework';
import { PostService } from './post.service';
const postService = PostService.create();


const services_query: Record<string, any>[] = [
    postService.getQuery()
];
const services_mutation: Record<string, any>[] = [
    postService.getMutation()
];
const schemas: string[] = [
    postService.getSchema(),
];

export const buidServices = GatewayBuilder.create(
    GatewayTypes.GraphQL, {
        services_query,
        services_mutation,
        schemas,
    },
);