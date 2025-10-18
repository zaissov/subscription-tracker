import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import { JWT_SECRET ,JWT_EXPIRES_IN} from "../config/env.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
  

    const { name, email, password } = req.body;

    // Check if a user already exists
    const existingUser = await User.findOne({ email });

    if(existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create([{ name, email, password: hashedPassword }], { session });
const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

// Commit transaction
await session.commitTransaction();
session.endSession();

res.status(201).json({
  success: true,
  message: "User created successfully",
  data: { token, user: newUser[0] },
});
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
}


export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Invalid Email");
      error.statusCode = 404;
      throw error;
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid Password");
      error.statusCode = 401;
      throw error;
    }

    // Gerar token JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: { token, user },
    });
    console.log("User token", token);
  } catch (error) {
    next(error);
  }
};
export const signOut=async(req,res,next)=>{
  
}
