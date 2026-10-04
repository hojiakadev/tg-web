import { Select } from '@mantine/core';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Button } from '@/components/Button';
import { Mask } from '@/components/Inputs/Mask';
import * as Auth from '@/modules/auth';

import classes from './Steps.module.scss';

type IProps = {
  isLoading: boolean;
};

/** Country + phone number fields of `Auth.Forms.Login`. */
const PhoneStep = ({ isLoading }: IProps) => {
  const { control, setValue } = useFormContext<Auth.Types.IForm.Login>();
  const countryCode = useWatch({ control, name: 'countryCode' });

  return (
    <>
      <Controller
        name="countryCode"
        control={control}
        render={({ field, fieldState }) => (
          <Select
            {...field}
            label="Country"
            data={Auth.Constants.COUNTRIES}
            error={fieldState.error?.message}
            allowDeselect={false}
            searchable={false}
            onChange={value => {
              field.onChange(value);
              setValue('phoneNumber', '');
            }}
            classNames={{ root: classes.field, input: classes.input, label: classes.fieldLabel }}
          />
        )}
      />
      <Controller
        name="phoneNumber"
        control={control}
        render={({ field, fieldState }) => (
          <Mask
            {...field}
            label={fieldState.error ? 'Phone Number Invalid' : 'Phone Number'}
            mask={Auth.Constants.PHONE_MASKS[countryCode] ?? Auth.Constants.PHONE_MASKS['+998']}
            placeholder=" "
            prefix={countryCode.split(':').at(-1)}
            error={fieldState.error?.message}
            className={classes.maskInput}
            labelClassName={fieldState.error ? classes.errorLabel : undefined}
          />
        )}
      />
      <Button type="submit" title="Next" fullWidth loading={isLoading} className={classes.submit} />
    </>
  );
};

export default PhoneStep;
