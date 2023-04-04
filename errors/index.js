const BadRequest=require('./badRequest')
const NotFound= require('./notFound')
const UnauthenticatedError=require('./unauthenticated')
const CustomApiError=require('./customApiError')
module.exports= {
    BadRequest,
    NotFound,
    UnauthenticatedError,
    CustomApiError
}