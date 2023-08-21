import { Route, Controller, Tags, Post, Body, Get, Security, Query } from 'tsoa'
import logger from '../config/logger.config';
import { Request, Response } from 'express'
import { findOne, getById, upsert, getAll } from '../helpers/db.helpers';
import userModel from '../models/user.model';
import { verifyHash, signToken, genHash } from '../utils/common.util';
import { validateduser, validateProfile, validateForgotPassword } from "../../src/validations/user.validation";

import { IResponse } from '../utils/interfaces.util';
import { sendEmail } from '../config/nodemailer';
import { readHTMLFile } from '../services/utils';
import path from 'path';
import handlebar from 'handlebars'
import { validateChangePassword, validateResetPassword } from '../validations/admin.validation';
// import logger from '../config/logger.config';
// import { sendEmail } from '../config/nodemailer';
// import { readHTMLFile } from '../services/utils';
// import path from 'path';
// import handlebar from 'handlebars'

@Tags('User')
@Route('api/user')
export default class userController extends Controller {
    req: Request;
    res: Response;
    userId: string
    constructor(req: Request, res: Response) {
        super();
        this.req = req;
        this.res = res;
        this.userId = req.body.user ? req.body.user.id : ''
    }
    /**
    * Get user login
    */
    @Post("/login")
    public async login(@Body() request: { email: string, password: string }): Promise<IResponse> {
        try {
            const { email, password } = request;
            const validatedUser = validateduser({ email, password });
            if (validatedUser.error) {
                throw new Error(validatedUser.error.message)
            }
            const exists = await findOne(userModel, { email });
            if (!exists) {
                throw new Error('user doesn\'t exists!');
            }
            // check if blocked
            if (exists.isBlocked) {
                throw new Error('user is not approved yet!');
            }

            const isValid = await verifyHash(password, exists.password);
            if (!isValid) {
                throw new Error('Password seems to be incorrect');
            }
            const token = await signToken(exists._id)
            delete exists.password
            console.log("token");

            return {
                data: { ...exists, token },
                error: '',
                message: 'Login Success',
                status: 200
            }
        }
        catch (err: any) {
            logger.error(`${this.req.ip} ${err.message}`)
            return {
                data: null,
                error: err.message ? err.message : err,
                message: '',
                status: 400
            }
        }
    }


    /**
 * Save a user
 */
    @Post("/sign-up")
    public async save(@Body() request: { email: string, firstName: string, lastName: string, password: string }): Promise<IResponse> {
        try {
            const { firstName, lastName, email, password } = request;
            const validatedProfile = validateProfile({ firstName, lastName, email, password });
            if (validatedProfile.error) {
                throw new Error(validatedProfile.error.message)
            }
            // check if user exists
            const exists = await findOne(userModel, { email });
            if (exists) {
                throw new Error(`Email ${email} is already registered with us`)
            }
            const hashed = await genHash(password);
            const saveResponse = await upsert(userModel, { firstName, lastName, email, password: hashed })
            // create a temp token
            const token = await signToken(saveResponse._id, { purpose: 'temp' }, '1hr')
            // console.log(token);
            return {
                data: { ...saveResponse.toObject(), token },
                error: '',
                message: 'User registered successfully',
                status: 200
            }
        }
        catch (err: any) {
            logger.error(`${this.req.ip} ${err.message}`)
            return {
                data: null,
                error: err.message ? err.message : err,
                message: '',
                status: 400
            }
        }
    }
    /**
  * Forgot password api endpoint
  */
    @Post("/forgotPassword")
    public async forgotPassword(@Body() request: { email: string }): Promise<IResponse> {
        try {
            const { email } = request;
            const validatedForgotPassword = validateForgotPassword({ email });
            if (validatedForgotPassword.error) {
                throw new Error(validatedForgotPassword.error.message)
            }
            // check if user exists
            const exists = await findOne(userModel, { email });
            if (!exists) {
                throw new Error('Invalid User')
            }
            //   sign a token with userid & purpose
            const token = await signToken(exists._id, { purpose: 'reset' }, '1h')
            //   send an email
            const html = await readHTMLFile(path.join(__dirname, '../', 'template', 'reset-password.html'))
            const template = handlebar.compile(html)
            console.log(process.env.EMAIL_NOTIFICATION_ADDRESS)
             await sendEmail(process.env.EMAIL_NOTIFICATION_ADDRESS, 'Reset Your Password', email, template({ link: `${process.env.FRONTEND_HOST}reset-password?resetId=${token}` }))
            return {
                data: {},
                error: '',
                message: 'Password reset Link successfully sent to ' + email,
                status: 200
            }
        }
        catch (err: any) {
            logger.error(`${this.req.ip} ${err.message}`)
            return {
                data: null,
                error: err.message ? err.message : err,
                message: '',
                status: 400
            }
        }
    }
    /**
* Change Password endpoint
*/
    @Security('Bearer')
    @Post("/changePassword")
    public async changePassword(@Body() request: { oldPassword: string, newPassword: string }): Promise<IResponse> {
        try {
            const { oldPassword, newPassword } = request;
            const validatedChangePassword = validateChangePassword({ oldPassword, newPassword });;
            if (validatedChangePassword.error) {
                throw new Error(validatedChangePassword.error.message)
            }
            const exists = await getById(userModel, this.userId)
            if (!exists) {
                throw new Error('Invalid Admin')
            }
            const isValid = await verifyHash(oldPassword, exists.password);
            if (!isValid) {
                throw new Error('Password is incorrect')
            }
            const hashed = await genHash(newPassword)
            const updated = await upsert(userModel, { password: hashed }, this.userId)

            return {
                data: {},
                error: '',
                message: 'Password changed successfully!',
                status: 200
            }
        }
        catch (err: any) {
            logger.error(`${this.req.ip} ${err.message}`)
            return {
                data: null,
                error: err.message ? err.message : err,
                message: '',
                status: 400
            }
        }
    }
    /**
* Forgot password api endpoint
*/
    @Security('Bearer')
    @Post("/resetPassword")
    public async resetPassword(@Body() request: { password: string }): Promise<IResponse> {
        try {
            const { password } = request;
            const validatedResetPassword = validateResetPassword({ password });
            if (validatedResetPassword.error) {
                throw new Error(validatedResetPassword.error.message)
            }
            const hashed = await genHash(password)
            const updated = await upsert(userModel, { password: hashed }, this.userId)

            return {
                data: {},
                error: '',
                message: 'Password reset successfully!',
                status: 200
            }
        }
        catch (err: any) {
            logger.error(`${this.req.ip} ${err.message}`)
            return {
                data: null,
                error: err.message ? err.message : err,
                message: '',
                status: 400
            }
        }
    }
}
