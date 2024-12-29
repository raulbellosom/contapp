import React from 'react';
import { ErrorMessage } from 'formik';
import { Label, Select } from 'flowbite-react';
import classNames from 'classnames';

const ColorSelectInput = ({
  field,
  className,
  form: { touched, errors, setFieldValue },
  options,
  ...props
}) => {
  return (
    <div className={classNames('w-full', className)}>
      <Label
        htmlFor={props.id || props.name}
        className="block text-base font-medium"
        color={touched[field.name] && errors[field.name] ? 'failure' : ''}
        value={props.label}
      />
      <Select
        {...field}
        {...props}
        color={touched[field.name] && errors[field.name] ? 'failure' : ''}
        className="mt-1"
        onChange={(e) => {
          setFieldValue(field.name, e.target.value);
        }}
      >
        <option disabled value="">
          Seleccione un color
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            style={{
              color: option.value, // Texto del color en el mismo color
              fontWeight: 'bold',
            }}
          >
            {option.label}
          </option>
        ))}
      </Select>
      <ErrorMessage
        name={field.name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
};

export default ColorSelectInput;
