import mongoose from "mongoose";

const DBconnsection = async ()=>{ 
    await mongoose.connect("mongodb+srv://talhausman4:imCutqriZbqQQve8@nodeproject.va9w1.mongodb.net/tinder")
    };

export default DBconnsection;
