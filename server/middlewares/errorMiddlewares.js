class errorHandler extends Error{
  constructor(message,status){
    super(message);
    this.statusCode = statusCode;
  }
}


export const errorMiddleware = (err, req, res, next) => {

}
