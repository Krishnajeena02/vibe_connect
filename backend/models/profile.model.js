import mongoose from 'mongoose';





const profileSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },

    bio:{
        type:String,
        default:"",
    },

    

   
});

 const Profile = mongoose.model("Profile", profileSchema);
 export default Profile;
