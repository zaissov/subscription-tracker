Repository: zaissov/subscription-tracker
Files analyzed: 23

Estimated tokens: 6.4k

Directory structure:
└── zaissov-subscription-tracker/
    ├── app.js
    ├── eslint.config.js
    ├── package.json
    ├── config/
    │   ├── arcjet.js
    │   ├── env.js
    │   ├── nodemailer.js
    │   └── upstash.js
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── subscription.controller.js
    │   ├── user.controllers.js
    │   └── workflow.controller.js
    ├── database/
    │   └── mongodb.js
    ├── middlewares/
    │   ├── arcjet.middlewares.js
    │   ├── auth.middlewares.js
    │   └── error.middlewares.js
    ├── models/
    │   ├── subscription.model.js
    │   └── user.model.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── subscription.routes.js
    │   ├── user.routes.js
    │   └── workflow.routes.js
    └── utils/
        ├── email-template.js
        └── send-email.js


================================================
FILE: app.js
================================================
import express from "express";
import { PORT } from "./config/env.js";
import userRoutes from "./routes/user.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import connectDB from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middlewares.js";
import workflowRout from "./routes/workflow.routes.js";
import arcjetMiddleware from "./middlewares/arcjet.middlewares.js";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware)

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/wokflows",workflowRout);


app.get("/", (req, res) => {
  res.send("Welcome to Subscription Tracker API");
});

// Middleware de erros
app.use(errorMiddleware);

// Conexão com DB e inicialização do servidor
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to DB", error);
    process.exit(1);
  }
};

startServer();

export default app;


================================================
FILE: eslint.config.js
================================================
import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.node } },
]);



================================================
FILE: package.json
================================================
{
  "name": "subdub",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "@arcjet/inspect": "^1.0.0-beta.13",
    "@arcjet/node": "^1.0.0-beta.13",
    "@upstash/workflow": "^0.2.20",
    "bcrypt": "^6.0.0",
    "bcryptjs": "^3.0.2",
    "cookie-parser": "~1.4.4",
    "cors": "^2.8.5",
    "dayjs": "^1.11.18",
    "debug": "~2.6.9",
    "dotenv": "^17.2.2",
    "express": "~4.16.1",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.20.0",
    "mongoose": "^8.18.2",
    "morgan": "~1.9.1",
    "nodemailer": "^7.0.9",
    "nodemon": "^3.1.10"
  },
  "devDependencies": {
    "@eslint/js": "^9.36.0",
    "eslint": "^9.36.0",
    "globals": "^16.4.0"
  }
}



================================================
FILE: config/arcjet.js
================================================
import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_API_KEY } from './env.js'

const aj = arcjet({
  key: ARCJET_API_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [ "CATEGORY:SEARCH_ENGINE" ],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 5, // Refill 5 tokens per interval
      interval: 10, // Refill every 10 seconds
      capacity: 10, // Bucket capacity of 10 tokens
    }),
  ],
});

export default aj;


================================================
FILE: config/env.js
================================================
// config/env.js
import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const DB_URI = process.env.DB_URI 
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
export const JWT_SECRET=process.env.JWT_SECRET
export const ARCJET_API_KEY=process.env.ARCJET_API_KEY
export const ARCJET_ENV=process.env.ARCJET_ENV || 'development'
export const QSTASH_URL=process.env.QSTASH_URL
export const QSTASH_TOKEN=process.env.QSTASH_TOKEN
export const SERVER_URL=process.env.SERVER_URL 
export const EMAIL_PASSWORD=process.env.EMAIL_PASSWORD




================================================
FILE: config/nodemailer.js
================================================
import nodemailer from 'nodemailer';

import { EMAIL_PASSWORD } from './env.js'

export const accountEmail = 'zaissov@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: accountEmail,
    pass: EMAIL_PASSWORD
  }
})

export default transporter;


================================================
FILE: config/upstash.js
================================================
import { Client as WorkflowClient } from "@upstash/workflow";

import { QSTASH_TOKEN,QSTASH_URL } from "./env.js"; 

export const workflowClient=new WorkflowClient({
    baseUrlurl:QSTASH_URL,
    token:QSTASH_TOKEN
})


================================================
FILE: controllers/auth.controller.js
================================================
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



================================================
FILE: controllers/subscription.controller.js
================================================
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


================================================
FILE: controllers/user.controllers.js
================================================
import User from "../models/user.model.js";

 export const getUsers = async (req, res, next) => {
    try {
        const users= await User.find();
    res.status(200).json({
        sucess:true,
       data:users
    })
        
    } catch (error) {
        next(error)
        
    }
}


 export const getUser = async (req, res, next) => {
    try {
        const user= await User.findById(req.params.id).select('-password');

        if (!user) {
            const error=new Error('User not found');
            error.statusCode=404;
            throw error;
        }
    res.status(200).json({
        sucess:true,
       data:user
    })

         
    } catch (error) {
        next(error)
        
    }
}



================================================
FILE: controllers/workflow.controller.js
================================================
import dayjs from 'dayjs';
import { createRequire } from 'module';
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';


const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
  console.log("Context payload:", context); // 👀 debug

  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription?.status !== 'active') return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');

    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
    }

    if (dayjs().isSame(reminderDate, 'day')) {
      await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
    }
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    return Subscription.findById(subscriptionId).populate('user', 'name email');
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);

    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    })
  })
}


================================================
FILE: database/mongodb.js
================================================
import mongoose from "mongoose";
import { DB_URI,NODE_ENV} from "../config/env.js";

if (!DB_URI) {
    throw new Error("DB_URI is not defined in environment variables");
  
}

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('MongoDB connected successfully inside',NODE_ENV);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
export default connectDB;


================================================
FILE: middlewares/arcjet.middlewares.js
================================================
import aj from '../config/arcjet.js';

const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    if(decision.isDenied()) {
      if(decision.reason.isRateLimit()) return res.status(429).json({ error: 'Rate limit exceeded' });
      if(decision.reason.isBot()) return res.status(403).json({ error: 'Bot detected' });

      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  } catch (error) {
    console.log(`Arcjet Middleware Error: ${error}`);
    next(error);
  }
}

export default arcjetMiddleware;


================================================
FILE: middlewares/auth.middlewares.js
================================================
import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authorize = async (req, res, next) => {
  try {
    let token;

    // Verifica se o header existe e começa com Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }
 
    // Decodifica o token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded JWT:", decoded);

    // Busca o usuário pelo ID
    const user = await User.findById(decoded.userId).select("-password"); // opcional: excluir senha
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found",
      });
    }

    // Anexa o user ao request
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
      error: error.message,
    });
  }
};


================================================
FILE: middlewares/error.middlewares.js
================================================
const erroMiddleware = (err, req, res, next) => {
    try {
       // mongoose bad ObjectId
    if (err.name === 'CastError') {
        err.statusCode = 404;
        err.message = 'Resource not found';
    }

    // mongoose duplicate key
    if (err.code === 11000) {
        err.statusCode = 400;
        err.message = 'Duplicate field value entered';
    }

    // mongoose validation error
    if (err.name === 'ValidationError') {
        err.statusCode = 400;
        err.message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error'
    });
        
    } catch (error) {
        next(error);
        
    }
}

export default erroMiddleware;


================================================
FILE: models/subscription.model.js
================================================
import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subscription name is required'],
    trim: true,
    minLength: 2,
    maxLength: 100,
  },
  price: {
    type: Number,
    required: [true, 'Subscription price is required'],
    min: [0, 'Price must be greater than 0']
  },
  currency: {
    type: String,
    enum: ['USD', 'EUR', 'GBP'],
    default: 'USD'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
  },
  category: {
    type: String,
    enum: ['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other' ,'music'],
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true,
    validate: {
      validator: (value) => value <= new Date(),
      message: 'Start date must be in the past',
    }
  },
  renewalDate: {
    type: Date,
    validate: {
      validator: function (value) {
        return value > this.startDate;
      },
      message: 'Renewal date must be after the start date',
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  }
}, { timestamps: true });


// Auto-calculate renewal date if missing.
subscriptionSchema.pre('save', function (next) {
  if(!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
  }

  // Auto-update the status if renewal date has passed
  if (this.renewalDate < new Date()) {
    this.status = 'expired';
  }

  next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;


================================================
FILE: models/user.model.js
================================================
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User Name is required'],
    trim: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, 'User Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'User Password is required'],
    minLength: 6,
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;


================================================
FILE: routes/auth.routes.js
================================================
import { Router } from "express";
import { signUp,signIn,signOut } from "../controllers/auth.controller.js";

const authRouter = Router();
authRouter.post("/sign-up",signUp);
authRouter.post("/sign-in",signIn);
authRouter.post("/sign-out",signOut);

export default authRouter;


================================================
FILE: routes/subscription.routes.js
================================================
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


================================================
FILE: routes/user.routes.js
================================================
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


================================================
FILE: routes/workflow.routes.js
================================================
import { Router } from "express";
import { sendReminders } from "../controllers/workflow.controller.js";

const workflowRouter = Router();
workflowRouter.post("/subscription/reminder",sendReminders);
export default workflowRouter;



================================================
FILE: utils/email-template.js
================================================
export const generateEmailTemplate = ({
    userName,
    subscriptionName,
    renewalDate,
    planName,
    price,
    paymentMethod,
    accountSettingsLink,
    supportLink,
    daysLeft,
  }) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f7fa;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
              <td style="background-color: #4a90e2; text-align: center;">
                  <p style="font-size: 54px; line-height: 54px; font-weight: 800;">SubDub</p>
              </td>
          </tr>
          <tr>
              <td style="padding: 40px 30px;">                
                  <p style="font-size: 16px; margin-bottom: 25px;">Hello <strong style="color: #4a90e2;">${userName}</strong>,</p>
                  
                  <p style="font-size: 16px; margin-bottom: 25px;">Your <strong>${subscriptionName}</strong> subscription is set to renew on <strong style="color: #4a90e2;">${renewalDate}</strong> (${daysLeft} days from today).</p>
                  
                  <table cellpadding="15" cellspacing="0" border="0" width="100%" style="background-color: #f0f7ff; border-radius: 10px; margin-bottom: 25px;">
                      <tr>
                          <td style="font-size: 16px; border-bottom: 1px solid #d0e3ff;">
                              <strong>Plan:</strong> ${planName}
                          </td>
                      </tr>
                      <tr>
                          <td style="font-size: 16px; border-bottom: 1px solid #d0e3ff;">
                              <strong>Price:</strong> ${price}
                          </td>
                      </tr>
                      <tr>
                          <td style="font-size: 16px;">
                              <strong>Payment Method:</strong> ${paymentMethod}
                          </td>
                      </tr>
                  </table>
                  
                  <p style="font-size: 16px; margin-bottom: 25px;">If you'd like to make changes or cancel your subscription, please visit your <a href="${accountSettingsLink}" style="color: #4a90e2; text-decoration: none;">account settings</a> before the renewal date.</p>
                  
                  <p style="font-size: 16px; margin-top: 30px;">Need help? <a href="${supportLink}" style="color: #4a90e2; text-decoration: none;">Contact our support team</a> anytime.</p>
                  
                  <p style="font-size: 16px; margin-top: 30px;">
                      Best regards,<br>
                      <strong>The SubDub Team</strong>
                  </p>
              </td>
          </tr>
          <tr>
              <td style="background-color: #f0f7ff; padding: 20px; text-align: center; font-size: 14px;">
                  <p style="margin: 0 0 10px;">
                      SubDub Inc. | 123 Main St, Anytown, AN 12345
                  </p>
                  <p style="margin: 0;">
                      <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Unsubscribe</a> | 
                      <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
                      <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Terms of Service</a>
                  </p>
              </td>
          </tr>
      </table>
  </div>
  `;
  
  export const emailTemplates = [
    {
      label: "7 days before reminder",
      generateSubject: (data) =>
        `📅 Reminder: Your ${data.subscriptionName} Subscription Renews in 7 Days!`,
      generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 7 }),
    },
    {
      label: "5 days before reminder",
      generateSubject: (data) =>
        `⏳ ${data.subscriptionName} Renews in 5 Days – Stay Subscribed!`,
      generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 5 }),
    },
    {
      label: "2 days before reminder",
      generateSubject: (data) =>
        `🚀 2 Days Left!  ${data.subscriptionName} Subscription Renewal`,
      generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 2 }),
    },
    {
      label: "1 days before reminder",
      generateSubject: (data) =>
        `⚡ Final Reminder: ${data.subscriptionName} Renews Tomorrow!`,
      generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 1 }),
    },
  ];


================================================
FILE: utils/send-email.js
================================================
import { emailTemplates } from './email-template.js'
import dayjs from 'dayjs'
import transporter, { accountEmail } from '../config/nodemailer.js'

export const sendReminderEmail = async ({ to, type, subscription }) => {
  if(!to || !type) throw new Error('Missing required parameters');

  const template = emailTemplates.find((t) => t.label === type);

  if(!template) throw new Error('Invalid email type');

  const mailInfo = {
    userName: subscription.user.name,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
    planName: subscription.name,
    price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
    paymentMethod: subscription.paymentMethod,
  }

  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  const mailOptions = {
    from: accountEmail,
    to: to,
    subject: subject,
    html: message,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if(error) return console.log(error, 'Error sending email');

    console.log('Email sent: ' + info.response);
  })
}
