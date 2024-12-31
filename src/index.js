import express from "express";
import DBconnsection from "./config/dbconnection.js";
import userModel from "./model/userModel.js";
const app = express()
const port = 3009    

app.post("/signup",async (req,res)=>{
    const users =  req.body
    console.log(users);
 const usersdata = {
    firstName:"Talha Usman",
    email: "talhausman@gmail.com",
    password: "11223344"
}
const user = new userModel(usersdata);
await user.save()
res.send("user is signup successfully")
})

await DBconnsection().then(()=>{
    console.log("connected to the db");
    app.listen(port,()=>{console.log(`server is listing on the port number  ${port}`);
})
}).catch(()=>{console.log("there is some error"); 
})
 