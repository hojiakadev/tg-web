import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { useSubmitErrors } from '@/common/helpers';
import { getApiError } from '@/common/utils';

import * as Api from '../api';
import { TWO_FA_REQUIRED } from '../constants';
import * as Mappers from '../mappers';
import type * as Types from '../types';
import { codeSchema } from './schema';

type FormValues = Types.IForm.Code;

interface IChildren extends UseFormReturn<FormValues> {
  isLoading?: boolean;
}

interface IProps {
  children: (props: IChildren) => React.ReactNode;
  className?: string;
  onError?: (error: string) => void;
  onSettled?: () => void;
  onSuccess?: () => void;
  /** The account has two-step verification — ask for the cloud password next. */
  onPasswordRequired?: () => void;
}

const defaults: FormValues = { code: '' };

/** Step 2: confirms the code Telegram sent (`sendAuthorizationCode`). */
const CodeForm: React.FC<IProps> = ({ children, className, onError, onSettled, onSuccess, onPasswordRequired }) => {
  const mutation = useMutation<Types.IEntity.Authorization, unknown, FormValues>({
    mutationFn: async ({ code }) => {
      const { data } = await Api.SendCode({ code });
      const result = Mappers.Authorization(data);
      if (!result.success && result.reason !== TWO_FA_REQUIRED) {
        throw new Error(Mappers.AuthorizationError(result.reason));
      }
      return result;
    },

    onSuccess: result => {
      if (result.reason === TWO_FA_REQUIRED) {
        onPasswordRequired?.();
        return;
      }
      toast.success('Signed in successfully');
      onSuccess?.();
    },

    onError: error => {
      const message = getApiError(error).message || 'Invalid code';
      form.setError('code', { message });
      toast.error(message);
      onError?.(message);
    },

    onSettled
  });

  const form = useForm<FormValues>({
    defaultValues: defaults,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: zodResolver(codeSchema)
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

export default CodeForm;
