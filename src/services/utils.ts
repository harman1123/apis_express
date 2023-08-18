import fs from 'fs'
import moment from 'moment';
import { Parser } from 'json2csv'
import path from 'path';

export const readHTMLFile = async function (path: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const read = await fs.promises.readFile(path, { encoding: 'utf-8' })
            resolve(read)
        }
        catch (err) {
            reject(err)
        }

    })
};

export const generateRandomOtp = () => {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

export const getFilterMonthDateYear = (date: string) => {
    return moment(date).add(1, 'day').format('YYYY-MM-DD')
}


export const getCSVFromJSON = (fields: any, json: any) => {
    const parser = new Parser({fields});
    return parser.parse(json);
}

export const getFileUrl = (fileName: string) => {
    return process.env.ENVIRONMENT === 'production' ? `${process.env.SERVER_HOST}/uploads/${fileName}` : `http://localhost:${process.env.PORT}/uploads/${fileName}`
}

export const getAssetUrl = () => {
    return process.env.ENVIRONMENT === 'production' ? `${process.env.SERVER_HOST}/uploads/` : `http://localhost:${process.env.PORT}/uploads/`
}

export const removeFile = async (fileName: string) => {
    return await fs.promises.unlink(path.join(__dirname, '../', '../', 'public', 'uploads', fileName))
}