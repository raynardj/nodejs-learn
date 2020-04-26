const config = require("../config")
function logger(req,res,next){
    if(config.log_header)console.log(req.headers)
    const {method,url,} = req
    next()
    const {host} = req.headers
    console.log(`*${host}>>[${method}][${res.statusCode}]${url}`)
}
module.exports = logger