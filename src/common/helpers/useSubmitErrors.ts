import { useEffect } from 'react';
import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

/**
 * Validation errors appear only when the form is submitted.
 * While the user types, the edited field's error is cleared and nothing is re-validated
 * until the next submit. Pair with `mode: 'onSubmit'` and `reValidateMode: 'onSubmit'`.
 */
const useSubmitErrors = <T extends FieldValues>({ subscribe, clearErrors }: UseFormReturn<T>) => {
  useEffect(
    () =>
      subscribe({
        formState: { values: true },
        callback: ({ name, type }) => {
          if (name && type === 'change') clearErrors(name as FieldPath<T>);
        }
      }),
    [subscribe, clearErrors]
  );
};

export default useSubmitErrors;
