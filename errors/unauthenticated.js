const {StatusCodes}=require('http-status-codes')
const CustomApiError=require('./customApiError')
class UnauthenticatedError extends CustomApiError{
    constructor(mssg){
        super(mssg)
        this.statusCode=StatusCodes.UNAUTHORIZED
    }
}
module.exports=UnauthenticatedError