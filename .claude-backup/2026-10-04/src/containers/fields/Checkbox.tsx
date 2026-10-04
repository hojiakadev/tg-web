import { Checkbox, type CheckboxProps } from '@mantine/core';
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';

type IProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<CheckboxProps, 'name' | 'value' | 'onChange' | 'error'>;

export function CheckboxField<T extends FieldValues>({ control, name, rules, defaultValue, ...rest }: IProps<T>) {
  const {
    field,
    fieldState: { error }
  } = useController<T>({
    name,
    control,
    rules,
    defaultValue
  });

  return <Checkbox {...field} {...rest} checked={!!field.value} error={error?.message} />;
}

export default CheckboxField;
