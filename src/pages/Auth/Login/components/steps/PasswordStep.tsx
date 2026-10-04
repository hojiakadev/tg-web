import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/Button';
import { Password } from '@/containers/fields';
import type * as Auth from '@/modules/auth';

import classes from './Steps.module.scss';

type IProps = {
  isLoading: boolean;
};

/** Two-step verification cloud password (`Auth.Forms.Password`). */
const PasswordStep = ({ isLoading }: IProps) => {
  const { control } = useFormContext<Auth.Types.IForm.Password>();

  return (
    <>
      <Password
        control={control}
        name="password"
        label="Password"
        autoComplete="current-password"
        autoFocus
        classNames={{
          root: classes.field,
          input: classes.input,
          innerInput: classes.innerInput,
          label: classes.fieldLabel,
          error: classes.error
        }}
      />
      <Button type="submit" title="Next" fullWidth loading={isLoading} className={classes.submit} />
    </>
  );
};

export default PasswordStep;
