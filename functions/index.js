import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import productosRoutes from "./routes/productos.js";
import authRoutes from "./routes/auth.js";
import usuarioRoutes from "./routes/usuario.js";
import adminRoutes from "./routes/admin.js";
import pedidoRoutes from "./routes/pedido.js";

initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

let connectionPromise = null;

const connectMongo = () => {
  if (connectionPromise) return connectionPromise;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    connectionPromise = Promise.reject(new Error("MONGO_URI no definida"));
    return connectionPromise;
  }

  connectionPromise = mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  connectionPromise.catch(() => {
    connectionPromise = null;
  });

  return connectionPromise;
};

app.use(async (req, res, next) => {
  try {
    await connectMongo();
    next();
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
    res.status(503).json({ message: "Error de conexión a la base de datos" });
  }
});

const apiRouter = express.Router();
apiRouter.use("/admin", adminRoutes);
apiRouter.use("/productos", productosRoutes);
apiRouter.use("/auth", authRoutes);
apiRouter.use("/usuario", usuarioRoutes);
apiRouter.use("/pedidos", pedidoRoutes);

app.use("/api", apiRouter);

app.use("*", (req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export const api = onRequest(
  {
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 60,
    secrets: ["MONGO_URI", "JWT_SECRET"],
    cors: true,
  },
  app
);