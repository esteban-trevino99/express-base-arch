import Db from '../modules/mysql-db'

export default () => {
    const {
        DB_HOST,
        DB_USER,
        DB_PASSWORD,
        DB_PORT,
        DB_NAME,
    } = process.env
    return new Db(
        DB_HOST as string,
        DB_USER as string,
        DB_PASSWORD as string,
        Number(DB_PORT) as number,
        DB_NAME as string);
}