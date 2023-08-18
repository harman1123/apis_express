import express, { Request, Response } from 'express'
import AdminController from '../../controller/adminController';
import userController from '../../controller/userController';
import {responseWithStatus} from '../../utils/response.util'
const router = express.Router()
// login api 
router.post('/login', async (req: Request | any, res: Response) => {
    const { email, password } = req.body;
    const controller = new userController(req, res)
    const response = await controller.login({ email, password });
    const { status } = response;
    return responseWithStatus(res, status, response)
})
// sign up api 
router.post('/sign-up', async (req: Request | any, res: Response) => {
    const { firstName, lastName, email, password } = req.body;
    const controller = new userController(req, res)
    const response = await controller.save({ firstName, lastName, email, password });
    const { status } = response;
    return responseWithStatus(res, status, response)
})
module.exports = router