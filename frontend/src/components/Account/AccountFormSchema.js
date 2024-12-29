import * as Yup from 'yup';

export const AccountFormSchema = Yup.object().shape({
  name: Yup.string().required('El nombre de la cuenta es requerido'),
  type: Yup.string().required('El tipo de cuenta es requerido'),
  balance: Yup.number()
    .required('El balance inicial es requerido')
    .min(0, 'El balance no puede ser negativo'),
  color: Yup.string()
    .matches(
      /^#[0-9A-Fa-f]{6}$/,
      'Debe ser un código de color hexadecimal válido',
    )
    .required('El color es requerido'),
  bankId: Yup.string().nullable().notRequired(),
  id: Yup.string(),
});

export const AccountTypesValues = [
  {
    value: 'CASH',
    label: 'Efectivo',
  },
  {
    value: 'CREDIT_CARD',
    label: 'Tarjeta de Crédito',
  },
  {
    value: 'DEBIT_CARD',
    label: 'Tarjeta de Débito',
  },
  {
    value: 'SAVINGS_ACCOUNT',
    label: 'Cuenta de Ahorros',
  },
  {
    value: 'INVESTMENT',
    label: 'Inversión',
  },
];
