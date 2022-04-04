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

import { HttpMethods, Logger } from 'core-framework';

const {
    EVENT_CREATE_POST_V1,
} = events;

export class PostService {

    #name: string;
    #version: string;

    constructor(
        name: string, 
        version: string
    ) {
        this.setName(name);
        this.setVersion(version);
    }

    static create(data: {
        name: string,
        version: string,
    }): PostService {
        const {
            name,
            version,
        } = data;
        return new PostService(
            name, 
            version
        );
    }

    setName(name: string): void {
        this.#name = name;
    }

    getName(): string {
        return this.#name;
    }

    setVersion(version: string): void {
        this.#version = version;
    }

    getVersion(): string {
        return this.#version;
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
                title: String!
                body: String!
                category: String!
                published: Boolean!
            }

            input CreatePostInput {
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
        Logger.warn(`DATA=${JSON.stringify(metadata)}`);
        Logger.warn(`DATA=${JSON.stringify(params)}`);
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