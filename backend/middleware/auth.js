const User=require('../models/user')
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../config');
const config = require('../config');

// check if user is authenticated or not
exports.isAuthenticatedUser = async(req,res,next)=>{

    const {token} = req.cookies;

    console.log(token);

    if(!token){
        return res.status(401).json({
            success:false,
            message:'login to see the products'
        })
    }
    const decoded=jwt.verify(token ,config.JWT_SECRET);
    req.user =await User.findById(decoded.id);

    next();

}

// handling user roles user or admin

exports.authorizeRoles =(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success:false,
                message:`Role (${req.user.role}) is not allowed to access this`
            })
        }
        next()
    }
}

