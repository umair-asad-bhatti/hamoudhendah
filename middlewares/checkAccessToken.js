const checkAccessToken=(req,res,next)=>{
    console.log(req.headers)
    next()
}
module.exports=checkAccessToken