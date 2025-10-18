import Subscription from "../models/subscription.model.js";
import { SERVER_URL } from '../config/env.js'
import { workflowClient } from "../config/upstash.js";
export const createSubscription = async (req, res, next) => {
    try {
      const subscription = await Subscription.create({
        ...req.body,
        user: req.user._id,
      });
  
      const { workflowRunId } = await workflowClient.trigger({
        url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
        body: {
          subscriptionId: subscription.id,
        },
        headers: {
          'content-type': 'application/json',
        },
        retries: 0,
      })
      console.log("BODY RECEBIDO:", req.body);
  
      res.status(201).json({ success: true, data: { subscription, workflowRunId } });
    } catch (e) {
      next(e);
    }
  }

export const getUserSubscriptions= async(req,res, next)=>{
    try {
        if(req.user.id!==req.params.id){
           const error=new Error("You are not a wowner of this account");
           error.status=401;
              throw error;
        }
        const subscriptions=await Subscription.find({user:req.params.id})
        res.status(200).json({success:true, count:subscriptions.length, data:subscriptions})
        
    } catch (error) {
        next(error)
        
    }
}