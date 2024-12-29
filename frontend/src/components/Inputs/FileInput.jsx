import React from 'react';
import { ErrorMessage } from 'formik';
import { FileInput as File, Label } from 'flowbite-react';
import classNames from 'classnames';
import FileIcon from '../FileIcon/FileIcon';

const FileInput = ({
  className,
  field,
  form: { setFieldValue, touched, errors },
  ...props
}) => {
  const handleChange = (e) => {
    const file = e.target.files[0];
    setFieldValue(field.name, file);
  };

  const removeFile = () => {
    setFieldValue(field.name, null);
  };

  return (
    <div className={classNames('w-full', className)}>
      <Label
        htmlFor={props.id || props.name}
        className={'block text-base font-medium'}
        color={touched[field.name] && errors[field.name] ? 'failure' : ''}
        value={props.label}
      />
      <File
        id={props.id || props.name}
        helperText={props.helperText || ''}
        accept={props.accept || ''}
        color={touched[field.name] && errors[field.name] ? 'failure' : ''}
        className="mt-1"
        onChange={handleChange}
      />
      {field.value && (
        <div className="mt-2 flex items-center bg-neutral-50 p-2">
          <FileIcon file={field.value} onRemove={removeFile} />
        </div>
      )}
      <ErrorMessage
        name={field.name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
};

export default FileInput;
