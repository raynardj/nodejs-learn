function read_env(sysenv){
    return sysenv=="true"? true:false
}
module.exports = {
    log_header:read_env(process.env.LOG_HEADER)
}