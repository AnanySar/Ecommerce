const { compareSync } = require('bcrypt');
const User =require('../models/user');
const sendToken = require('../utils/jwtToken');
const sendMail =require('../utils/sendEmail')
const crypto=require('crypto');
const cloudinary = require('cloudinary');
const {FRONTEND_URL} = require('../config'); // to be remove after

// register user

exports.registerUser= async(req,res,next)=>{

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: "scale"
    })

    const{name,email,password} =req.body;

    //check email and password enter by user
    if(!email||!password||!name){
        return res.status(400).json({ error: "one or more mandatory field are empty" })
    }


    const user=await User.create({
        name,email,password,
        avatar:{
            public_id: result.public_id,
            url: result.secure_url
        }
    })


    sendToken(user,200,res)

}

//login user 
exports.loginUser= async(req,res,next)=>{
    const{email,password}=req.body;

    //check email and password enter by user
    if(!email||!password){
        return res.status(400).json({ error: "one or more mandatory field are empty" })
    }

    //finding user in datbase
    const user = await User.findOne({email}).select('+password')
    if(!user){
        return res.status(401).json({ error: "invalid credenatials" })
    }

    //checks password is correct or not 
    const isPasswordMatched=await user.comparePassword(password);
    if(!isPasswordMatched){
        return res.status(401).json({ error: "invalid credenatails" })
    }
    
    sendToken(user,200,res)


}

// Forget password 
exports.forgetPassword=async(req,res,next)=>{
    const user =await User.findOne({email:req.body.email});
    if(!user){
        return res.status(404).json({ error: "user not found with this email" })
    }
    // get reset token
    const resetToken = user.getResetPasswordToken();
    

    // have validate false before save to bypass the validation check 
    await user.save({validateBeforeSave:false})

    
    

    //reset password url
    const resetUrl = `${FRONTEND_URL}/password/reset/${resetToken}`;

    // message in email to be send
    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`

    try {

        await sendMail({
            email:user.email,
            subject:'Ecommerce Password Recovery',
            message
        })
        
        res.status(200).json({
            success:true,
            message:`Email sent to : ${user.email}`
        })

        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return res.status(500).json({error:'internal server error'})
        
    }



}
// Reset Password
exports.resetPassword=async(req,res,next)=>{

    // hash Url token
    const resetPasswordToken= crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })

    if(!user){
        return res.status(400).json('Password reset token is invalid or expired')
    }
    // check password matched or not
    if(req.body.password!==req.body.confirmPassword){
        return res.status(400).json('Password does not match')
    }

    //setup new password
    user.password=req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200,res)

}

//  Get currently logged in user details
exports.getUserProfile=async(req,res,next)=>{
    const user =await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    })
}

// update or chance password
exports.updatePassword =async(req,res,next)=>{
    const user =await User.findById(req.user.id).select('+password');

    //check previous user password
    const isMatched= await user.comparePassword(req.body.oldPassword)
    if(!isMatched){
        return res.status(400).json('old Password is incorrect')
    }

    user.password=req.body.password;
    await user.save();

    sendToken(user,200,res)
}

// update user profile 
exports.updateProfile = async (req, res, next) => {
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
        };

        // Check if there is an avatar update
        if (req.body.avatar !== '') {
            const user = await User.findById(req.user.id);

            // Destroy the previous avatar on Cloudinary
            const image_id = user.avatar.public_id;
            await cloudinary.v2.uploader.destroy(image_id);

            // Upload the new avatar to Cloudinary
            const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: 'avatars',
                width: 150,
                crop: 'scale',
            });

            newUserData.avatar = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        }

        // Update the user profile in the database
        const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData);

        if (!updatedUser) {
            // If the user was not found, return an error response
            return res.status(404).json({ error: 'User not found' });
        }

        // Send a success response
        res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
};





// logout User  and clear cookie 

exports.logout = async(req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly: true

    })
    res.status(200).json({
        success:true,
        message:'Logged Out Successfully'
    })
}

// ADmin Routes

//get all users
exports.allUsers= async(req,res,next)=>{
    const users=await User.find();

    res.status(200).json({
        success:true,
        users
    })
}

// getting all user details
exports.getUserDetails=async(req,res,next)=>{
    const user =await User.findById(req.params.id);

    if(!user){
        return res.status(400).json(`user does not found with id: ${req.params.id}`)
    }

    res.status(200).json({
        sucess:true,
        user
    })
}

// update user profile by admin
exports.updateUser=async(req,res,next)=>{
    // checking all three data is filled  it can we late add on updateprofile code also -todo
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
        return res.status(400).json({ error: "Name, email, and role are required fields." });
    }

    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role

    }
    

    const user = await User.findByIdAndUpdate(req.params.id,newUserData)

    res.status(200).json({
        success:true
    })
       
}

// delete user 
exports.deleteUser=async(req,res,next)=>{
    const user =await User.findById(req.params.id);

    if(!user){
        return res.status(400).json(`user does not found with id: ${req.params.id}`)
    }
    // remove avatar from cloundinary-todo

    await user.deleteOne();

    res.status(200).json({
        sucess:true,
        
    })
}




