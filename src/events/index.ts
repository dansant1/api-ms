const DB_ENGINES = process.env.DB_ENGINES_URL;

export const events = {
    EVENT_CREATE_POST_V1: `${DB_ENGINES}post`,
}