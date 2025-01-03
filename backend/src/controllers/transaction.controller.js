import { db } from "../lib/db.js";

// Obtener todas las transacciones del usuario autenticado
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id; // Suponiendo que req.user contiene al usuario autenticado
    const transactions = await db.transaction.findMany({
      where: { userId },
      include: { category: true, account: true }, // Incluye categorías y cuentas relacionadas
      orderBy: { date: "desc" }, // Ordena por fecha descendente
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error on getTransactions:", error);
    res.status(500).json({ error: "Error al obtener transacciones." });
  }
};

// Obtener una transacción específica por ID
export const getTransactionById = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await db.transaction.findUnique({
      where: { id },
      include: { category: true, account: true },
    });

    if (transaction) {
      res.status(200).json(transaction);
    } else {
      res.status(404).json({ error: "Transacción no encontrada." });
    }
  } catch (error) {
    console.log("Error on getTransactionById:", error);
    res.status(500).json({ error: "Error al obtener transacción." });
  }
};

// Crear una nueva transacción
export const createTransaction = async (req, res) => {
  const { amount, date, description, categoryId, accountId } = req.body;
  const userId = req.user.id;

  try {
    const newTransaction = await db.transaction.create({
      data: {
        amount,
        date: new Date(date), // Convierte la cadena en un objeto Date
        description,
        categoryId,
        accountId,
        userId,
      },
      include: { category: true, account: true }, // Incluye categoría y cuenta relacionadas
    });
    res.status(201).json(newTransaction);
  } catch (error) {
    console.log("Error on createTransaction:", error);
    res.status(500).json({ error: "Error al crear transacción." });
  }
};

// Actualizar una transacción existente
export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { amount, date, description, categoryId, accountId } = req.body;

  try {
    const updatedTransaction = await db.transaction.update({
      where: { id },
      data: {
        amount,
        date: new Date(date),
        description,
        categoryId,
        accountId,
      },
      include: { category: true, account: true },
    });
    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.log("Error on updateTransaction:", error);
    res.status(500).json({ error: "Error al actualizar transacción." });
  }
};

// Eliminar una transacción
export const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    await db.transaction.delete({
      where: { id },
    });
    res.status(204).end();
  } catch (error) {
    console.log("Error on deleteTransaction:", error);
    res.status(500).json({ error: "Error al eliminar transacción." });
  }
};
