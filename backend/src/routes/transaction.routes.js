import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactions,
  updateTransaction,
} from "../controllers/transaction.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ruta para obtener todas las transacciones y crear una nueva transacción
router
  .route("/")
  .get(protect, getTransactions)
  .post(protect, createTransaction);

// Ruta para obtener, actualizar o eliminar una transacción específica por ID
router
  .route("/:id")
  .get(protect, getTransactionById)
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

export default router;
