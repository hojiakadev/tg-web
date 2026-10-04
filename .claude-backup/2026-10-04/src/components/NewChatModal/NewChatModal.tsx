import { Button, Modal, SegmentedControl, TextInput } from '@mantine/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AtSign, Phone } from 'lucide-react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { getApiError } from '@/common/utils';
import { chatIdFromPhone } from '@/helpers';
import * as Contacts from '@/modules/contacts';

import classes from './NewChatModal.module.scss';

type IProps = {
  opened: boolean;
  onClose: () => void;
  /** Called with a Green-API chat id once the user is found. */
  onSubmit: (chatId: string) => void;
};

type Mode = 'phone' | 'chatId';

const CHAT_ID_PATTERN = /^(?:\d+|[\w.-]+@(c\.us|g\.us|lid))$/;

const schema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('phone'),
    value: z
      .string()
      .trim()
      .refine(value => /^\+?[\d\s()-]+$/.test(value), 'Only digits, spaces and + are allowed')
      .refine(value => {
        const digits = value.replace(/\D/g, '').length;
        return digits >= 11 && digits <= 16;
      }, 'Enter the full number with country code, e.g. +998 90 123 45 67')
  }),
  z.object({
    mode: z.literal('chatId'),
    value: z
      .string()
      .trim()
      .refine(value => CHAT_ID_PATTERN.test(value), 'Enter a Telegram peer ID, e.g. 8515464681')
  })
]);

type FormValues = z.infer<typeof schema>;

const defaults: FormValues = { mode: 'phone', value: '' };

const toChatId = ({ mode, value }: FormValues) => (mode === 'phone' ? chatIdFromPhone(value) : value.trim());

const NewChatModal = ({ opened, onClose, onSubmit }: IProps) => {
  const form = useForm<FormValues>({ defaultValues: defaults, resolver: zodResolver(schema) });
  const mode = useWatch({ control: form.control, name: 'mode' });

  const check = useMutation({
    mutationFn: async (values: FormValues) => {
      const chatId = toChatId(values);
      // Telegram peer IDs are numeric and can be opened directly.
      if (/^\d+$/.test(chatId) || chatId.endsWith('@g.us')) return chatId;

      const { data } = await Contacts.Api.Check(
        values.mode === 'phone' ? { phoneNumber: Number(chatId.split('@')[0]) } : { chatId }
      );
      if (data.existsWhatsapp === false) throw new Error('not-found');
      return chatId;
    }
  });

  const close = () => {
    form.reset(defaults);
    check.reset();
    onClose();
  };

  const submit = form.handleSubmit(values =>
    check.mutate(values, {
      onSuccess: chatId => {
        close();
        onSubmit(chatId);
      },
      onError: error => {
        const message =
          error instanceof Error && error.message === 'not-found'
            ? values.mode === 'phone'
              ? 'There is no WhatsApp account with this phone number'
              : 'No user found with this chat ID'
            : getApiError(error).message || 'Could not check this user, please try again';
        form.setError('value', { message });
      }
    })
  );

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="New Chat"
      centered
      radius="lg"
      size="sm"
      classNames={{ title: classes.title }}
    >
      <form onSubmit={submit} className={classes.form} noValidate>
        <Controller
          control={form.control}
          name="mode"
          render={({ field }) => (
            <SegmentedControl
              fullWidth
              radius="xl"
              value={field.value}
              onChange={value => {
                field.onChange(value as Mode);
                form.setValue('value', '');
                form.clearErrors('value');
              }}
              data={[
                { value: 'chatId', label: 'Chat ID' },
                { value: 'phone', label: 'Phone number' }
              ]}
            />
          )}
        />

        <TextInput
          key={mode}
          size="md"
          radius="md"
          label={mode === 'phone' ? 'Phone number' : 'Chat ID'}
          placeholder={mode === 'phone' ? '+998 90 123 45 67' : '8515464681'}
          description={
            mode === 'phone' ? 'International format with country code' : 'Telegram peer ID or Green-API chat ID'
          }
          inputMode={mode === 'phone' ? 'tel' : 'text'}
          leftSection={mode === 'phone' ? <Phone size={18} /> : <AtSign size={18} />}
          data-autofocus
          autoComplete="off"
          error={form.formState.errors.value?.message}
          {...form.register('value')}
        />

        <div className={classes.actions}>
          <Button variant="subtle" color="gray" radius="md" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" radius="md" color="#3390ec" loading={check.isPending}>
            Add
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NewChatModal;
