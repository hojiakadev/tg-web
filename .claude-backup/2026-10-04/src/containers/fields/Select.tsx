import { Select, type SelectProps } from '@mantine/core';
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';

type IProps<T extends FieldValues> = UseControllerProps<T> & Omit<SelectProps, 'name' | 'value' | 'onChange' | 'error'>;

export function SelectField<T extends FieldValues>({ control, name, rules, defaultValue, ...rest }: IProps<T>) {
  const {
    field,
    fieldState: { error }
  } = useController<T>({
    name,
    rules,
    control,
    defaultValue
  });

  return <Select {...rest} {...field} error={error?.message} />;
}

export default SelectField;
