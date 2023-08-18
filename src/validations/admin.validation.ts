import joi from '@hapi/joi';

const schema = joi.object({
    email: joi.string().trim().email().min(4).max(35).required(),
    password: joi.string().min(4).max(20).required(),
})


const adminProfileSchema = joi.object({
    firstName: joi.string().trim().min(4).max(20).required(),
    lastName: joi.string().min(4).max(20).required(),
    email: joi.string().trim().email().min(4).max(35).required(),
    password: joi.string().min(4).max(20).required(),
})

const forgotPasswordSchema = joi.object({
    email: joi.string().trim().email().min(4).max(35).required()
})

const validateResetPasswordSchema = joi.object({
    password: joi.string().min(4).max(20).required(),
})
const validateChangePasswordSchema = joi.object({
    oldPassword: joi.string().min(4).max(20).required(),
    newPassword: joi.string().min(4).max(20).required(),
})

export const validateAdmin = (admin: any) => {
    return schema.validate(admin)
}

export const validateProfile = (admin: any) => {
    return adminProfileSchema.validate(admin)
}

export const validateForgotPassword = (admin: any) => {
    return forgotPasswordSchema.validate(admin)
}

export const validateResetPassword = (admin: any) => {
    return validateResetPasswordSchema.validate(admin)
}

export const validateChangePassword = (admin: any) => {
    return validateChangePasswordSchema.validate(admin)
}