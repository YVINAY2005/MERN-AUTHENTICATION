import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const userAuth = (req, res, next) => {
    // Check if cookies exist
    if (!req.cookies) {
        console.error("No cookies found on request");
        return res.json({success:false, message: "Unauthorized, Login Again"});
    }
    const {token} = req.cookies;
    if (!token) {
        console.error("No token found in cookies:", req.cookies);
        return res.json({success:false, message: "Unauthorized, Login Again"});
    }
    try {
        const TokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        if (TokenDecoded) {
            // Attach userId to req, not req.body
            req.userId = TokenDecoded.id;
        } else {
            console.error("Token could not be decoded:", token);
            return res.json({success:false, message: "Unauthorized, Login Again"});
        }
        console.log("Cookies:", req.cookies);
        console.log("Auth Header:", req.headers.authorization);
        next();
    } catch (error) {
        console.error("JWT verification error:", error);
        res.json({success:false, message: "Something went wrong , Try Again"});
    }
}

export default userAuth;