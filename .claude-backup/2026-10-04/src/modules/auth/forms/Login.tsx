import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { BaseSyntheticEvent, ReactNode } from 'react';

import * as Api from '../api';
import * as Mappers from '../mappers';
import * as Types from '../types';
import { signIn } from '../utils/auth';

import { loginSchema, type LoginFormValues } from './schema';

const countryCodes: Record<LoginFormValues['countryCode'], string> = {
  '+998': '+998',
  'ru:+7': '+7',
  'kz:+7': '+7',
  '+996': '+996',
  '+992': '+992',
};

type IProps = {
  children: (props: {
    form: ReturnType<typeof useForm<LoginFormValues>>;
    isLoading: boolean;
    onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
  }) => ReactNode;
  onSuccess?: (session: Types.IEntity.Session) => void;
};

const LoginForm = ({ children, onSuccess }: IProps) => {
  const form = useForm<LoginFormValues>({
    defaultValues: { countryCode: '+998', phoneNumber: '' },
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const { data } = await Api.Login({
        phone: `${countryCodes[values.countryCode]}${values.phoneNumber}`,
      });
      return Mappers.Login(data);
    },
    onSuccess: (session) => {
      signIn(session);
      toast.success('Signed in successfully');
      onSuccess?.(session);
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Unable to sign in';
      toast.error(message);
    },
  });

  return children({
    form,
    isLoading: mutation.isPending,
    onSubmit: form.handleSubmit((values) => mutation.mutateAsync(values).then(() => undefined)),
  });
};

export default LoginForm;
