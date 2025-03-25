import express from "express";
import DBconnsection from "./config/dbconnection.js";
import { loginAuth, tokenVerification } from "./middleware/authMiddlwware.js";
import cookieParser from "cookie-parser";
import authRouter from "./routers/auth.js";
import profileRouter from "./routers/profile.js";
import requestRouter from "./routers/request.js";
import user_router from "./routers/user.js";

const app = express()
const port = 3009 


app.use(express.json()) 
app.use(cookieParser())
app.use("/auth",authRouter)
app.use("/",tokenVerification)
app.use("/user",profileRouter)
app.use("/connsection",requestRouter)
app.use("/user",user_router)

await DBconnsection().then(()=>{
    console.log("connected to the db");
    app.listen(port,()=>{console.log(`server is listing on the port number  ${port}`);
})
}).catch(()=>{console.log("there is some error"); 
})
 