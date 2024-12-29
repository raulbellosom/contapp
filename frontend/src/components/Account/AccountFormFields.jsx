import React from 'react';
import { Field } from 'formik';
import TextInput from '../Inputs/TextInput';
import SelectInput from '../Inputs/SelectInput';
import { FaDollarSign, FaTag, FaPalette } from 'react-icons/fa';
import { BsBank, BsFillCreditCard2BackFill } from 'react-icons/bs';
import { BiWallet } from 'react-icons/bi';
import ColorSelectInput from '../Inputs/ColorSelectInput';
import tailwindColors from '../../utils/tailwindColors';

const AccountFormFields = ({ accountTypes, editMode, banks }) => {
  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
      <Field
        name="name"
        id="name"
        component={TextInput}
        label="Nombre de la Cuenta"
        type="text"
        icon={BiWallet}
      />
      <Field
        name="type"
        id="type"
        component={SelectInput}
        label="Tipo de Cuenta"
        options={accountTypes}
        icon={BsFillCreditCard2BackFill}
      />
      <Field
        name="balance"
        id="balance"
        component={TextInput}
        label="Balance Inicial"
        type="number"
        icon={FaDollarSign}
      />
      <Field
        name="color"
        id="color"
        component={ColorSelectInput}
        label="Color"
        options={tailwindColors}
        icon={FaPalette}
      />
      <Field
        name="bankId"
        id="bankId"
        component={SelectInput}
        label="Banco"
        options={banks?.map((bank) => ({
          value: bank.id,
          label: bank.name,
        }))}
        icon={BsBank}
      />
      {editMode && (
        <Field name="id" id="id" component={TextInput} type="hidden" />
      )}
    </div>
  );
};

export default React.memo(AccountFormFields);
