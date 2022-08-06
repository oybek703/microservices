import {ValidationError} from 'express-validator'
import CustomError from './customError'

class RequestValidationError extends CustomError {
    statusCode = 400
    constructor(public reasons: ValidationError[]) {
        super('Invalid request parameters')
        // Only because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    serializeErrors() {
        return this.reasons
            .map(({msg, param}) => ({message: msg, field: param}))
    }
}

export default RequestValidationError