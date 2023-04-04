class CustomApiError extends Error{
    constructor(mssg){
        super(mssg)
    }
}
module.exports=CustomApiError