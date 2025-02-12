// const joi = require('joi')
const joi = require('joi')

const authSchema = joi.object({
    fullName: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    role: joi.string().valid('student', 'lecturer').required(),
    courseName: joi.string().required() })

module.exports= {authSchema}