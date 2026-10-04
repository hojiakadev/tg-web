import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { useSubmitErrors } from '@/common/helpers';
import { getApiError } from '@/common/utils';

import * as Api from '../api';
import { DIAL_CODES } from '../constants';
import * as Mappers from '../mappers';
import type * as Types from '../types';
import { loginSchema } from './schema';

type FormValues = Types.IForm.Login;

interface IChildren extends UseFormReturn<FormValues> {
  isLoading?: boolean;
}

interface IProps {
  children: (props: IChildren) => React.ReactNode;
  className?: string;
  onError?: (error: string) => void;
  onSettled?: () => void;
  /** Called once Telegram has sent the login code. */
  onSuccess?: (value: FormValues) => void;
}

const defaults: FormValues = { countryCode: '+998', phoneNumber: '' };

/** Step 1: sends the login code to the user's Telegram app (`startAuthorization`). */
const LoginForm: React.FC<IProps> = ({ children, className, onError, onSettled, onSuccess }) => {
  const mutation = useMutation<FormValues, unknown, FormValues>({
    mutationFn: async values => {
      const phoneNumber = Number(`${DIAL_CODES[values.countryCode]}${values.phoneNumber.replace(/\D/g, '')}`);
      const { data } = await Api.StartAuthorization({ phoneNumber });
      const result = Mappers.Authorization(data);
      if (!result.success) throw new Error(Mappers.AuthorizationError(result.reason));
      return values;
    },

    onSuccess: data => {
      toast.success('The code was sent to your Telegram app');
      onSuccess?.(data);
    },

    onError: error => {
      const message = getApiError(error).message || 'Unable to sign in';
      toast.error(message);
      onError?.(message);
    },

    onSettled
  });

  const form = useForm<FormValues>({
    defaultValues: defaults,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: zodResolver(loginSchema)
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

export default LoginForm;
