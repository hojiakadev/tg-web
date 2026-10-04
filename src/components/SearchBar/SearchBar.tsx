import { Search, X } from 'lucide-react';
import type { KeyboardEvent, Ref } from 'react';

import classes from './SearchBar.module.scss';

type IProps = {
  value: string;
  onChange: (value: string) => void;
  /** Enter pressed — e.g. open the first result. */
  onEnter?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  ref?: Ref<HTMLInputElement>;
};

const SearchBar = ({ value, onChange, onEnter, placeholder = 'Search', autoFocus, ref }: IProps) => {
  // Escape clears the query first, then leaves the field; it never reaches the page shortcuts
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onEnter) {
      event.preventDefault();
      onEnter();
    }
    if (event.key === 'Escape') {
      event.stopPropagation();
      if (value) onChange('');
      else event.currentTarget.blur();
    }
  };

  return (
    <label className={classes.root}>
      <Search size={20} className={classes.icon} />
      <input
        ref={ref}
        className={classes.input}
        type="search"
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onChange={event => onChange(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
      />
      {value && (
        <button type="button" className={classes.clear} aria-label="Clear search" onClick={() => onChange('')}>
          <X size={18} />
        </button>
      )}
    </label>
  );
};

export default SearchBar;
