import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        require:true
    },
    secondName:{
        type:String
    },
    email:{
        type:String,
        require:true,
        unique : true
    },
    password:{
        type:String
    },
    age:{
        type:Number
    },
    gender:{
        type:String
    }
});

const userModel = mongoose.model("Users",userSchema);
export default userModel