const { StatusCodes } = require('http-status-codes');
const CustomApiError=require('./customApiError')
class BadRequest extends CustomApiError{
    constructor(mssg){
        super(mssg)
        this.statusCode=StatusCodes.BAD_REQUEST
    }
}
module.exports=BadRequest