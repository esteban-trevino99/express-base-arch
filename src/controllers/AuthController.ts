import BaseController from "./BaseController";

export default class AuthController extends BaseController {
    login() {
        return 'hola'
    }

    holaMundo() {
        return { string: 'hola mundo' }
    }
}