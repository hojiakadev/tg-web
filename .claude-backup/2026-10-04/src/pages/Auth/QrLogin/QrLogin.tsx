import { Loader, Text } from '@mantine/core';
import { Button } from '@/components/Button';

import { Hooks } from '@/modules/auth';

import classes from './QrLogin.module.scss';

type IProps = {
  onBack: () => void;
};

const QrLogin = ({ onBack }: IProps) => {
  const { data: qrSource, error, isError, isLoading, refetch } = Hooks.useQrCode(true);

  return (
    <>
      <div className={classes.qrFrame} aria-live="polite">
        {isLoading && <Loader color="blue" size="md" />}
        {qrSource && <img src={qrSource} alt="Telegram login QR code" />}
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
        <Text ta="center" className={classes.description}>
          Scan with Telegram app on your phone
        </Text>
      </div>

      <ol className={classes.qrSteps}>
        <li>Open Telegram on your phone</li>
        <li>
          Go to <strong>Settings</strong> → <strong>Devices</strong> → <strong>Add Device</strong>
        </li>
        <li>Point your phone at this screen to confirm login</li>
      </ol>

      <Button title="Log in by phone number" className={classes.link} onClick={onBack} />
    </>
  );
};

export default QrLogin;
