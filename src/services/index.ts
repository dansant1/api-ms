import { 
    GatewayBuilder,
    GatewayTypes,
} from 'core-framework';
import { PostService } from './post.service';

const postService = PostService.create({
    name: 'post',
    version: '1',
    port: 9000,
});

const services_query: Record<string, any>[] = [
    postService.getQuery()
];
const services_mutation: Record<string, any>[] = [
    postService.getMutation()
];
const schemas: string[] = [
    postService.getSchema(),
];

export const services = [
    {   
        ms: 'post',
        builder: GatewayBuilder.create(
            GatewayTypes.GraphQL, {
                services_query,
                services_mutation,
                schemas,
            },
        ),
        instance: postService,
    }
];