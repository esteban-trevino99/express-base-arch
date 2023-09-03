import fs from 'fs';
import path from 'path';
import validateJsonJoi from '../modules/json-joi'
import { NextFunction, Request, Response } from 'express';
import { Route } from '../types/router.types';
import { ApiError } from '../types/general.types';
import { BadRequest, Unauthorized, NotFound } from '../utils/errors'

export default class Router {
    private app: any;
    private routes: Route[] = []

    constructor(app: any) {
        this.app = app;
    }

    async init() {
        const routeFiles = fs.readdirSync(path.resolve('src/routes'));
        this.routes = (await Promise.all(routeFiles.map(this.readRouteFile)))?.flat() || [];
        this.addMiddleware(() => {
            this.routes.forEach((route) => this.addRoute(route));
        });
    }

    private async readRouteFile(file: string) {
        const routeData = await fs.promises.readFile(path.resolve('src/routes', file), 'utf8');
        return JSON.parse(routeData);
    }

    private addRoute(route: Route) {
        const { path, method, handler } = route;
        this.app[method](path,
            (req: Request, res: Response, next: NextFunction) => this.getHandlerFromString(handler, { req, res, next })
        );
    }

    private getHandlerFromString = async (handlerString: string, nodeHandlers: { req: Request, res: Response, next: NextFunction }) => {
        const [controllerName, methodName] = handlerString.split('.');
        const { req, res } = nodeHandlers;
        try {
            const controllerModule = await import(`../controllers/${controllerName}`);

            const controller = new controllerModule["default"](req, res);

            if (methodName && controller[methodName] && typeof controller[methodName] === 'function') {
                const result = await controller[methodName]();
                res.send(result);
            }
        } catch (error) {
            const tsError = error as ApiError;
            res.status(tsError.code || 500).json({
                message: tsError.message,
                key: tsError.key,
                data: tsError.data
            })
            res.send();
        }
    };

    private addMiddleware(callback: Function) {
        this.app.use(async (req: Request, res: Response, next: NextFunction) => {
            const currentPath = this.routes.find((route) => route.path == req.originalUrl);
            if (!currentPath)
                throw new NotFound("not_found", `${req.originalUrl} does not exist`)

            Promise.all([
                this.checkAuth(currentPath as Route, req),
                this.checkBody(currentPath as Route, req)
            ]).then(() => {
                callback();
                next();
            }).catch(error => {
                res.status(error.code || 500).send(error)
            })
        })
    }

    private async checkAuth(route: Route, req: Request) {
        const token = req.get('authorization')?.replace("Bearer ", '');
        if (route.options.authRequired && !token) {
            throw new Unauthorized("Unauthorized", "You're not authenticated")
        }

        return route
    }

    private async checkBody(route: Route, req: Request) {
        console.log(`${route.method.toUpperCase()} ${route.path}`)
        if (route.options.bodyRequired) {
            const checkEmptyBody = (body: any) => {
                if (!body) return true;
                if (Array.isArray(body) && !body.length) return true;
                if (typeof body === 'object' && !Object.keys(body).length) return true;
                return false;
            }
            const body = req.body;
            if (checkEmptyBody(body) && route.options.bodyRequired) {
                throw new BadRequest("BAD_REQUEST", "Body required", { bodyRequired: route.options.bodyRequired });
            }
            const joi = validateJsonJoi(body, route.options.bodyRequired)
            if (!joi.check) {
                throw new BadRequest("BAD_REQUEST", "Wrong payload", { error: joi.error })
            }
            return route
        }
    }

}