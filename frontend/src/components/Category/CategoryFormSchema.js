import * as Yup from 'yup';

export const categoryFormSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre de la categoría es obligatorio')
    .max(50, 'El nombre no puede superar los 50 caracteres'),
  type: Yup.string()
    .oneOf(['INCOME', 'EXPENSE'], 'Tipo de categoría inválido')
    .required('El tipo de categoría es obligatorio'),
  description: Yup.string().max(
    255,
    'La descripción no puede superar los 255 caracteres',
  ),
});

export const categoryTypesValues = [
  { value: 'INCOME', label: 'Ingreso' },
  { value: 'EXPENSE', label: 'Gasto' },
];
