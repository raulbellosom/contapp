import express from "express";
import {
  createRecurringPayment,
  deleteRecurringPayment,
  getRecurringPaymentById,
  getRecurringPayments,
  updateRecurringPayment,
} from "../controllers/recurringPayment.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ruta para obtener todos los pagos recurrentes y crear uno nuevo
router
  .route("/")
  .get(protect, getRecurringPayments)
  .post(protect, createRecurringPayment);

// Ruta para obtener, actualizar o eliminar un pago recurrente específico por ID
router
  .route("/:id")
  .get(protect, getRecurringPaymentById)
  .put(protect, updateRecurringPayment)
  .delete(protect, deleteRecurringPayment);

export default router;
