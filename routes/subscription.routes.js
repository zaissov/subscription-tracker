import { Router } from "express";
import { authorize } from "../middlewares/auth.middlewares.js";
import { createSubscription, getUserSubscriptions } from "../controllers/subscription.controller.js";
const subscriptionRouter = Router();
subscriptionRouter.get("/", (req, res) => {
    res.send({ title: "get all subscriptions" });
});
subscriptionRouter.get("/:id", (req, res) => res.send({ title: "get subscription by id" }));
subscriptionRouter.get("/user/:id",authorize,getUserSubscriptions);
subscriptionRouter.get("/upcoming-renewals", (req, res) => res.send({ title: "get all user active subscriptions" }));

subscriptionRouter.post("/",authorize ,createSubscription);

subscriptionRouter.put("/:id", (req, res) => res.send({ title: "update subscription by id" }));
subscriptionRouter.delete("/:id", (req, res) => res.send({ title: "delete subscription by id" }));
subscriptionRouter.put("/:id/cancel", (req, res) => res.send({ title: "cancel subscription " }));
export default subscriptionRouter;