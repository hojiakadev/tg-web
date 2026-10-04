import React, { forwardRef, useId } from 'react';

import cx from 'clsx';
import classes from './Number.module.scss';

export type NumberProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  error?: string;
};

const Number = forwardRef<HTMLInputElement, NumberProps>(
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
          id={inputId}
          type="number"
          className={cx(classes.number, classes[size], className)}
        />

        {error && <p className={classes.error}>{error}</p>}
      </div>
    );
  }
);

Number.displayName = 'Number';

export default Number;
