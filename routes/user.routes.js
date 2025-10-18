import { Router } from "express";
import { getUsers ,getUser} from "../controllers/user.controllers.js";
import { authorize } from "../middlewares/auth.middlewares.js";
const userRouter=Router();
userRouter.get("/",getUsers);
userRouter.get("/:id",authorize,getUser);
// Mock routes for demonstration
userRouter.post("/",(req,res)=>res.send({title:"create user"}));
userRouter.put("/:id",(req,res)=>res.send({title:"update user by id"}));
userRouter.delete("/:id",(req,res)=>res.send({title:"delete user by id"}));
export default userRouter;