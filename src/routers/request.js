import express  from "express"
import requestModel from "../model/requestModel.js"
import userModel from "../model/userModel.js"
const requestRouter = express.Router()

requestRouter.post("/request/:status/:to_id", async (req,res)=>{
    try {
        const {status,to_id} = req.params
        const from_id = req.user._id
        console.log(from_id);
        
        const allowed_status = ["ignored","interested"]
        if (!allowed_status.includes(status)){
            return  res.status(400).json({message:"This status is not Allowed"})
        }
        const find_to_id = await userModel.findById(to_id)
        if (!find_to_id) {
            return res.status(401).json({message:"User Not Found"})
        }
       const request_already_exist = await requestModel.findOne({
            $or: [
                { from_id, to_id },
                { from_id: to_id, to_id: from_id }
            ]
        });

        if (request_already_exist) {
            return res.status(400).json({ message: "Connection request already exists" });
        }
        const save_in_db = new requestModel({
            from_id:from_id,
            to_id:to_id,
            status:status
        })

        const response = await save_in_db.save()
        res.status(200).json({
            message:"Your connection request is send sucessfully"
        })
        
    } catch (error) {
        res.status(400).json({message:"Erro while sending connection request " + error.message})
    }
})
 
requestRouter.post("/request/review/:status/:requester_id", async (req,res)=>{
    try {
        const {status,requester_id} = req.params
        const logedin_id = req.user._id
        console.log(logedin_id,requester_id,status);
        const allowed_status = ["accepted","rejected"]
        if (!allowed_status.includes(status)) {
            throw new Error("Status not allowed");  
        }
        const request_connection = await requestModel.findOne({
            _id:requester_id,
            to_id:logedin_id,
            status:"interested"
        })
        if (!request_connection) {
            throw new Error("No request found");
        }
        request_connection.status = status
        const data = await request_connection.save()
        res.status(200).json({
            message:`Request is ${status}`,
            data:data
        })
        
    } catch (error) {
        res.status(400).json({message:"ERROR " + error.message})
    }
})

requestRouter.get("/feed", async (req,res)=>{
    try {
        const loged_in_user = req.user._id
        const page = parseInt(req.query.page)
        let limit = parseInt(req.query.limit)
        limit > 50 ? 50 :limit
        const skip = (page -1)*limit
        const connections = await requestModel.find({
            $or:[{from_id:loged_in_user},{to_id:loged_in_user}]
        }).select(["from_id","to_id"])
        const set = new Set()
        connections.forEach((row)=>{
            set.add(row.from_id.toString())
            set.add(row.to_id.toString())
        })
        
        const data = await userModel.find({
           _id:{$nin:Array.from(set)}
        }).select("firstName","secondName","age").skip(skip).limit(limit)
        res.send(data)
        
    } catch (error) {
        res.status(200).json({message:"ERROR " + error.message})
    }
})
export default requestRouter