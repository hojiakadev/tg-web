import { Button } from '@/components/Button';
import { Paper, Select, Space, Stack, Text, Title } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

import storage from '@/common/services/storage';
import { Mask } from '@/components/Inputs/Mask';
import Auth from '@/layouts/Auth';
import { Forms } from '@/modules/auth';
import QrLogin from '../QrLogin/QrLogin';

import classes from './Login.module.scss';

const countries = [
  { value: '+998', label: 'Uzbekistan' },
  { value: 'ru:+7', label: 'Russia (+7)' },
  { value: 'kz:+7', label: 'Kazakhstan (+7)' },
  { value: '+996', label: 'Kyrgyzstan' },
  { value: '+992', label: 'Tajikistan' },
];

const phoneMasks: Record<string, string> = {
  '+998': '__ ___ __ __',
  'ru:+7': '(___) ___-__-__',
  'kz:+7': '(___) ___-__-__',
  '+996': '___ ___ ___',
  '+992': '__ ___ __ __',
};
const SIGN_IN_METHOD_KEY = 'auth.signInMethod';
type SignInMethod = 'phone' | 'qr';

const Login = () => {
  const navigate = useNavigate();
  const [isQrLogin, setIsQrLogin] = useState<SignInMethod>(() => {
    return storage.local.get(SIGN_IN_METHOD_KEY) === 'qr' ? 'qr' : 'phone';
  });
  const showQrLogin = isQrLogin === 'qr';
  const setSignInMethod = (method: SignInMethod) => {
    storage.local.set(SIGN_IN_METHOD_KEY, method);
    setIsQrLogin(method);
  };
  return (
    <Auth>
      <Paper className={classes.card} radius={28} shadow="xl" withBorder={false}>
        {!showQrLogin && (
          <div className={classes.logo}>
            <img src="/logo.png" alt="Telegram Web" />
          </div>
        )}
        {showQrLogin ? (
          <QrLogin onBack={() => setSignInMethod('phone')} />
        ) : (
          <>
            <Stack gap={6} align="center" className={classes.heading}>
              <Title order={1}>Sign in to Telegram</Title>
              <Text ta="center" size="md" className={classes.description}>
                Please confirm your country code
                <br />
                and enter your phone number.
              </Text>
            </Stack>

            <Forms.Login onSuccess={() => navigate({ to: '/' })}>
              {({ form, isLoading, onSubmit }) => {
                const selectedCountry = form.watch('countryCode');

                return (
                  <form className={classes.form} onSubmit={onSubmit}>
                  <Controller
                    name="countryCode"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Select
                        {...field}
                        label="Country"
                        data={countries}
                        error={fieldState.error?.message}
                        allowDeselect={false}
                        searchable={false}
                        onChange={(value) => {
                          field.onChange(value);
                          form.setValue('phoneNumber', '');
                        }}
                        classNames={{ root: classes.field, input: classes.input, label: classes.fieldLabel }}
                      />
                    )}
                  />
                  <Controller
                    name="phoneNumber"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Mask
                        {...field}
                        label={fieldState.error ? 'Phone Number Invalid' : 'Phone Number'}
                        mask={phoneMasks[selectedCountry] ?? phoneMasks['+998']}
                        placeholder=" "
                        prefix={selectedCountry.split(':').at(-1)}
                        error={fieldState.error?.message}
                        className={classes.maskInput}
                        labelClassName={fieldState.error ? classes.errorLabel : undefined}
                      />
                    )}
                  />
                  <Button type="submit" title="Next" fullWidth loading={isLoading} className={classes.submit} />
                  </form>
                );
              }}
            </Forms.Login>

            <Space h={12} />
            <Button
              title="Log in by QR code"
              variant="subtle"
              className={classes.link}
              onClick={() => setSignInMethod('qr')}
            />

          </>
        )}
      </Paper>
    </Auth>
  );
};

export default Login;
