import { Pool, createPool, PoolConnection, Query } from 'mysql';

class Db {
    db: Pool
    constructor(host: string, user: string, password: string, port: number, name: string) {
        this.db = createPool({
            host: host,
            user: user,
            password: password,
            port: port,
            database: name
        })
    }

    async query({ connection, query, values }: { connection?: PoolConnection, query: string, values: any }):
        Promise<Query> {

        const result: any = await new Promise((resolve, reject) => {
            const queryCallback = function (err: any,  result: any) {
                if (err) reject(err)
                else resolve(result)
            }
            if (connection)
                connection.query(query, values, queryCallback);
            else
                this.db.query(query, values, queryCallback);
        })
        return result;
    }

    async beginTransaction(): Promise<PoolConnection> {
        const connection: PoolConnection = await new Promise((resolve, reject) => {
            this.db.getConnection(async (err, conn: PoolConnection) => {
                if (err) reject(err)
                await conn.beginTransaction();
                resolve(conn);
            })
        });
        return connection;
    }

    async commit(connection: PoolConnection): Promise<void> {
        connection.commit((err) => {
            if (err) throw err;
            connection.release();
        });
    }

    async rollback(connection: PoolConnection): Promise<void> {
        connection.rollback((err: any) => {
            if (err) throw err;
            connection.release();
        });
    }
}

export default Db;