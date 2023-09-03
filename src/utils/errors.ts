class ApiError {
    code: number;
    key: string;
    message: string;
    data?: any;
    constructor(code: number, key: string, message: string, data?: any) {
        this.code = code;
        this.key = key;
        this.message = message;
        this.data = data;
    }
}

export class BadRequest extends ApiError {
    constructor(key: string, message: string, data?: any) {
        const code = 400;
        super(code, key, message, data)
    }
}

export class Unauthorized extends ApiError {
    constructor(key: string, message: string, data?: any) {
        const code = 401;
        super(code, key, message, data)
    }
}

export class Forbidden extends ApiError {
    constructor(key: string, message: string, data?: any) {
        const code = 403;
        super(code, key, message, data)
    }
}

export class Conflict extends ApiError {
    constructor(key: string, message: string, data?: any) {
        const code = 409;
        super(code, key, message, data)
    }
}

export class PreconditionFailed extends ApiError {
    constructor(key: string, message: string, data?: any) {
        const code = 412;
        super(code, key, message, data)
    }
}

export class FailedDependency extends ApiError {
    constructor(key: string, message: string, data?: any) {
        const code = 424;
        super(code, key, message)
    }
}

export class InternalServer extends ApiError {
    constructor(key: string, message: string, data?: any) {
        const code = 500;
        super(code, key, message)
    }
}

export class NotFound extends ApiError {
    constructor(key: string, message: string, data?: any) {
        const code = 404;
        super(code, key, message)
    }
}