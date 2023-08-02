import { RequestHandler, Response } from "express";

export default class BaseController {
    req: RequestHandler;
    res: Response
    constructor(req: RequestHandler, res: Response){
        this.req = req; 
        this.res = res;
    }
}