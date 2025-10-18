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