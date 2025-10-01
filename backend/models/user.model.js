 import mongoose from 'mongoose';
 
 const userSchema = mongoose.Schema({
 googleId: {
    type: String,
    unique: true,
    sparse: true
  },
 name:{
    type:String,
    required:false
 },
 
 username:{
     type:String,
     required:true,
     unique:true,
 
 },
 
 email:{
     type:String,
     required:true,
     unique:true,
 
 },

password: {
  type: String,
  required: function () {
    return !this.googleId;
  },
},

 profilePicture:{
    type:String,
    default:"default.jpg",
    //  set: (value) => (value && value.trim() !== "" ? value : "default.jpg"),
 },
 
 
 createdAt:{
     type:Date,
     default:Date.now,
 
 },
 
 token:{
     type:String,
     default:"",
 
 },
 
 active:{
 type:Boolean,
 default:true
 },
 
 })
 
 const User = mongoose.model("User", userSchema);
 export default User;