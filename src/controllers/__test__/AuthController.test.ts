import AuthController from "../AuthController";
import { Request, Response } from "express";
describe('AuthController', () => {
    it('should execute login', async () => {
        const req = {} as Request;
        const res = {} as Response;
        const result = new AuthController(req, res).login();
        expect(result).toBe('hola');
    })
})