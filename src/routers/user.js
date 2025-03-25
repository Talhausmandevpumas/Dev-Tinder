import express from "express"
import requestModel from "../model/requestModel.js"

const user_router = express.Router()

user_router.get("/requests/recived", async (req,res)=>{
    try {
        const logedin_id = req.user._id
        const result = await requestModel.find({
            to_id:logedin_id,
            status:"interested"
        }).populate("from_id",["firstName","secondName","age","skills"])
        res.status(200).json({message:"All requests are fetched",data:result})
    } catch (error) {
        res.status(400).json({message:"ERROR " + error.message})
    }
})

user_router.get("/requests/accepetd", async (req,res)=>{
    try {
        const loged_in_user = req.user._id
        const populated_data = ["firstName","secondName","age"]
        const result = await requestModel.find({
            $or:[
                {from_id:loged_in_user,status:"accepted"},
                {to_id:loged_in_user,status:"accepted"}
            ]
        }).populate("from_id",populated_data).populate("to_id",populated_data)
       const data = result.map((row)=>{
            if (loged_in_user.toString() === row.from_id.toString()) {
                console.log("hello"); 
                return row.to_id
            }
            return row.from_id
        })
        
        res.json({data:data})
    } catch (error) {
        res.status(400).json({message:"ERROR " + error.message})
    }
})
export default user_router