import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import ConnectionRequest from "../models/connection.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
// import cloudinary from "../utils/cloudinary.js"; 





export const register = async (req, res) => {
    try {

        const { username, email, password, name } = req.body;

        if (!username || !email || !password || !name) {
            return res.status(400).json({ error: "please fill all the fields" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "user already exists" })
        }

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            name,
            username,
            email,
            password: hashPassword,
        });
        await newUser.save();

        const profile = new Profile({ userId: newUser._id })
        await profile.save();
        return res.json({ message: "User register succesfully" });

    }
    catch (error) {
        return res.status(500).json({ error: error.message });

    }


};

 export const login = async (req,res)=>{
    try{

    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({error:"all fields are required"});
    }

    const user = await User.findOne({email})
    // console.log(user)
    if(!user){
        return res.status(404).json({message:"user does not exist"})
    }
      if (!user.password) {
      return res.status(400).json({ message: "This account is registered with Google. Please continue with Google login." });
    }

    const isMatch = await  bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(400).json({message:"invalid password"})
    };

    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({_id:user._id}, {token})
    // user.token = token;
    // await user.save();
    // console.log(token)


    return res.json({message:"user login succesfully",token});

    }

    catch(error){
        return res.status(500).json({error:error.message});
    }

};



export const uploadProfilePicture = async (req,res)=>{

    try{

   
    const {token} = req.body;
    // console.log(token)
    

    const user = await User.findOne({token:token})

    // console.log(user)

    if(!user){
        return res.status(404).json({message:"user not found"})
    }

    user.profilePicture=req.file.path;
    await user.save();

    return res.json({message:"profile picture uploaded",url: req.file.path})
}
catch(error){
    return res.status(500).json({error :error.message});
}

};

export const updateUserProfile = async (req,res)=>{
    try{

        const{token, ...newUserData} = req.body;
// console.log("Incoming Data:", req.body); // ✅ Log incoming data
        const user = await User.findOne({token:token});

        if(!user){
            return res.status(400).json({message: "user not found"})
        }
        const {username, email} = newUserData;

        const existingUser = await User.findOne({ $or: [{username}, {email}]});

        if(existingUser){
            if(existingUser || String(existingUser._id) !== String(user._id)){
                
                return res.status(400).json({message: "user already exists"})
            }
            
        }

        Object.assign(user, newUserData);
        await user.save();

        return res.json({message: "user updated"});




    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
}

export const getUserAndProfile = async (req,res)=>{
    try{
        const {token} = req.query;
        // console.log(`token: ${token}`)

    const user = await User.findOne({token:token});
    if(!user){
        return res.status(400).json({message:"user not found"})
    }

    const userProfile = await Profile.findOne({userId:user._id})
    .populate("userId", "name email username profilePicture");
    return res.json({profile:userProfile})

    }
    catch(error){
        return res.status(500).json({error: error.messsage})
    }
}


export const updateProfileData =  async  (req,res)=>{
    try{

        const {token, ...newProfileData} =  req.body;

        const user = await User.findOne({token:token})

        if(!user){
            return res.status(400).json({messege:" user profile not found"})
        }

        const profile_to_update = await Profile.findOne({userId: user._id})

        Object.assign(profile_to_update, newProfileData);

        await profile_to_update.save();
        return res.json({messege:"profile updated"})

    }
    catch(error){
        return res.status(500).json({error:error.message})
    }
}

export   const getAllUserProfile = async (req,res)=>{

try{
    const profiles =  await Profile.find().populate("userId", "name username email profilePicture ");

    return res.json({profiles})
    



}
catch(error){
    return res.status(500).json({error:error.message})

}
}




export const sendConnectionRequest = async (req,res)=>{

    const {token, connectionId} =  req.body;

    try{

        const user = await User.findOne({token:token});

        if(!user){
            return res.status(400).json({messege:"user not found"});


        }

         const connectionUser = await User.findById(connectionId);
        //  console.log(connectionId)
    if (!connectionUser) {
      return res.status(400).json({ message: "Connection user not found" });
    }

        //  Check if a request already exists in any direction
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { userId: user._id, connectionId: connectionUser._id },
        { userId: connectionUser._id, connectionId: user._id }
      ]
    });

        if(existingRequest){
            return res.status(400).json({messege:"request already send"});
        }

        const request = new ConnectionRequest({
            userId: user._id,
            connectionId: connectionUser._id

        });
        request.save();

        return res.json({message:"Request sent"})

    }
    catch(error){
        return res.status(500).json({error:"error.message"})
    }
}

export const getConnectionRequests = async (req,res)=>{
    const {token } = req.query;
    try{


        const user  = await User.findOne({token});

        if(!user){
            return res.status(400).json({messege:"user not found"});

        }

        const connections = await ConnectionRequest.find({userId:user._id})
        .populate("connectionId", "name email username, profilePicture")

        return res.json({connections})
    }

    catch(error){
        return res.status(500).json({error:"error.message"});
    }
}

export const whatAreMyConnection = async (req, res) => {
  const { token } = req.query;

  try {
    // Find logged-in user
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Get all connections where the user is sender or receiver
    const connections = await ConnectionRequest.find({
      $or: [
        { userId: user._id },
        { connectionId: user._id }
      ]
    })
      .populate("userId", "name username email profilePicture")
      .populate("connectionId", "name username email profilePicture");

    // Format so `userId` always refers to the *other* user
    const formatted = connections.map(conn => {
      const otherUser = conn.userId._id.equals(user._id)
        ? conn.connectionId
        : conn.userId;

      return {
        _id: conn._id,
        userId: otherUser, // overwrite to always be the other person
        status_accepted: conn.status_accepted
      };
    }).filter(conn => conn.userId._id.toString() !== user._id.toString());

    res.json(formatted);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};


export const acceptConnectionRequest = async (req,res)=>{
    const{token,requestId, action_type} = req.body;
    
 

    try{

        const user = await User.findOne({token});
        

        if(!user){
    return res.status(400).json({message:"user not found"})


        }

        const connection = await ConnectionRequest.findOne({_id:requestId})
if(!connection){
    return res.status(400).json({message:"connections  not found"})

    
}
if(action_type === "accept"){
    connection.status_accepted = true;
}

else{
    connection.status_accepted = false;
}

await connection.save();
return res.json({message:"request updated"})
    }

    catch(error){
        return res.status(500).json({error:error.message})
    }
}



    export const getUserProfileAndUserBasedOnUserName = async (req,res)=>{
        const {username} = req.query;

        try{
                   const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });


            if(!user){
                return res.status(400).json({message:"user not found"})
            }

            const userProfile = await Profile.find({userId:user._id}).populate("userId", "name username email profilePicture")

            return res.json({"Profile":userProfile})
        }catch(error){
            return res.status(500).json({error:error.message})
        }
    }