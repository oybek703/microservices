import {NextFunction, Request, Response} from 'express'
import RequestValidationError from '../errors/requestValidationError'
import DatabaseConnectionError from '../errors/databaseConnectionError'

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof RequestValidationError) {
        res.status(err.statusCode).send({errors: err.serializeErrors()})
    }
    if (err instanceof DatabaseConnectionError) {
        res.status(err.statusCode).send({errors: err.serializeErrors()})
    }
    res.status(500).send({errors: [{message: 'Internal server error.'}]})
}

export default errorHandler