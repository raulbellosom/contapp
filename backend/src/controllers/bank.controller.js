import { db } from "../lib/db.js";
import path from "path";

export const createBank = async (req, res) => {
  const { name, country } = req.body;
  const logo = req.file
    ? `uploads/public/banks/logos/${req.file.filename}`
    : null;

  try {
    const newBank = await db.bank.create({
      data: {
        name,
        country,
        logo,
      },
    });
    res.status(201).json(newBank);
  } catch (error) {
    console.error("Error al crear banco:", error);
    res.status(500).json({ error: "Error al crear banco" });
  }
};

export const getBanks = async (req, res) => {
  try {
    const banks = await db.bank.findMany();
    res.status(200).json(banks);
  } catch (error) {
    console.error("Error al obtener bancos:", error);
    res.status(500).json({ error: "Error al obtener bancos" });
  }
};

export const getBankById = async (req, res) => {
  const { id } = req.params;

  try {
    const bank = await db.bank.findUnique({ where: { id } });
    if (bank) {
      res.status(200).json(bank);
    } else {
      res.status(404).json({ error: "Banco no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener banco:", error);
    res.status(500).json({ error: "Error al obtener banco" });
  }
};

export const updateBank = async (req, res) => {
  const { id } = req.params;
  const { name, country } = req.body;
  const logo = req.file
    ? `uploads/public/banks/logos/${req.file.filename}`
    : null;

  try {
    const updatedBank = await db.bank.update({
      where: { id },
      data: {
        name,
        country,
        ...(logo && { logo }), // Solo actualiza si hay un nuevo logo
      },
    });
    res.status(200).json(updatedBank);
  } catch (error) {
    console.error("Error al actualizar banco:", error);
    res.status(500).json({ error: "Error al actualizar banco" });
  }
};

export const deleteBank = async (req, res) => {
  const { id } = req.params;

  try {
    await db.bank.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar banco:", error);
    res.status(500).json({ error: "Error al eliminar banco" });
  }
};
