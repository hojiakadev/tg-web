import { Search, X } from 'lucide-react';

import classes from './SearchBar.module.scss';

type IProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  autoFocus?: boolean;
};

const SearchBar = ({ value, onChange, placeholder = 'Search', onFocus, autoFocus }: IProps) => (
  <label className={classes.root}>
    <Search size={20} className={classes.icon} />
    <input
      className={classes.input}
      value={value}
      placeholder={placeholder}
      autoFocus={autoFocus}
      onFocus={onFocus}
      onChange={event => onChange(event.currentTarget.value)}
    />
    {value && (
      <button type="button" className={classes.clear} aria-label="Clear search" onClick={() => onChange('')}>
        <X size={18} />
      </button>
    )}
  </label>
);

export default SearchBar;
