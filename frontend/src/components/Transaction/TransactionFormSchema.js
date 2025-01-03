import * as Yup from 'yup';

export const transactionFormSchema = Yup.object().shape({
  amount: Yup.number()
    .required('El monto es obligatorio')
    .positive('El monto debe ser positivo'),
  date: Yup.date()
    .required('La fecha es obligatoria')
    .max(new Date(), 'La fecha no puede ser en el futuro'),
  description: Yup.string().max(
    255,
    'La descripción no puede superar 255 caracteres',
  ),
  categoryId: Yup.string().required('La categoría es obligatoria'),
  accountId: Yup.string().required('La cuenta es obligatoria'),
});

export const transactionTypesValues = [
  { value: 'INCOME', label: 'Ingreso' },
  { value: 'EXPENSE', label: 'Gasto' },
];
