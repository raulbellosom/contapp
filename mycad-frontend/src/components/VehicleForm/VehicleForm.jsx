import React from 'react';
import { FormikProvider, useFormik, Form } from 'formik';
import { VehicleFormSchema } from './VehicleFormSchema';
import VehicleFormFields from './VehicleFormFields';
import { Button } from 'flowbite-react';
import { FaSave } from 'react-icons/fa';
import { Spinner } from 'flowbite-react';

const VehicleForm = ({
  initialValues,
  onSubmit,
  vehicleTypes,
  vehicleModels,
  vehicleBrands,
}) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: VehicleFormSchema,
    onSubmit: (values, actions) => {
      onSubmit(values, actions);
    },
  });
  return (
    <FormikProvider value={formik}>
      <Form className="space-y-4" onSubmit={formik.handleSubmit}>
        <VehicleFormFields
          vehicleTypes={vehicleTypes}
          vehicleBrands={vehicleBrands}
          vehicleModels={vehicleModels}
        />
        <Button
          type="submit"
          disabled={formik.isSubmitting}
          className="py-2 rounded"
          color={formik.isSubmitting ? 'gray' : 'purple'}
        >
          {formik.isSubmitting ? (
            <Spinner className="animate-spin" color={'purple'} size={20} />
          ) : (
            <>
              <FaSave size={20} className="mr-2" />
              Crear Vehículo
            </>
          )}
        </Button>
      </Form>
    </FormikProvider>
  );
};

export default VehicleForm;