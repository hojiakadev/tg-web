import { Paper, Stack, Text, Title } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import { formatPhone } from '@/helpers';
import Auth from '@/layouts/Auth';
import * as AuthModule from '@/modules/auth';

import QrStep from './components/qr/QrStep';
import { CodeStep, PasswordStep, PhoneStep } from './components/steps';
import stepClasses from './components/steps/Steps.module.scss';
import classes from './Login.module.scss';

type Step = 'phone' | 'code' | 'password' | 'qr';

/** Where Escape / "Back" leads from each step. QR code is the first step. */
const BACK: Partial<Record<Step, Step>> = { phone: 'qr', code: 'phone', password: 'phone' };

const HEADINGS: Record<Exclude<Step, 'qr'>, { title: string; description: string }> = {
  phone: { title: 'Sign in to Telegram', description: 'Please confirm your country code and enter your phone number.' },
  code: { title: 'Enter the code', description: 'We have sent the code to the Telegram app on your other device.' },
  password: {
    title: 'Enter Your Password',
    description: 'Your account is protected with an additional password (two-step verification).'
  }
};

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedStep, setStep] = useState<Step>('qr');
  const [phone, setPhone] = useState('');

  // reacts to a QR scan or a password requested by Telegram while the screen is open
  const { data: state } = AuthModule.Hooks.useInstanceState({
    refetchInterval: AuthModule.Constants.STATE_REFRESH_INTERVAL
  });

  const finish = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: AuthModule.Constants.QUERY_KEYS.state });
    navigate({ to: '/' });
  }, [navigate, queryClient]);

  useEffect(() => {
    if (state === 'authorized') void finish();
  }, [state, finish]);

  // a scanned QR code on an account with two-step verification waits for the password
  const step: Step = state === 'pendingPassword' ? 'password' : selectedStep;

  // Escape walks back: code / password -> phone number -> QR code
  useHotkeys([['Escape', () => BACK[step] && setStep(BACK[step]), { preventDefault: false }]], []);

  const heading = step === 'qr' ? undefined : HEADINGS[step];

  return (
    <Auth>
      <Paper className={classes.card} radius={28} shadow="xl" withBorder={false}>
        {step === 'qr' ? (
          <QrStep onAuthorized={finish} onPhoneLogin={() => setStep('phone')} linkClassName={classes.link} />
        ) : (
          <>
            <div className={classes.logo}>
              <img src="/logo.png" alt="Telegram Web" />
            </div>

            <Stack gap={6} align="center" className={classes.heading}>
              <Title order={1}>{step === 'code' && phone ? phone : heading?.title}</Title>
              <Text ta="center" size="md" className={classes.description}>
                {heading?.description}
              </Text>
            </Stack>

            {step === 'phone' && (
              <AuthModule.Forms.Login
                className={stepClasses.form}
                onSuccess={values => {
                  setPhone(formatPhone(`${AuthModule.Constants.DIAL_CODES[values.countryCode]}${values.phoneNumber}`));
                  setStep('code');
                }}
              >
                {({ isLoading }) => <PhoneStep isLoading={Boolean(isLoading)} />}
              </AuthModule.Forms.Login>
            )}

            {step === 'code' && (
              <AuthModule.Forms.Code
                className={stepClasses.form}
                onSuccess={finish}
                onPasswordRequired={() => setStep('password')}
              >
                {({ isLoading }) => <CodeStep isLoading={Boolean(isLoading)} />}
              </AuthModule.Forms.Code>
            )}

            {step === 'password' && (
              <AuthModule.Forms.Password className={stepClasses.form} onSuccess={finish}>
                {({ isLoading }) => <PasswordStep isLoading={Boolean(isLoading)} />}
              </AuthModule.Forms.Password>
            )}

            {step === 'phone' ? (
              <Button
                my="md"
                variant="subtle"
                title="Log in by QR code"
                className={classes.link}
                onClick={() => setStep('qr')}
              />
            ) : (
              <Button title="Back" variant="subtle" className={classes.link} onClick={() => setStep('phone')} />
            )}
          </>
        )}
      </Paper>
    </Auth>
  );
};

export default Login;
