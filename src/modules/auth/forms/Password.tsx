import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { useSubmitErrors } from '@/common/helpers';
import { getApiError } from '@/common/utils';

import * as Api from '../api';
import * as Mappers from '../mappers';
import type * as Types from '../types';
import { passwordSchema } from './schema';

type FormValues = Types.IForm.Password;

interface IChildren extends UseFormReturn<FormValues> {
  isLoading?: boolean;
}

interface IProps {
  children: (props: IChildren) => React.ReactNode;
  className?: string;
  onError?: (error: string) => void;
  onSettled?: () => void;
  onSuccess?: () => void;
}

const defaults: FormValues = { password: '' };

/** Step 3 (two-step verification only): sends the cloud password (`sendAuthorizationPassword`). */
const PasswordForm: React.FC<IProps> = ({ children, className, onError, onSettled, onSuccess }) => {
  const mutation = useMutation<void, unknown, FormValues>({
    mutationFn: async ({ password }) => {
      const { data } = await Api.SendPassword({ password });
      const result = Mappers.Authorization(data);
      if (!result.success) throw new Error(Mappers.AuthorizationError(result.reason));
    },

    onSuccess: () => {
      toast.success('Signed in successfully');
      onSuccess?.();
    },

    onError: error => {
      const message = getApiError(error).message || 'Incorrect password';
      form.setError('password', { message });
      toast.error(message);
      onError?.(message);
    },

    onSettled
  });

  const form = useForm<FormValues>({
    defaultValues: defaults,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: zodResolver(passwordSchema)
  });
  useSubmitErrors(form);

  const onSubmit = form.handleSubmit(values => mutation.mutate(values));

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className={className} noValidate>
        {children({ ...form, isLoading: mutation.isPending })}
      </form>
    </FormProvider>
  );
};

export default PasswordForm;
