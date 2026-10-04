import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { useSubmitErrors } from '@/common/helpers';
import { getApiError } from '@/common/utils';

import * as Api from '../api';
import { QUERY_KEYS } from '../constants';
import * as Mappers from '../mappers';
import type * as Types from '../types';
import { validationSchema } from './schema';

type FormValues = Types.IForm.Create;

interface IChildren extends UseFormReturn<FormValues> {
  isLoading?: boolean;
}

interface IProps {
  chatId: string;
  /** Message the new one replies to. */
  quoted?: Types.IEntity.Message;
  children: (props: IChildren) => React.ReactNode;
  className?: string;
  onError?: (error: string) => void;
  onSettled?: () => void;
  onSuccess?: (value: Types.IEntity.Message) => void;
}

const defaults: FormValues = { message: '' };

/**
 * Sends a text message. The message is shown immediately as "pending" and replaced by the API echo.
 * A success toast per message would be noise in a chat, so only failures are toasted.
 */
const CreateForm: React.FC<IProps> = ({ chatId, quoted, children, className, onError, onSettled, onSuccess }) => {
  const queryClient = useQueryClient();
  const queryKey = QUERY_KEYS.list(chatId);

  const mutation = useMutation<Types.IEntity.Message, unknown, FormValues>({
    mutationFn: async ({ message }) => {
      const text = message.trim();
      const pending = Mappers.Outgoing(chatId, `pending-${Date.now()}`, { text, quoted });
      queryClient.setQueryData<Types.IQuery.List>(queryKey, list => Mappers.Upsert(list, pending));

      try {
        const { data } = await Api.Send({ chatId, message: text, quotedMessageId: quoted?.id });
        const sent = { ...pending, id: data.idMessage, status: 'sent' as const };
        queryClient.setQueryData<Types.IQuery.List>(queryKey, list =>
          Mappers.Upsert({ results: (list?.results ?? []).filter(item => item.id !== pending.id) }, sent)
        );
        return sent;
      } catch (error) {
        queryClient.setQueryData<Types.IQuery.List>(queryKey, list => Mappers.UpdateStatus(list, pending.id, 'failed'));
        throw error;
      }
    },

    onSuccess: data => onSuccess?.(data),

    onError: error => {
      const message = getApiError(error).message || 'Message was not sent';
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

  const onSubmit = form.handleSubmit(values => {
    // clear the composer right away, like Telegram does
    form.reset(defaults);
    mutation.mutate(values);
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className={className}>
        {children({ ...form, isLoading: mutation.isPending })}
      </form>
    </FormProvider>
  );
};

export default CreateForm;
