import React, { forwardRef, useId } from 'react';
import { InputMask } from '@react-input/mask';

import cx from 'clsx';

import classes from './Mask.module.scss';

export type MaskProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'children'> & {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  mask?: string;
  prefix?: string;
  labelClassName?: string;
};

const Mask = forwardRef<HTMLInputElement, MaskProps>(
  ({ className, size = 'md', label, error, id, mask = '__ ___ __ __', prefix, labelClassName, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div
        className={cx(
          classes.wrapper,
          classes[size],
          props.disabled && classes.disabled,
          error && classes.hasError
        )}
      >
        {label && (
          <label htmlFor={inputId} className={cx(classes.label, labelClassName)}>
            {label}
          </label>
        )}

        <div className={classes.inputWrap}>
          {prefix && <span className={classes.prefix}>{prefix}</span>}
          <InputMask
            {...props}
            id={inputId}
            mask={mask}
            replacement={{ _: /\d/ }}
            showMask
            type="tel"
            ref={ref}
            className={cx(classes.mask, classes[size], prefix && classes.withPrefix, className)}
          />
        </div>

        {error && <p className={classes.error}>{error}</p>}
      </div>
    );
  }
);

Mask.displayName = 'Mask';

export default Mask;
