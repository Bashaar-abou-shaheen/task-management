const jwt = require("jsonwebtoken")

module.exports = (req,res,next)=>{
    const authHeader = req.get('Authorization')
    if(!authHeader){
        const error = new Error('you aren\'t authinticated')
        error.statusCode = 401;
        throw error
    }
    const token = authHeader.split(' ')[1]
    let decodedToken
    try{
        decodedToken = jwt.verify(token ,"kylianmbappe" )
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        throw (err)
    }
    if(!decodedToken){
        const error = new Error("an correct token")
        error.statusCode = 404
        throw error
    }
    if(!decodedToken.adminId){
        const error = new Error("You are not admin")
        error.statusCode = 404
        throw error
    }
    req.userId = decodedToken.adminId
    next() 
}