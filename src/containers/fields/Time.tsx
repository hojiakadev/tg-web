import { TimeInput, type TimeInputProps } from '@mantine/dates';
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';

type IProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<TimeInputProps, 'name' | 'value' | 'onChange' | 'error'>;

export function TimeField<T extends FieldValues>({ control, name, rules, defaultValue, ...rest }: IProps<T>) {
  const {
    field,
    fieldState: { error }
  } = useController<T>({
    name,
    rules,
    control,
    defaultValue
  });

  return (
    <TimeInput
      {...rest}
      {...field}
      error={error?.message}
      value={field.value === undefined || field.value === null ? '' : field.value}
    />
  );
}

export default TimeField;
