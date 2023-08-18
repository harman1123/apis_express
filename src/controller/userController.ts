import { Route, Controller, Tags, Post, Body, Get, Security, Query } from 'tsoa'
import logger from '../config/logger.config';
import { Request, Response } from 'express'
import { findOne, getById, upsert, getAll } from '../helpers/db.helpers';
import userModel from '../models/user.model';
import { verifyHash, signToken, genHash } from '../utils/common.util';
import { validateduser ,validateProfile} from "../../src/validations/user.validation";

import { IResponse } from '../utils/interfaces.util';


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
}
