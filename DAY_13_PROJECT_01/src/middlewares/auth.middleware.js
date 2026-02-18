const jwt = require('jsonwebtoken')

async function identifyUser(req,res,next){
    const token = req.cookies.token;
        if(!token){
            return res.status(401).json( {message:'Unauthorised Access'} )
        } 
        let decoded = null
        try{
            decoded = jwt.verify(token,process.env.JWT_SECRET)
            console.log(decoded);
        } catch(err){
            return res.status(401).json({message : 'User not Authorized'})
        }

        req.user = decoded
        next()
}

module.exports = identifyUser;