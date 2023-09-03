import BaseController from "./BaseController";
import Db from '../utils/db'
import bcrypt from 'bcrypt';
import { PreconditionFailed, Unauthorized } from '../utils/errors'
import jwt from 'jsonwebtoken'
import { User } from "../types/user.types";

export default class AuthController extends BaseController {
    async login() {
        const { body } = this.req;
        const db = Db();
        const user = await db.query({
            query: "SELECT id, email, name, lastname, role, password FROM users WHERE email = ?;",
            values: [body.email]
        }) as any;

        if (!user.length)
            throw new PreconditionFailed("user_not_exists", "User does not exist", { email: body.email })

        const isValid = await this.comparePassword(body.password, user[0].password);
        if (!isValid) throw new Unauthorized("invalid_credentials",
            "Invalid credentials or password requirements not met")

        const token = this.createJWT(user[0])

        return { token }
    }

    async signUp() {
        const { body } = this.req;
        const db = Db();
        const existingUser = await db.query({
            query: `SELECT 1 FROM ${process.env.DB_USERS_TABLE_NAME} WHERE email = ?;`,
            values: [body.email]
        }) as any
        if (existingUser.length)
            throw new PreconditionFailed("user_exists", "User already exists", { email: body.email })

        const hashedPassword = await this.hashPassword(body.password)

        await db.query({
            query: `INSERT INTO users (email, password, name, lastname, role) 
                VALUES (?,?,?,?,?)`,
            values: [body.email, hashedPassword, body.name, body.lastname, 'ADMIN']
        })

        return { check: true }
    }

    async me() {
        const token = this.req.get('authorization')?.replace("Bearer ", '') || '';
        const user = this.decodeJWT(token);
        return user;
    }

    private async hashPassword(password: string): Promise<string> {
        const hashedPassword: string = await new Promise((resolve) => {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, function (err, hash) {
                    resolve(hash)
                });
            })
        })
        return hashedPassword;
    }

    private async comparePassword(password: string, hashPassword: string): Promise<boolean> {
        const isValid: boolean = await new Promise((resolve) => {
            bcrypt.compare(password, hashPassword, function (err, result) {
                resolve(result);
            });
        });
        return isValid;
    }

    private createJWT(user: User): string {
        const token = jwt.sign({
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            permissions: user.permissions
        }, process.env.TOKEN_SECRET || '')

        return token
    }

    private decodeJWT(token: string): User {
        if (!token) throw new Unauthorized("not_authenticated",
            "User is not authenticated")
        const user = jwt.verify(token, process.env.TOKEN_SECRET || '');
        return user as jwt.JwtPayload as User;
    }
}