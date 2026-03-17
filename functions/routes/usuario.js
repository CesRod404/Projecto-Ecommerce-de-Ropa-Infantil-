import express from "express";
import Usuario from "../models/Usuario.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// LIKES
router.post("/likes/:productoId", authMiddleware, async (req, res) => {
  try {
    const { productoId } = req.params;
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    const yaExiste = usuario.likes.some(id => id.toString() === productoId);
    if (yaExiste) {
      usuario.likes = usuario.likes.filter(id => id.toString() !== productoId);
    } else {
      usuario.likes.push(productoId);
    }
    await usuario.save();
    res.json({ likes: usuario.likes });
  } catch (error) {
    res.status(500).json({ message: "Error en likes", error: error.message });
  }
});

// CARRITO
router.get("/carrito", authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).populate("carrito.producto");
    res.json(usuario.carrito);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener carrito", error: error.message });
  }
});

router.post("/carrito/:productoId", authMiddleware, async (req, res) => {
  try {
    const { productoId } = req.params;
    const usuario = await Usuario.findById(req.usuario.id);
    const itemExistente = usuario.carrito.find(item => item.producto.toString() === productoId);

    if (itemExistente) {
      itemExistente.cantidad += 1;
    } else {
      usuario.carrito.push({ producto: productoId, cantidad: 1 });
    }
    await usuario.save();
    res.json(usuario.carrito);
  } catch (error) {
    res.status(500).json({ message: "Error en carrito", error: error.message });
  }
});

router.get("/mis-productos", authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).populate("likes").populate("carrito.producto");
    res.json({ likes: usuario.likes, carrito: usuario.carrito });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfil", error: error.message });
  }
});

// DIRECCIONES
router.get("/direcciones", authMiddleware, async (req, res) => {
  const usuario = await Usuario.findById(req.usuario.id);
  res.json(usuario.direcciones);
});

router.post("/direcciones", authMiddleware, async (req, res) => {
  const { calle, numero, ciudad, estado, codigoPostal, telefono } = req.body;
  const usuario = await Usuario.findById(req.usuario.id);
  usuario.direcciones.push({ calle, numero, ciudad, estado, codigoPostal, telefono });
  await usuario.save();
  res.json(usuario.direcciones);
});

router.delete("/direcciones/:id", authMiddleware, async (req, res) => {
  const usuario = await Usuario.findById(req.usuario.id);
  usuario.direcciones = usuario.direcciones.filter(d => d._id.toString() !== req.params.id);
  await usuario.save();
  res.json(usuario.direcciones);
});

export default router;