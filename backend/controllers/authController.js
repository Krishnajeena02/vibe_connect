import jwt from "jsonwebtoken";
import Profile from "../models/profile.model.js"; // make sure path is correct

export const handleGoogleCallback = async (req, res) => {
  try {
    const user = req.user; // from passport/google strategy

    // 1️⃣ Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 2️⃣ Save token to user
    user.token = token;
    await user.save();

    // 3️⃣ Ensure profile exists
    let profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      profile = await Profile.create({
        userId: user._id,
        profilePicture:"/uploads/default.jpg",
        bio: "",
        location: "",
        // any other defaults
      });
    }

    // 4️⃣ Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
};
