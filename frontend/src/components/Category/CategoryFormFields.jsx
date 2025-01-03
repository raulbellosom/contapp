import React from 'react';
import { Field } from 'formik';
import TextInput from '../Inputs/TextInput';
import SelectInput from '../Inputs/SelectInput';
import { FaTag, FaAlignLeft } from 'react-icons/fa';
import { BiCategoryAlt } from 'react-icons/bi';

const CategoryFormFields = ({ editMode }) => {
  const categoryTypes = [
    { value: 'INCOME', label: 'Ingreso' },
    { value: 'EXPENSE', label: 'Gasto' },
  ];

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
      <Field
        name="name"
        id="name"
        component={TextInput}
        label="Nombre de la Categoría"
        type="text"
        icon={FaTag}
      />
      <Field
        name="type"
        id="type"
        component={SelectInput}
        label="Tipo de Categoría"
        options={categoryTypes}
        icon={BiCategoryAlt}
      />
      <Field
        name="description"
        id="description"
        component={TextInput}
        label="Descripción"
        type="text"
        icon={FaAlignLeft}
      />
      {editMode && (
        <Field name="id" id="id" component={TextInput} type="hidden" />
      )}
    </div>
  );
};

export default React.memo(CategoryFormFields);
