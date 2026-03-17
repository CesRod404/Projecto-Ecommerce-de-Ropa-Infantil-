import express from "express";
import Producto from "../models/Producto.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
import Pedido from "../models/Pedido.js";
import { getStorage } from "firebase-admin/storage";

const router = express.Router();

function parseTallasFromBody(body) {
  let raw = body["tallas[]"] !== undefined ? body["tallas[]"] : body.tallas;
  if (raw === undefined || raw === null || raw === "") return undefined;
  if (Array.isArray(raw)) return raw.map(t => String(t).trim()).filter(Boolean);
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(t => String(t).trim()).filter(Boolean);
    } catch (err) {}
    if (raw.includes(",")) return raw.split(",").map(t => t.trim()).filter(Boolean);
    return [raw.trim()].filter(Boolean);
  }
  return [String(raw).trim()].filter(Boolean);
}

// CREAR PRODUCTO
router.post("/producto", authMiddleware, adminMiddleware, upload.single("imagen"), async (req, res) => {
  try {
    let { nombre, descripcion, precio, categoria, temporada, rangoEdad, stock } = req.body;
    precio = precio ? Number(precio) : 0;
    stock = stock ? Number(stock) : 0;
    const tallas = parseTallasFromBody(req.body);

    let firebaseImageUrl = null;
    if (req.file) {
      const bucket = getStorage().bucket();
      const fileName = `productos/${Date.now()}_${req.file.originalname}`;
      const file = bucket.file(fileName);
      await file.save(req.file.buffer, { metadata: { contentType: req.file.mimetype } });
      await file.makePublic();
      firebaseImageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    const nuevoProducto = new Producto({
      nombre,
      imagen: firebaseImageUrl,
      descripcion,
      precio,
      categoria,
      temporada,
      rangoEdad,
      tallas: tallas ?? [],
      stock
    });

    await nuevoProducto.save();
    res.status(201).json({ producto: nuevoProducto });
  } catch (err) {
    res.status(500).json({ message: "Error al crear producto", error: err.message });
  }
});

// EDITAR PRODUCTO
router.put("/producto/:id", authMiddleware, adminMiddleware, upload.single("imagen"), async (req, res) => {
  try {
    let { nombre, descripcion, precio, categoria, temporada, rangoEdad, stock } = req.body;
    const tallas = parseTallasFromBody(req.body);

    const productoActualizado = {
      nombre, descripcion, categoria, temporada, rangoEdad,
      ...(precio !== undefined && { precio: Number(precio) }),
      ...(stock !== undefined && { stock: Number(stock) }),
      ...(tallas !== undefined && { tallas })
    };

    if (req.file) {
      const bucket = getStorage().bucket();
      const fileName = `productos/${Date.now()}_${req.file.originalname}`;
      const file = bucket.file(fileName);
      await file.save(req.file.buffer, { metadata: { contentType: req.file.mimetype } });
      await file.makePublic();
      productoActualizado.imagen = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { $set: productoActualizado },
      { new: true }
    );

    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto actualizado", producto });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar producto", error: err.message });
  }
});

// OBTENER PEDIDOS
router.get("/pedidos", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate("usuario", "nombre email").populate("productos.producto");
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener pedidos", error: error.message });
  }
});

export default router;