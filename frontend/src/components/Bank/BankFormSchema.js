import * as Yup from 'yup';

export const BankFormSchema = Yup.object().shape({
  name: Yup.string().required('El nombre del banco es requerido'),
  country: Yup.string().nullable(),
  logo: Yup.mixed().nullable(),
});
