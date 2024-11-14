import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
    username:{type: String, required: true, unique:true},
    password:{type: String, required: true},
    isAdmin:{
        type:Boolean,
        default:false,
    },
});

const UserModel=mongoose.model("usersCMA",UserSchema);
export default UserModel;