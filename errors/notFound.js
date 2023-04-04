const { StatusCodes } = require('http-status-codes');
const CustomApiError=require('./customApiError')
class NotFound extends CustomApiError{
    constructor(mssg){
        super(mssg)
        this.statusCode=StatusCodes.NOT_FOUND
    }
}
module.exports=NotFound