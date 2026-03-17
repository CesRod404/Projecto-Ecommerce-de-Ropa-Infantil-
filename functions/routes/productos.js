import express from "express";
import Producto from "../models/Producto.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
import { getStorage } from "firebase-admin/storage"; 

const router = express.Router();

// Helper: parsear campo tallas de req.body de forma robusta
function parseTallasFromBody(body) {
  let raw = undefined;
  if (body["tallas[]"] !== undefined) raw = body["tallas[]"];
  else if (body.tallas !== undefined) raw = body.tallas;
  
  if (raw === undefined || raw === null || raw === "") return undefined;

  if (Array.isArray(raw)) {
    return raw.map(t => String(t).trim()).filter(Boolean);
  }

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(t => String(t).trim()).filter(Boolean);
    } catch (err) {}

    if (raw.includes(",")) {
      return raw.split(",").map(t => t.trim()).filter(Boolean);
    }
    return [raw.trim()].filter(Boolean);
  }
  return [String(raw).trim()].filter(Boolean);
}

// ============================
// OBTENER TODOS
// ============================
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================
// OBTENER DESTACADOS (DEBE IR ANTES QUE /:ID)
// ============================
router.get("/destacados", async (req, res) => {
  try {
    const productos = await Producto.find({ destacado: true });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================
// OBTENER POR CATEGORÍA
// ============================
router.get("/categoria/:categoria", async (req, res) => {
  try {
    const productos = await Producto.find({ categoria: req.params.categoria });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================
// OBTENER POR ID
// ============================
router.get("/:id", async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================
// CREAR PRODUCTO (SOLO ADMIN)
// ============================
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("imagen"),
  async (req, res) => {
    try {
      let { nombre, descripcion, precio, categoria, temporada, rangoEdad, stock } = req.body;

      const precioNum = (precio !== undefined && precio !== "") ? Number(precio) : undefined;
      const stockNum = (stock !== undefined && stock !== "") ? Number(stock) : 0;
      
      if (precioNum !== undefined && Number.isNaN(precioNum)) {
        return res.status(400).json({ message: "Precio inválido" });
      }

      const tallas = parseTallasFromBody(req.body);
      let firebaseImageUrl = undefined;

      if (req.file) {
        const bucket = getStorage().bucket();
        const fileName = `productos/${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;
        const file = bucket.file(fileName);

        await file.save(req.file.buffer, {
          metadata: { contentType: req.file.mimetype },
          resumable: false
        });

        await file.makePublic();
        firebaseImageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      }

      const nuevoProducto = new Producto({
        nombre,
        descripcion,
        precio: precioNum,
        categoria,
        temporada,
        rangoEdad,
        tallas: tallas ?? [],
        stock: stockNum,
        imagen: firebaseImageUrl
      });

      const productoGuardado = await nuevoProducto.save();
      res.status(201).json(productoGuardado);
    } catch (error) {
      console.error("Error al crear producto:", error);
      res.status(400).json({ message: "Error al crear producto", error: error.message });
    }
  }
);

// ============================
// EDITAR PRODUCTO (SOLO ADMIN)
// ============================
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("imagen"),
  async (req, res) => {
    try {
      let { nombre, descripcion, precio, categoria, temporada, rangoEdad, stock, destacado } = req.body;

      if (destacado !== undefined) destacado = destacado === "true" || destacado === true;

      const productoActualizado = {
        nombre,
        descripcion,
        categoria,
        temporada,
        rangoEdad,
        ...(destacado !== undefined ? { destacado } : {})
      };

      if (precio !== undefined && precio !== "") {
        const p = Number(precio);
        if (!Number.isNaN(p)) productoActualizado.precio = p;
      }
      
      if (stock !== undefined && stock !== "") {
        const s = Number(stock);
        if (!Number.isNaN(s)) productoActualizado.stock = s;
      }

      const tallas = parseTallasFromBody(req.body);
      if (tallas !== undefined) productoActualizado.tallas = tallas;

      if (req.file) {
        const bucket = getStorage().bucket();
        const fileName = `productos/${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;
        const file = bucket.file(fileName);

        await file.save(req.file.buffer, {
          metadata: { contentType: req.file.mimetype },
          resumable: false
        });

        await file.makePublic();
        productoActualizado.imagen = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      }

      const producto = await Producto.findByIdAndUpdate(
        req.params.id,
        { $set: productoActualizado },
        { new: true }
      );

      res.json(producto);
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      res.status(400).json({ message: "Error al actualizar producto", error: error.message });
    }
  }
);

// ============================
// ELIMINAR PRODUCTO (SOLO ADMIN)
// ============================
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const producto = await Producto.findById(req.params.id);
      if (!producto) return res.status(404).json({ message: "Producto no encontrado" });

      if (producto.imagen && producto.imagen.includes("storage.googleapis.com")) {
        try {
          const bucket = getStorage().bucket();
          // Extraer el path del archivo de la URL de Firebase
          const urlParts = producto.imagen.split(`${bucket.name}/`);
          if (urlParts.length > 1) {
            await bucket.file(urlParts[1]).delete();
          }
        } catch (fileError) {
          console.error("Error al eliminar la imagen de Storage:", fileError.message);
        }
      }

      await Producto.findByIdAndDelete(req.params.id);
      res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      res.status(500).json({ message: "Error al eliminar producto", error: error.message });
    }
  }
);

export default router;