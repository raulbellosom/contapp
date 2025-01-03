import { db } from "../lib/db.js";

// Obtener todas las categorías
export const getCategories = async (req, res) => {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
    });
    res.status(200).json(categories);
  } catch (error) {
    console.log("Error on getCategories:", error);
    res.status(500).json({ error: "Error al obtener categorías." });
  }
};

// Obtener una categoría específica por ID
export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await db.category.findUnique({
      where: { id },
    });

    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ error: "Categoría no encontrada." });
    }
  } catch (error) {
    console.log("Error on getCategoryById:", error);
    res.status(500).json({ error: "Error al obtener categoría." });
  }
};

// Crear una nueva categoría
export const createCategory = async (req, res) => {
  const { name, type, description } = req.body;

  try {
    const newCategory = await db.category.create({
      data: { name, type, description },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    console.log("Error on createCategory:", error);
    res.status(500).json({ error: "Error al crear categoría." });
  }
};

// Actualizar una categoría existente
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, type, description } = req.body;

  try {
    const updatedCategory = await db.category.update({
      where: { id },
      data: { name, type, description },
    });
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.log("Error on updateCategory:", error);
    res.status(500).json({ error: "Error al actualizar categoría." });
  }
};

// Eliminar una categoría
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si hay transacciones asociadas
    const associatedTransactions = await db.transaction.findMany({
      where: { categoryId: id },
    });

    if (associatedTransactions.length > 0) {
      return res.status(400).json({
        error: "No se puede eliminar una categoría asociada a transacciones.",
      });
    }

    await db.category.delete({
      where: { id },
    });
    res.status(204).end();
  } catch (error) {
    console.log("Error on deleteCategory:", error);
    res.status(500).json({ error: "Error al eliminar categoría." });
  }
};
