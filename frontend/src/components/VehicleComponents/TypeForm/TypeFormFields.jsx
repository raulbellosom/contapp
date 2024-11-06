import React from 'react';
import { Field } from 'formik';
import TextInput from '../../Inputs/TextInput';
import { BiCategory } from 'react-icons/bi';
import { FaSitemap } from 'react-icons/fa';

const TypeFormFields = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Field
        name="name"
        id="name"
        component={TextInput}
        label="Nombre"
        type="text"
        icon={BiCategory}
        className="col-span-1"
      />
      <Field
        name="economicGroup"
        id="economicGroup"
        component={TextInput}
        label="Grupo económico"
        type="text"
        icon={FaSitemap}
        className="col-span-1"
      />
      <Field
        className="hidden"
        name="id"
        label="id"
        component={TextInput}
        type="hidden"
        disabled={true}
      />
    </div>
  );
};

export default TypeFormFields;
