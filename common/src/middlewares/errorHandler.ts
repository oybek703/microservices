import {NextFunction, Request, Response} from 'express'
import {CustomError} from '..'

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof CustomError) {
       res.status(err.statusCode).send({errors: err.serializeErrors()})
       return
    }
    console.error(err)
    res.status(500).send({errors: [{message: 'Internal server error.'}]})
}
