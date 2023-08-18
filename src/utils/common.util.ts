import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';

export const genHash = (stringValue: string): Promise<string> => {
    return new Promise((res, rej) => {
        bcrypt.genSalt(10, function (err: any, salt: string) {
            if (err) {
                rej(err.message)
            }
            bcrypt.hash(stringValue, salt, async (err: any, hash: string) => {
                if (err) {
                    rej(err.message)
                }
                res(hash);
            });
        });
    })
}
export const verifyHash = (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
}

export const convertIdToObjectId = (id: string) => {
    return new Types.ObjectId(id);
}


export const signToken = async (id: string, extras ={}, expiresIn = '7d') => {
    return new Promise((res, rej) => {
        jwt.sign({id, ...extras}, process.env.SECRET as string, {
            expiresIn
        }, (err: any, encoded: any) => {
            if (err) {
                rej(err.message);
            } else {
                res(encoded);
            }
        })
    })
}

export const verifyToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET as string);
        return decoded;
    }
    catch(err) {
        return null;
    }
}