import { Request, Response } from "express";

export default class BaseController {
    req: Request & { body: any };
    res: Response
    constructor(req: Request & { body: any }, res: Response) {
        this.req = req;
        this.res = res;
    }
}