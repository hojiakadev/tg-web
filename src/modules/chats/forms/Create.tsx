import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { useSubmitErrors } from '@/common/helpers';
import { getApiError } from '@/common/utils';
import { phoneDigits } from '@/helpers';
import * as Contacts from '@/modules/contacts';

import type * as Types from '../types';
import { CHAT_ID_PATTERN, validationSchema } from './schema';

type FormValues = Types.IForm.Create;

interface IChildren extends UseFormReturn<FormValues> {
  isLoading?: boolean;
}

interface IProps {
  children: (props: IChildren) => React.ReactNode;
  className?: string;
  onError?: (error: string) => void;
  onSettled?: () => void;
  /** Receives the chat id to open. */
  onSuccess?: (chatId: string) => void;
}

const defaults: FormValues = { mode: 'phone', value: '' };

const NOT_FOUND: Record<Types.IForm.Mode, string> = {
  phone: 'There is no Telegram account with this phone number',
  chatId: 'No Telegram user found with this username'
};

/** Resolves a phone number, chat id or @username to a Telegram chat id. */
const resolveChatId = async ({ mode, value }: FormValues) => {
  const input = value.trim();
  if (mode === 'chatId' && CHAT_ID_PATTERN.test(input)) return input;

  const request: Contacts.Types.IApi.Check.Request =
    mode === 'phone'
      ? { phoneNumber: Number(phoneDigits(input)) }
      : { username: input.startsWith('@') ? input : `@${input}` };

  const { data } = await Contacts.Api.Check(request);
  const account = Contacts.Mappers.Account(data);
  if (!account.exists) throw new Error(NOT_FOUND[mode]);
  return account.chatId;
};

const CreateForm: React.FC<IProps> = ({ children, className, onError, onSettled, onSuccess }) => {
  const mutation = useMutation<string, unknown, FormValues>({
    mutationFn: resolveChatId,

    onSuccess: chatId => {
      onSuccess?.(chatId);
    },

    onError: error => {
      const message = getApiError(error).message || 'Could not find this user';
      form.setError('value', { message });
      toast.error(message);
      onError?.(message);
    },

    onSettled
  });

  const form = useForm<FormValues>({
    defaultValues: defaults,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: zodResolver(validationSchema)
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

export default CreateForm;
