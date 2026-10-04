import React, { forwardRef, useId } from 'react';

import cx from 'clsx';
import classes from './Text.module.scss';

export type TextProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  error?: string;
};

const Text = forwardRef<HTMLInputElement, TextProps>(({ className, size = 'md', label, error, id, ...props }, ref) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cx(classes.wrapper, classes[size], props.disabled && classes.disabled)}>
      {label && (
        <label htmlFor={inputId} className={classes.label}>
          {label}
        </label>
      )}

      <input {...props} ref={ref} id={inputId} type="text" className={cx(classes.text, classes[size], className)} />

      {error && <p className={classes.error}>{error}</p>}
    </div>
  );
});

Text.displayName = 'Text';

export default Text;
