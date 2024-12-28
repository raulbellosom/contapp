import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategories,
  updateCategory,
} from "../controllers/category.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ruta para obtener todas las categorías y crear una nueva categoría
router.route("/").get(protect, getCategories).post(protect, createCategory);

// Ruta para obtener, actualizar o eliminar una categoría específica por ID
router
  .route("/:id")
  .get(protect, getCategoryById)
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

export default router;
