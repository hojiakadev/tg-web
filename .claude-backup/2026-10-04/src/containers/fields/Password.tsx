import { PasswordInput, type PasswordInputProps } from '@mantine/core';
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';

type IProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<PasswordInputProps, 'name' | 'value' | 'onChange' | 'error'>;

export function PasswordField<T extends FieldValues>({ control, name, rules, defaultValue, ...rest }: IProps<T>) {
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
    <PasswordInput
      {...rest}
      {...field}
      error={error?.message}
      value={field.value === undefined || field.value === null ? '' : field.value}
    />
  );
}

export default PasswordField;
