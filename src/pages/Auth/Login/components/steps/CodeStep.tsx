import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/Button';
import { TextInput } from '@/containers/fields';
import type * as Auth from '@/modules/auth';

import classes from './Steps.module.scss';

type IProps = {
  isLoading: boolean;
};

/** Login code sent by Telegram (`Auth.Forms.Code`). */
const CodeStep = ({ isLoading }: IProps) => {
  const { control } = useFormContext<Auth.Types.IForm.Code>();

  return (
    <>
      <TextInput
        control={control}
        name="code"
        label="Code"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        data-autofocus
        autoFocus
        classNames={{ root: classes.field, input: classes.input, label: classes.fieldLabel, error: classes.error }}
      />
      <Button type="submit" title="Next" fullWidth loading={isLoading} className={classes.submit} />
    </>
  );
};

export default CodeStep;
