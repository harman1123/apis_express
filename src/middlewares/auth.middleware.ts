import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/common.util'
import { responseWithStatus } from '../utils/response.util';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const decoded = verifyToken(authHeader);
        if (decoded) {
            req.body.user = decoded;
            next();
        } else {
            return responseWithStatus(res, 400, {
                data: null,
                error: 'Unauthorized',
                message: '',
                status: 401
            })
        }
    } else {
        return responseWithStatus(res, 400, {
            data: null,
            error: 'Unauthorized',
            message: '',
            status: 401
        })
    }
}