import React, { forwardRef, useId } from 'react';

import cx from 'clsx';
import classes from './Checkbox.module.scss';

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  error?: string;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ className, size = 'md', label, id, ...props }, ref) => {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <div className={cx(classes.wrapper, classes[size], props.disabled && classes.disabled)}>
      <input
        {...props}
        ref={ref}
        id={checkboxId}
        type="checkbox"
        className={cx(classes.checkbox, classes[size], className)}
      />

      {label && (
        <label htmlFor={checkboxId} className={classes.label}>
          {label}
        </label>
      )}

      {props.error && <p className={classes.error}>{props.error}</p>}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
