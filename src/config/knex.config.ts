const IDLE_TIMEOUT = 3;

export const knexInstance = require('knex')({
    client: 'mysql',
    connection: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: 3306,
        logging: console.log,
    },
    pool: {
        min: 0,
        max: 1,
        idleTimeoutMillis: IDLE_TIMEOUT * 1000,
    },
});