import { db } from "../lib/db.js";

// Obtener todos los bancos
export const getBanks = async (req, res) => {
  try {
    const banks = await db.bank.findMany();
    res.status(200).json(banks);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener bancos." });
  }
};

// Obtener un banco específico por ID
export const getBankById = async (req, res) => {
  const { id } = req.params;

  try {
    const bank = await db.bank.findUnique({
      where: { id },
    });

    if (bank) {
      res.status(200).json(bank);
    } else {
      res.status(404).json({ error: "Banco no encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener banco." });
  }
};

// Crear un nuevo banco
export const createBank = async (req, res) => {
  const { name, country, logo } = req.body;

  try {
    const newBank = await db.bank.create({
      data: { name, country, logo },
    });
    res.status(201).json(newBank);
  } catch (error) {
    res.status(500).json({ error: "Error al crear banco." });
  }
};

// Actualizar un banco existente
export const updateBank = async (req, res) => {
  const { id } = req.params;
  const { name, country, logo } = req.body;

  try {
    const updatedBank = await db.bank.update({
      where: { id },
      data: { name, country, logo },
    });
    res.status(200).json(updatedBank);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar banco." });
  }
};

// Eliminar un banco
export const deleteBank = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si hay cuentas asociadas
    const associatedAccounts = await db.account.findMany({
      where: { bankId: id },
    });

    if (associatedAccounts.length > 0) {
      return res.status(400).json({
        error: "No se puede eliminar un banco asociado a cuentas.",
      });
    }

    await db.bank.delete({
      where: { id },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar banco." });
  }
};
