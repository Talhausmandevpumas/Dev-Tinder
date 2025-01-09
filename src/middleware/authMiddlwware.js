
import validator from "validator";
import jwt from "jsonwebtoken"
import userModel from "../model/userModel.js";

export const loginAuth =  (req,res,next)=>{
    const {email,password}= req.body
    try {
        if (validator.isEmail(email) !== true) {
            throw new Error(" Emial is not correct")
        } else if (validator.isStrongPassword(password) !== true) {
            throw new Error(" Your password is not strong")
        }
        next()
    } catch (error) {
        res.status(401).send( error.message)
    }
}

export const tokenVerification =  async (req,res,next)=>{
    const {token} = req.cookies
    try {
        await jwt.verify(token,"talhausman",async function(err, decoded) {
            if (err) {
                throw new Error(err.message);
            } else {
                const {id} = decoded
                const findUser = await userModel.findById(id)
                if (!findUser) {
                    throw new Error("user not found")
                }
                next()
            }
          })
        
       
    } catch (error) {
        res.send(error.message)
    }
}