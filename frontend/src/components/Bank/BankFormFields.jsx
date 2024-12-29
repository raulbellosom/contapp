import React from 'react';
import { Field } from 'formik';
import TextInput from '../Inputs/TextInput';
import FileInput from '../Inputs/FileInput';
import { FaGlobe, FaUniversity } from 'react-icons/fa';

const BankFormFields = ({ editMode }) => {
  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
      <Field
        name="name"
        id="name"
        component={TextInput}
        label="Nombre del Banco"
        type="text"
        icon={FaUniversity}
      />
      <Field
        name="country"
        id="country"
        component={TextInput}
        label="País"
        type="text"
        icon={FaGlobe}
      />
      <Field
        name="logo"
        id="logo"
        component={FileInput}
        label="Logo del Banco"
        type="file"
        accept="image/*"
        className="col-span-2"
      />
      <Field name="id" id="id" component={TextInput} type="hidden" />
    </div>
  );
};

export default React.memo(BankFormFields);
