import express from "express";
import {
  createBank,
  deleteBank,
  getBankById,
  getBanks,
  updateBank,
} from "../controllers/bank.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ruta para obtener todos los bancos y crear un nuevo banco
router.route("/").get(protect, getBanks).post(protect, createBank);

// Ruta para obtener, actualizar o eliminar un banco específico por ID
router
  .route("/:id")
  .get(protect, getBankById)
  .put(protect, updateBank)
  .delete(protect, deleteBank);

export default router;
