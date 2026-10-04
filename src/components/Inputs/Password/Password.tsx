import React, { forwardRef, useId } from 'react';

import cx from 'clsx';
import classes from './Password.module.scss';

export type PasswordProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  error?: string;
};

const Password = forwardRef<HTMLInputElement, PasswordProps>(
  ({ className, size = 'md', label, error, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className={cx(classes.wrapper, classes[size], props.disabled && classes.disabled)}>
        {label && (
          <label htmlFor={inputId} className={classes.label}>
            {label}
          </label>
        )}

        <input
          {...props}
          ref={ref}
          type="text"
          id={inputId}
          className={cx(classes.password, classes[size], className)}
        />

        {error && <p className={classes.error}>{error}</p>}
      </div>
    );
  }
);

Password.displayName = 'Text';

export default Password;
