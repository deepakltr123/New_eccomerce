class ErrorHander extends Error{
    constructor(message,statusCode){
        super(message);/*
        This invokes the constructor of the parent class, which in this case is the Error class.
        By passing message to super(), the message parameter is effectively passed to the constructor of the Error class. 
        This sets the error message for the custom error object being created.*/

        this.statusCode=statusCode

        Error.captureStackTrace(this,this.constructor);
    }
}
module.exports=ErrorHander;