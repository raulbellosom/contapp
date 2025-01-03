import { db } from "../lib/db.js";

// Obtener todos los pagos recurrentes del usuario autenticado
export const getRecurringPayments = async (req, res) => {
  try {
    const userId = req.user.id; // Suponiendo que req.user contiene al usuario autenticado
    const recurringPayments = await db.recurringPayment.findMany({
      where: { userId },
      include: { account: true, category: true }, // Incluye cuentas y categorías relacionadas
    });
    res.status(200).json(recurringPayments);
  } catch (error) {
    console.log("Error on getRecurringPayments:", error);
    res.status(500).json({ error: "Error al obtener pagos recurrentes." });
  }
};

// Obtener un pago recurrente específico por ID
export const getRecurringPaymentById = async (req, res) => {
  const { id } = req.params;

  try {
    const recurringPayment = await db.recurringPayment.findUnique({
      where: { id },
      include: { account: true, category: true },
    });

    if (recurringPayment) {
      res.status(200).json(recurringPayment);
    } else {
      res.status(404).json({ error: "Pago recurrente no encontrado." });
    }
  } catch (error) {
    console.log("Error on getRecurringPaymentById:", error);
    res.status(500).json({ error: "Error al obtener pago recurrente." });
  }
};

// Crear un nuevo pago recurrente
export const createRecurringPayment = async (req, res) => {
  const { name, amount, frequency, startDate, endDate, accountId, categoryId } =
    req.body;
  const userId = req.user.id;

  try {
    const newRecurringPayment = await db.recurringPayment.create({
      data: {
        name,
        amount,
        frequency,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        accountId,
        categoryId,
        userId,
      },
    });
    res.status(201).json(newRecurringPayment);
  } catch (error) {
    console.log("Error on createRecurringPayment:", error);
    res.status(500).json({ error: "Error al crear pago recurrente." });
  }
};

// Actualizar un pago recurrente existente
export const updateRecurringPayment = async (req, res) => {
  const { id } = req.params;
  const { name, amount, frequency, startDate, endDate, accountId, categoryId } =
    req.body;

  try {
    const updatedRecurringPayment = await db.recurringPayment.update({
      where: { id },
      data: {
        name,
        amount,
        frequency,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        accountId,
        categoryId,
      },
    });
    res.status(200).json(updatedRecurringPayment);
  } catch (error) {
    console.log("Error on updateRecurringPayment:", error);
    res.status(500).json({ error: "Error al actualizar pago recurrente." });
  }
};

// Eliminar un pago recurrente
export const deleteRecurringPayment = async (req, res) => {
  const { id } = req.params;

  try {
    await db.recurringPayment.delete({
      where: { id },
    });
    res.status(204).end();
  } catch (error) {
    console.log("Error on deleteRecurringPayment:", error);
    res.status(500).json({ error: "Error al eliminar pago recurrente." });
  }
};
