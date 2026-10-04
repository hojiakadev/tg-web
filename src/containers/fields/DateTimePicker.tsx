import { DateTimePicker, type DateTimePickerProps } from '@mantine/dates';
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';

type IProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<DateTimePickerProps, 'name' | 'value' | 'onChange' | 'error'>;

export function DateTimePickerField<T extends FieldValues>({ control, name, rules, defaultValue, ...rest }: IProps<T>) {
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
    <DateTimePicker
      {...rest}
      {...field}
      error={error?.message}
      valueFormat="DD MMM YYYY hh:mm A"
      value={field.value === undefined || field.value === null ? '' : field.value}
    />
  );
}

export default DateTimePickerField;
