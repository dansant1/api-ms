import {
    Post, 
    CreatePostInput
} from '../contracts';
import {
    events,
} from '../events';
import {
    transporter,
} from '../config';

import { HttpMethods } from 'core-framework';

const {
    EVENT_CREATE_POST_V1,
} = events;

export class PostService {

    static create(): PostService {
        return new PostService();
    }

    getQuery() {
        return {
            posts: this.posts,
        }
    }

    getMutation() {
        return {
            createPost: this.createPost,
        }
    }

    getSchema() {
        return this.getType();
    }

    getType() {
        return `
            type Query {
                posts: [Post]!
            }

            type Mutation {
                createPost(data: CreatePostInput!): Post!
            }

            type Post {
                id: ID!
                title: String!
                body: String!
                category: String!
                published: Boolean!
            }

            input CreatePostInput {
                id: ID
                title: String!
                body: String!
                category: String!
                published: Boolean!
            }
        `;
    }

    public  async createPost({
        metadata,
        params,
    }: {
        metadata: Record<string, unknown>,
        params: CreatePostInput,
    }): Promise<Post> {
        const {
            data,
        } = await transporter.emit(EVENT_CREATE_POST_V1, HttpMethods.POST);
        //@ts-ignore
        return data;
    }

    public posts({
        metadata,
    }: {
        metadata: Record<string, unknown>,
    }): Post[] {
        return [{
            id: 2,
            title: 'hola',
            body: 'hey',
            category: 'fiction',
            published: true,
        }];
    }
}