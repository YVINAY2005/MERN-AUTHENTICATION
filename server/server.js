import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
dotenv.config();
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
const app = express();
const port=process.env.PORT || 4000;
connectDB();

const allowedOrigins = [process.env.VITE_FRONTEND_URL,]

app.use(express.json());

app.use(cookieParser());
app.use(cors({origin:allowedOrigins,credentials:true}));
//api end points
app.get('/',(req,res)=> res.send("api is working"));
app.use('/v1/api/auth', authRouter);
app.use('/v1/api/user', userRouter);

app.listen(port ,()=> console.log(`Server is running on port ${port}`));