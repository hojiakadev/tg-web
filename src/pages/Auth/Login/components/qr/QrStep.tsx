import { Loader, Text } from '@mantine/core';
import { useEffect } from 'react';

import { Button } from '@/components/Button';
import * as Auth from '@/modules/auth';

import classes from './QrStep.module.scss';

type IProps = {
  onAuthorized: () => void;
  onPhoneLogin: () => void;
  linkClassName?: string;
};

/** "Log in by QR code": the code refreshes every 5 s until it is scanned. */
const QrStep = ({ onAuthorized, onPhoneLogin, linkClassName }: IProps) => {
  const { data, error, isError, isLoading, refetch } = Auth.Hooks.useQr();
  const authorized = data?.status === 'authorized';

  useEffect(() => {
    if (authorized) onAuthorized();
  }, [authorized, onAuthorized]);

  return (
    <>
      <div className={classes.qrFrame} aria-live="polite">
        {(isLoading || authorized) && <Loader size="md" />}
        {data?.status === 'qr' && <img src={data.image} alt="Telegram login QR code" />}
        {isError && (
          <>
            <Text ta="center" c="red" size="sm">
              {error instanceof Error ? error.message : 'Unable to load the QR code. Please try again.'}
            </Text>
            <button type="button" className={classes.qrRetry} onClick={() => refetch()}>
              Try again
            </button>
          </>
        )}
      </div>

      <div className={classes.qrHeading}>
        <h1>Log in by QR Code</h1>
      </div>

      <ol className={classes.qrSteps}>
        <li>Open Telegram on your phone</li>
        <li>
          Go to <strong>Settings</strong> → <strong>Devices</strong> → <strong>Link Desktop Device</strong>
        </li>
        <li>Point your phone at this screen to confirm login</li>
      </ol>

      <Button title="Log in by phone number" className={linkClassName} onClick={onPhoneLogin} />
    </>
  );
};

export default QrStep;
