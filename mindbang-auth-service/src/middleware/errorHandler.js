const { stack } = require("../app");

function errorHandler(err, req, res, next) {
   console.error('[ERROR]',err.message,err.stack);

   const stadusCode = err.statusCode || 500;
   res.status(stadusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ?  err.stack:undefined
   });
 }  

 module.exports = errorHandler;