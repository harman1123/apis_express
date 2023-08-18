import { Response } from 'express'

export const responseWithStatus = (res: Response, status: number, responseData: any) => {
    return res.status(status).send(responseData);
}