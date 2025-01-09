import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        require:true,
        minLenght :8
    },
    secondName:{
        type:String,
        minLenght:8
    },
    email:{
        type:String,
        require:true,
        unique : true,
        trim :true,
        lowercase: true
    },
    password:{
        type:String,
        minLenght:8
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if (!["male","female","other"].includes(value)) {
                throw new Error("this is not a valied gender")
            }
        },
    }
},{timestamps:true});

const userModel = mongoose.model("Users",userSchema);
export default userModel