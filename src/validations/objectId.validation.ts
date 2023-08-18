import joi from '@hapi/joi';
// @ts-ignore
joi['objectId'] = require('joi-objectid')(joi)

// @ts-ignore
const schema = joi.objectId()

export const validateObjectId = (id: string) => {
    return schema.validate(id)
}