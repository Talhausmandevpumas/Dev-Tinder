import express from "express";
import DBconnsection from "./config/dbconnection.js";
import userModel from "./model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { loginAuth, tokenVerification } from "./middleware/authMiddlwware.js";
import cookieParser from "cookie-parser";

const app = express()
const port = 3009 


app.use(express.json()) 
app.use(cookieParser())
app.use("/signup",loginAuth)


app.post("/signup",async (req,res)=>{ 
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
        age
    });
    await user.save()
    res.send("user is signup successfully")
    } catch (error) {
        res.status(404).send(error.message )
    }
})

app.post("/login",async (req,res)=>{
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
            const token = jwt.sign({id:id},"talhausman",{algorithm : "HS256"})
            res.cookie("token",token)
            res.send("You are login successfully")
        } else {
            throw new Error("Invalid Email")
        }
        
    } catch (error) {
        res.send("Invalid credentials  " + error.message)
    }
})

app.get("/allusers",tokenVerification,(req,res)=>{
  res.send("testing")
})
await DBconnsection().then(()=>{
    console.log("connected to the db");
    app.listen(port,()=>{console.log(`server is listing on the port number  ${port}`);
})
}).catch(()=>{console.log("there is some error"); 
})
 