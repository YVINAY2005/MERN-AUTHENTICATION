import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";   
import UserModels from "../models/usermodel.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }

  try {
    const ExistingUser = await UserModels.findOne({ email });
    if (ExistingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await new UserModels({
      name,
      email,
      password: hashedPassword,
    }).save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });
// sending welcome email to user
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Welcome to Vinay!",
      text: `welcome to Vinay Website, ${user.name}. Your account has been successfully created.with email id:${email}`,
    }
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Welcome email sent:", info);
    } catch (mailErr) {
      console.error("Error sending welcome email:", mailErr);
    }

    return res.json({
      success: true,
      message: "Registered successfully",
      user,
      token,
    });
  } catch (error) {
    return res.json({success:false, message: error.message });
  }
}


export const login = async(req, res) => {
  const { email, password } = req.body;

    if (!email || !password) {
      return res.json({success:false, message: "All fields are required" });
    }

    try {

        const user = await UserModels.findOne({email});
        console.log(user);
        
        if (!user) {
          return res.json({success:false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.json({success:false, message: "Incorrect password" });
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/'
        });

        return res.json({success:true, message: "Logged in successfully" , user, token});

    } catch (error) {
        return res.json({success:false, message: error.message });
        
    }
}

export const logout = async(req, res) => {
   try {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        path: '/',
        maxAge: 0
    });
    return res.json({success:true, message: "Logged out successfully" });

   } catch (error) {
    return res.json({success:false, message: error.message });

   }
}

// send verify otp to email
export const sendVerifyOtp = async (req, res) => {
  try {
    console.log("sendVerifyOtp body:", req.body);

    // Use req.userId instead of req.body.userId
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId in request" });
    }

    const user = await UserModels.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({ success: false, message: "Account is already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyOtp = otp;
    user.verifyOtpExpired = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    console.log("Generated OTP for user:", user.email, otp);

    try {
      const info = await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Your Account Verification OTP",
        text: `Your OTP is ${otp}. It expires in 24 hours.`,
      });
      console.log("OTP email sent:", info);
    } catch (mailErr) {
      console.error("Error sending OTP email:", mailErr);
      return res.status(500).json({ success: false, message: "Failed to send OTP email" });
    }

    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("sendVerifyOtp error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};



//?verify email with otp
export const verifyEmail=async(req,res)=>{
  // Use req.userId if available, else fallback to req.body.userId for backward compatibility
  const userId = req.userId || req.body.userId;
  const { otp } = req.body;
  if(!userId || !otp){
    return res.json({success:false, message:"All fields are required"});
  }

  try {
    const user=await UserModels.findById(userId);
    if(!user){
      return res.json({success:false, message:"User does not exist"});
    }

    if(user.verifyOtp !== otp||user.verifyOtp==''){
      return res.json({success:false, message:"Invalid OTP"});

    }
    if(user.verifyOtpExpired < Date.now()){
      return res.json({success:false, message:"OTP has expired"});
    }
    user.isAccountVerified=true;
    user.verifyOtp='';
    user.verifyOtpExpired=0;
    await user.save();
    return res.json({success:true, message:"Account verified successfully", user});
    
  } catch (error) {
    return res.json({success:false, message:error.message});
  }
}

export const isAuthenticated=async(req,res)=>{
  try {
    return res.json({success:true, message:"User is authenticated", userId:req.userId});
    
  } catch (error) {
    return res.json({success:false, message:error.message});
    
  }
}


//send reset password otp to email

export const sendResetPasswordOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({success:false, message: "Email is required" });
  }

  try {
    const user = await UserModels.findOne({ email });
    if (!user) {
      return res.json({success:false, message: "User does not exist" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpired = Date.now() + 15 * 60 * 1000;
    await user.save();

    const info = await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Reset Your Password",
      text: `Your Reset Password OTP is ${otp}. It expires in 15 min.`,
    });
    console.log("Reset password OTP email sent:", info);

    return res.json({success:true, message: "Reset password OTP sent to your email"});
  } catch (error) {
    return res.json({success:false, message: error.message });
  }
}


//reset password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.json({success:false, message: "All fields are required" });
  }
  try {
    const user = await UserModels.findOne({ email });
    if (!user) {
      return res.json({success:false, message: "User does not exist" });
    }
    if (user.resetOtp !== otp || user.resetOtp === '') {
      return res.json({success:false, message: "Invalid OTP" });
    }
    if (user.resetOtpExpired < Date.now()) {
      return res.json({success:false, message: "OTP has expired" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpired = 0;
    await user.save();
    return res.json({success:true, message: "Password reset successfully" });

    
  } catch (error) {
    return res.json({success:false, message: error.message });
  }
}



