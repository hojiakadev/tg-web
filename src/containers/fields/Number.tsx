import { NumberInput, type NumberInputProps } from '@mantine/core';

import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';

type IProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<NumberInputProps, 'name' | 'value' | 'onChange' | 'error'>;

export function NumberField<T extends FieldValues>({ control, name, rules, defaultValue, ...rest }: IProps<T>) {
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
    <NumberInput
      {...rest}
      {...field}
      value={field.value ?? ''}
      onChange={value => {
        field.onChange(value === '' ? undefined : Number(value));
      }}
      error={error?.message}
    />
  );
}

export default NumberField;
