const errorHandle = (ctx, next) => {
    return next().catch((err) => {
        if(err.status === 401){
            ctx.status = 401;
            ctx.body={
                code: 401,
                success:false,
                message: '未授权，访问被拒绝'
            }
            throw err; 
        }else{
            throw err;
        }
    })
}

module.exports = errorHandle;