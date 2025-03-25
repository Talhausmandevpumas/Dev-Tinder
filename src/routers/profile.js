import express from "express"
// import { tokenVerification } from "../middleware/authMiddlwware.js"
const profileRouter = express.Router()

profileRouter.get("/profile",(req,res)=>{
  res.status(200).json({data:req.user})
})

profileRouter.patch("/edit", async (req,res)=>{
    
})

export default profileRouter