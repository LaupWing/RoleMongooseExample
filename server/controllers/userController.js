const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

async function hashPassword(password){
    return await bcrypt.hash(password, 10)
}

async function validatePassword(plainPassword, hashedPassword){
    return await bcrypt.compare(plainPassword, hashedPassword)
}


exports.signUp = async (req,res,next)=>{
    try{
        const {email, password, role} = req.body
        const hashedPassword = await hashPassword(password)
        const newUser = new User({email,password: hashedPassword, role: role || basic})
        const accesToken = jwt.sign({userId:newUser._id},process.env.JWT_SECRET,{
            expiresIn: '1d'
        })
        newUser.accesToken = accesToken
        await newUser.save()
        res.json({
            data: newUser,
            accesToken
        })
    }catch(error){
        next(error)
    }
}

exports.login = async (req,res,next)=>{
    try{
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user)   return next(new Error('Email does not exist'))
        const validPassword = await validatePassword(password)
        if(!validPassword)  return next(new Error('Password is not correct'))
        const accesToken = jwt.sign({userId:user._id}, process.env.JWT_SECRET,{
            expiresIn: '1d'
        })
        await User.findByIdAndUpdate(user._id, {accesToken})
        res.status(200).json({
            data: {email: user.email, role: user.role},
            accesToken
        })
    }catch(e){
        next(error)
    }
}


exports.getUser = async(req,res,next)=>{
    const users = await User.find({})
    res.status(200).json({
        data: users
    })
}

exports.getUser = async(req,res,next)=>{
    try{
        const userId = req.params.userId
        const user = await User.findById(userId)
        if(!user)   return next(new Error('User does not exist'))
        res.statsu(200).json({
            data: user
        })
    }catch(e){
        next(error)
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const update = req.body
        const userId = req.params.userId;
        await User.findByIdAndUpdate(userId, update);
        const user = await User.findById(userId)
        res.status(200).json({
            data: user,
            message: 'User has been updated'
        });
    } catch (error) {
        next(error)
    }
   }
    
exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        await User.findByIdAndDelete(userId);
        res.status(200).json({
            data: null,
            message: 'User has been deleted'
        });
    } catch (error) {
        next(error)
    }
}
    