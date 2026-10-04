import { Button, Modal, SegmentedControl } from '@mantine/core';
import { AtSign, Phone } from 'lucide-react';
import { Controller, useWatch, type Control } from 'react-hook-form';

import { TextInput } from '@/containers/fields';
import * as Chats from '@/modules/chats';

import classes from './NewChatModal.module.scss';

type IProps = {
  opened: boolean;
  onClose: () => void;
  /** Receives the Telegram chat id of the found user. */
  onSubmit: (chatId: string) => void;
};

const MODES: { value: Chats.Types.IForm.Mode; label: string }[] = [
  { value: 'phone', label: 'Phone number' },
  { value: 'chatId', label: 'Chat ID' }
];

const FIELD: Record<Chats.Types.IForm.Mode, { label: string; placeholder: string; description: string }> = {
  phone: {
    label: 'Phone number',
    placeholder: '+998 90 123 45 67',
    description: 'International format with country code'
  },
  chatId: {
    label: 'Chat ID or username',
    placeholder: '8515464681 or @username',
    description: 'Numeric Telegram chat ID, or a public @username'
  }
};

/** "New Private Chat": finds a Telegram user by phone number, chat id or @username. */
const NewChatModal = ({ opened, onClose, onSubmit }: IProps) => (
  <Modal opened={opened} onClose={onClose} title="New Private Chat" size="sm" classNames={{ title: classes.title }}>
    <Chats.Forms.Create
      className={classes.form}
      onSuccess={chatId => {
        onClose();
        onSubmit(chatId);
      }}
    >
      {({ control, setValue, clearErrors, isLoading }) => (
        <ModeFields
          control={control}
          isLoading={Boolean(isLoading)}
          onModeChange={() => {
            setValue('value', '');
            clearErrors('value');
          }}
          onCancel={onClose}
        />
      )}
    </Chats.Forms.Create>
  </Modal>
);

type IModeFieldsProps = {
  control: Control<Chats.Types.IForm.Create>;
  isLoading: boolean;
  onModeChange: () => void;
  onCancel: () => void;
};

const ModeFields = ({ control, isLoading, onModeChange, onCancel }: IModeFieldsProps) => {
  const mode = useWatch({ control, name: 'mode' });
  const field = FIELD[mode];

  return (
    <>
      <Controller
        control={control}
        name="mode"
        render={({ field: { value, onChange } }) => (
          <SegmentedControl
            fullWidth
            radius="xl"
            data={MODES}
            value={value}
            onChange={next => {
              onChange(next as Chats.Types.IForm.Mode);
              onModeChange();
            }}
          />
        )}
      />

      <TextInput
        key={mode}
        control={control}
        name="value"
        size="md"
        radius="md"
        label={field.label}
        placeholder={field.placeholder}
        description={field.description}
        inputMode={mode === 'phone' ? 'tel' : 'text'}
        leftSection={mode === 'phone' ? <Phone size={18} /> : <AtSign size={18} />}
        autoComplete="off"
        data-autofocus
      />

      <div className={classes.actions}>
        <Button variant="subtle" color="gray" radius="md" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" radius="md" loading={isLoading}>
          Add
        </Button>
      </div>
    </>
  );
};

export default NewChatModal;
