import { db } from "../lib/db.js";
import csvParser from "csv-parser";
import fs from "fs";

const validateNotEmpty = (value, fieldName, errors, index) => {
  if (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "") ||
    (typeof value === "number" && isNaN(value))
  ) {
    errors.push(`Fila ${index + 1}: El campo '${fieldName}' es obligatorio`);
  }
};

const validateField = (model, userId, index, errors) => {
  validateNotEmpty(model.brand, "Marca del inventario", errors, index);
  validateNotEmpty(model.model, "Modelo del inventario", errors, index);
  validateNotEmpty(model.type, "Tipo de inventario", errors, index);

  if (userId === null || userId === undefined) {
    errors.push(`Fila ${index + 1}: El usuario es obligatorio`);
  }
};

export const createMultipleModels = async (req, res) => {
  const csvFile = req.file;
  const user = req.user;

  if (!csvFile) {
    return res.status(400).json({ message: "No se capturó ningún archivo." });
  }

  const models = [];
  const errors = [];
  const successfulModels = [];

  try {
    fs.createReadStream(csvFile.path)
      .pipe(csvParser())
      .on("data", (row) => {
        models.push({
          model: row["Modelo del inventario"],
          brand: row["Marca del inventario"],
          type: row["Tipo de inventario"],
        });
      })
      .on("end", async () => {
        const userId = user?.id;
        for (const [index, model] of models.entries()) {
          validateField(model, userId, index, errors);

          const existingBrand = await db.inventoryBrand.findFirst({
            where: { name: model.brand },
          });

          if (!existingBrand) {
            errors.push(
              `Fila ${models.indexOf(model) + 1}: La marca ${
                model.brand
              } no existe en la base de datos.`
            );
            continue;
          }

          const existingType = await db.inventoryType.findFirst({
            where: { name: model.type },
          });

          if (!existingType) {
            errors.push(
              `Fila ${models.indexOf(model) + 1}: El tipo ${
                model.type
              } no existe en la base de datos.`
            );
            continue;
          }

          const existingModel = await db.model.findFirst({
            where: {
              name: model.model,
              brand: {
                name: model.brand,
              },
              type: {
                name: model.type,
              },
              enabled: true,
            },
          });

          if (existingModel) {
            errors.push(
              `Fila ${models.indexOf(model) + 1}: El modelo ${
                model.model
              } ya existe en la base de datos.`
            );
            continue;
          }

          const hasErrors = errors.some((error) =>
            error.includes(`Fila ${index + 1}`)
          );

          if (existingBrand && existingType && !existingModel && !hasErrors) {
            const inventoryModel = await db.model.create({
              data: {
                name: model.model,
                brandId: existingBrand.id,
                typeId: existingType.id,
                enabled: true,
              },
              include: {
                brand: true,
                type: true,
              },
            });
            successfulModels.push(inventoryModel);
          } else {
            errors.push(
              `Fila ${models.indexOf(model) + 1}: No se pudo crear el modelo ${
                model.model
              }`
            );
          }
        }
        res.json({ createdModels: successfulModels, errors });
      })
      .on("error", (error) => {
        console.log("error on end", error);
        return res.status(500).json({
          message: "Error al procesar el archivo CSV.",
          error: error.message,
        });
      });
  } catch (error) {
    console.log("error on try", error);
    res.status(500).json({ message: error.message });
  }
};