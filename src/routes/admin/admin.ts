import express, { Request, Response } from 'express'
import AdminController from '../../controller/adminController'
import { authenticate } from '../../middlewares/auth.middleware'
import { responseWithStatus } from '../../utils/response.util'
const router = express.Router()
// login api 
router.post('/login', async (req: Request | any, res: Response) => {
    const { email, password } = req.body;
    const controller = new AdminController(req, res)
    const response = await controller.login({ email, password });
    const { status } = response;
    return responseWithStatus(res, status, response)
})
// sign up api 
router.post('/sign-up', async (req: Request | any, res: Response) => {
    const { firstName, lastName, email, password } = req.body;
    const controller = new AdminController(req, res)
    const response = await controller.save({ firstName, lastName, email, password });
    const { status } = response;
    return responseWithStatus(res, status, response)
})
// forget password with mail
router.post('/forgotPassword', async (req: Request | any, res: Response) => {
    const { email } = req.body;
    const controller = new AdminController(req, res)
    const response = await controller.forgotPassword({ email });
    const { status } = response;
    return responseWithStatus(res, status, response)
})

router.post('/changePassword', authenticate, async (req: Request | any, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const controller = new AdminController(req, res)
    const response = await controller.changePassword({ oldPassword, newPassword });
    const { status } = response;
    return responseWithStatus(res, status, response)
})

router.post('/resetPassword', authenticate, async (req: Request | any, res: Response) => {
    // check purpose field
    const { purpose } = req.body.user;
    if (!purpose || purpose !== 'reset') {
        return responseWithStatus(res, 400, {
            data: {},
            error: 'Invalid Token',
            message: '',
            status: 400
        })
    }
    const { password } = req.body;
    const controller = new AdminController(req, res)
    const response = await controller.resetPassword({ password });
    const { status } = response;
    return responseWithStatus(res, status, response)
})

router.get('/me', authenticate, async (req: Request | any, res: Response) => {
    const controller = new AdminController(req, res)
    const response = await controller.me();
    const { status } = response;
    return responseWithStatus(res, status, response)
})

router.post('/update', authenticate, async (req: Request | any, res: Response) => {
    const { id } = req.body.user;
    if (!id) {
        return responseWithStatus(res, 400, {
            data: {},
            error: 'Invalid Token',
            message: '',
            status: 400
        })
    }
    const { firstName, lastName, email } = req.body;
    const controller = new AdminController(req, res)
    const response = await controller.update({ firstName, lastName, email });
    return responseWithStatus(res, response.status, response)
})
router.get('/allusers', async (req:Request | any, res:Response) =>{
    const controller = new AdminController(req,res)
    // console.log("ffdbgd");
    const response = await controller.getallusers()
    const {status} = response;
    return responseWithStatus(res,status, response)
})

module.exports = router
