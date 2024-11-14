import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserModel from '../models/User.js'; 



//cehckin pass 
export const comparePassword=(password,hash)=>{
    return bcrypt.compare(password,hash)
}


export const  hashPassword=(password)=>{
    return bcrypt.hash(password,10)
}
export const createJWT=(user)=>{
    const token =jwt.sign(
        {
            username:user.username,
            _id:user._id,
        },
        process.env.JWT_SECRET,
        {expiresIn:"1hr"}
        )
    return token;
}
  

export const protect =(req,res,next) =>{
    const bearer=req.headers.authorization

    //checking if we have token or not
    if(!bearer){
        res.status(401)
        res.json({message:'not authorised'})
        return
    }

    //now we grab the token from bearer to check if it exist

    const [,token]=bearer.split(' ')
    if(!token){
        res.status(401)
        res.json({message:'not valid token'})
        return
    }
    // this verifis that the token sended is correct if yest then it allows to next handler 
    //or middleware otherwis we get error
    try{
        const user=jwt.verify(token,process.env.JWT_SECRET)
        req.user=user
        next()
    }catch(e){
        res.status(401)
        res.json({message:'not valid token'})
        return
    }
}