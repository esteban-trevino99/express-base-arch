import { Pool, createPool } from 'mysql';

class Db {
    db: Pool
    constructor() {
        this.db = createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT) as number,
            database: process.env.DB_NAME
        })
    }
}

export default Db;