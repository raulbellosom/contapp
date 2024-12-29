import express from "express";
import {
  createBank,
  deleteBank,
  getBankById,
  getBanks,
  updateBank,
} from "../controllers/bank.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Ruta para obtener todos los bancos y crear un nuevo banco
router
  .route("/")
  .get(protect, getBanks)
  .post(upload.single("logo"), createBank);

// Ruta para obtener, actualizar o eliminar un banco específico por ID
router
  .route("/:id")
  .get(protect, getBankById)
  .put(upload.single("logo"), updateBank)
  .delete(protect, deleteBank);

export default router;
