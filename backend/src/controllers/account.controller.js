import { db } from "../lib/db.js";

// Obtener todas las cuentas del usuario autenticado
export const getAccounts = async (req, res) => {
  try {
    const userId = req.user.id; // Suponiendo que req.user contiene al usuario autenticado
    const accounts = await db.account.findMany({
      where: { userId },
      include: { transactions: true, bank: true }, // Incluye transacciones relacionadas
    });
    res.status(200).json(accounts);
  } catch (error) {
    console.log("Error on getAccounts:", error);
    res.status(500).json({ error: "Error al obtener cuentas." });
  }
};

// Obtener una cuenta específica por ID
export const getAccountById = async (req, res) => {
  const { id } = req.params;

  try {
    const account = await db.account.findUnique({
      where: { id },
      include: { transactions: true, bank: true }, // Incluye transacciones y banco
    });

    if (account) {
      res.status(200).json(account);
    } else {
      res.status(404).json({ error: "Cuenta no encontrada." });
    }
  } catch (error) {
    console.log("Error on getAccountById:", error);
    res.status(500).json({ error: "Error al obtener cuenta." });
  }
};

// Crear una nueva cuenta
export const createAccount = async (req, res) => {
  const { name, type, balance, color, bankId } = req.body;
  const userId = req.user.id;

  try {
    const newAccount = await db.account.create({
      data: { name, type, balance, color, userId, bankId },
      include: { transactions: true, bank: true },
    });
    res.status(201).json(newAccount);
  } catch (error) {
    console.log("Error on createAccount:", error);
    res.status(500).json({ error: "Error al crear cuenta." });
  }
};

// Actualizar una cuenta existente
export const updateAccount = async (req, res) => {
  const { id } = req.params;
  const { name, type, balance, color, bankId } = req.body;

  try {
    const updatedAccount = await db.account.update({
      where: { id },
      data: { name, type, balance, color, bankId },
      include: { transactions: true, bank: true },
    });
    res.status(200).json(updatedAccount);
  } catch (error) {
    console.log("Error on updateAccount:", error);
    res.status(500).json({ error: "Error al actualizar cuenta." });
  }
};

// Eliminar una cuenta
export const deleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
    await db.account.delete({
      where: { id },
    });
    res.status(204).end();
  } catch (error) {
    console.log("Error on deleteAccount:", error);
    res.status(500).json({ error: "Error al eliminar cuenta." });
  }
};
