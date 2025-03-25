import express from "express"
import bcrypt from "bcrypt"
import userModel from "../model/userModel.js"
import jwt from "jsonwebtoken"
import { loginAuth } from "../middleware/authMiddlwware.js"
import { now } from "mongoose"
const authRouter = express.Router()

authRouter.post("/signup",loginAuth,async (req,res)=>{ 
    const {firstName,secondName,email,password,gender,age} = req.body  
    const saltRounds = 10;
    try {
    const bcryptedPass = await bcrypt.hash(password, saltRounds);
    const user = new userModel({
        firstName,
        secondName,
        email,
        password:bcryptedPass,
        gender,
        age,
        profile_pic,
        skills,
    });
    await user.save()
    res.send("user is signup successfully")
    } catch (error) {
        res.status(404).send(error.message )
    }
})

authRouter.post("/login",async (req,res)=>{
    const {email,password} = req.body
    try {
        const dbResponse = await userModel.findOne({email:email})
        if (dbResponse) {
            const hashPassword = dbResponse.password
            const id = dbResponse._id
            const compiringPass = await bcrypt.compare(password,hashPassword)
            if (compiringPass !== true) {
                throw new Error("Invalid Password")
            }
            const token = jwt.sign({id:id},"talhausman",{algorithm : "HS256" ,expiresIn : "1h"})
            res.cookie("token",token)
            res.send("You are login successfully")
        } else {
            throw new Error("Invalid Email")
        }
        
    } catch (error) {
        res.send("Invalid credentials  " + error.message)
    }
})

authRouter.post("/logout",async (req,res)=>{
    res.cookie("token", null,{expires: new Date(Date.now())})
    res.send("you are sucessfully logout") 
})
export default authRouter