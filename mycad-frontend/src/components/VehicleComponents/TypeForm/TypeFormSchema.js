import * as Yup from 'yup';

export const TypeFormSchema = Yup.object().shape({
  name: Yup.string().required('El nombre del tipo es requerido'),
  economicGroup: Yup.string().required('El grupo económico es requerido'),
  id: Yup.number(),
});
