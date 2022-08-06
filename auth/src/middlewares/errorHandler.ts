import {NextFunction, Request, Response} from 'express'
import CustomError from '../errors/customError'

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof CustomError) {
       return res.status(err.statusCode).send({errors: err.serializeErrors()})
    }
    res.status(500).send({errors: [{message: 'Internal server error.'}]})
}

export default errorHandler