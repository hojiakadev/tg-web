import React, { forwardRef, useId } from 'react';

import cx from 'clsx';
import classes from './Select.module.scss';

export interface SelectOption {
  label: string;
  value: string;
}

export type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  options?: SelectOption[];
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, size = 'md', label, error, id, options = [], children, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className={cx(classes.wrapper, classes[size], props.disabled && classes.disabled)}>
        {label && (
          <label htmlFor={selectId} className={classes.label}>
            {label}
          </label>
        )}

        <select {...props} ref={ref} id={selectId} className={cx(classes.select, classes[size], className)}>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}

          {children}
        </select>

        {error && <p className={classes.error}>{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
