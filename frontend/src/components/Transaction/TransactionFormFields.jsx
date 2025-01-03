import React from 'react';
import { Field } from 'formik';
import TextInput from '../Inputs/TextInput';
import SelectInput from '../Inputs/SelectInput';
import DateInput from '../Inputs/DateInput';
import { FaDollarSign, FaTag, FaCalendarAlt } from 'react-icons/fa';
import { MdDescription } from 'react-icons/md';
import { BiCategory, BiWallet } from 'react-icons/bi';

const TransactionFormFields = ({
  transactionTypes,
  categories,
  accounts,
  editMode,
}) => {
  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
      <Field
        name="amount"
        id="amount"
        component={TextInput}
        label="Monto"
        type="number"
        icon={FaDollarSign}
      />

      <Field
        name="date"
        id="date"
        component={DateInput}
        label="Fecha"
        type="date"
        icon={FaCalendarAlt}
      />
      <Field
        name="description"
        id="description"
        component={TextInput}
        label="Descripción"
        type="text"
        icon={MdDescription}
      />
      <Field
        name="categoryId"
        id="categoryId"
        component={SelectInput}
        label="Categoría"
        options={categories?.map((category) => ({
          value: category.id,
          label: category.name,
        }))}
        icon={FaTag}
      />
      <Field
        name="accountId"
        id="accountId"
        component={SelectInput}
        label="Cuenta"
        options={accounts?.map((account) => ({
          value: account.id,
          label: account.name,
        }))}
        icon={BiWallet}
      />
      {editMode && (
        <Field name="id" id="id" component={TextInput} type="hidden" />
      )}
    </div>
  );
};

export default React.memo(TransactionFormFields);
