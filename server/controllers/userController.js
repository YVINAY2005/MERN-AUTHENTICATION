import UserModels from "../models/usermodel.js";


export const getUserData= async (req, res) => {
    try {
        const userId = req.userId;
        const user = await UserModels.findById(userId)
        if(!user){
            return res.json({success:false, message:"User not found"});
        }
        return res.json({success:true, message:"User data fetched successfully", userData: {
            name: user.name,
            email: user.email,
            isAccountVerified: user.isAccountVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }});
    } catch (error) {
        return res.json({success:false, message:error.message});
    }
}