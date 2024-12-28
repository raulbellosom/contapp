import express from "express";
import {
  createAccount,
  deleteAccount,
  getAccountById,
  getAccounts,
  updateAccount,
} from "../controllers/account.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ruta para obtener todas las cuentas y crear una nueva cuenta
router.route("/").get(protect, getAccounts).post(protect, createAccount);

// Ruta para obtener, actualizar o eliminar una cuenta específica por ID
router
  .route("/:id")
  .get(protect, getAccountById)
  .put(protect, updateAccount)
  .delete(protect, deleteAccount);

export default router;
