import { TextInput, type TextInputProps } from '@mantine/core';
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';

type IProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<TextInputProps, 'name' | 'value' | 'onChange' | 'error'>;

export function Text<T extends FieldValues>({ control, name, rules, defaultValue, ...rest }: IProps<T>) {
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
    <TextInput
      {...rest}
      {...field}
      error={error?.message}
      value={field.value === undefined || field.value === null ? '' : field.value}
    />
  );
}

export default Text;
