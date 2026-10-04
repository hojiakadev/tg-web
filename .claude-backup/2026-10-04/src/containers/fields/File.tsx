import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';

import { FileInput, type FileInputProps } from '@mantine/core';

type IProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<FileInputProps, 'name' | 'value' | 'onChange' | 'error'>;

export function FileField<T extends FieldValues>({ control, name, rules, defaultValue, ...rest }: IProps<T>) {
  const {
    field,
    fieldState: { error }
  } = useController<T>({
    name,
    control,
    rules,
    defaultValue
  });

  return (
    <FileInput
      {...rest}
      name={field.name}
      value={field.value ?? null}
      ref={field.ref}
      onBlur={field.onBlur}
      onChange={field.onChange}
      error={error?.message}
    />
  );
}

export default FileField;
