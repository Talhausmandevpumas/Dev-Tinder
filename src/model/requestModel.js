import mongoose from "mongoose";

const request_schema = new mongoose.Schema({
    from_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "Users",
        required:true
    },
    to_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "Users",
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["interested","ignored","accepted","rejected"],
            message:"{Value} is not allowed"
        }
    }
},{timestamps:true})

request_schema.index({from_id:1,to_id:1})

// this is pre function of mongo DB it is like ka middel ware it runs before every (save) function 
request_schema.pre("save",  function (next) {
    const connection_request = this;       
    if (connection_request.from_id.equals(connection_request.to_id)) {
        return next(new Error("Cannot send a request to yourself"));
    }
    next()
})

const requestModel = mongoose.model("Connections",request_schema)



export default requestModel