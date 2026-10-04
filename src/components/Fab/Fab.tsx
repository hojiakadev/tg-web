import cx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';

import classes from './Fab.module.scss';

type IProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  'aria-label': string;
  ref?: Ref<HTMLButtonElement>;
};

/** Floating action button (pencil / plus) of the left column. */
const Fab = ({ icon, className, ref, ...props }: IProps) => (
  <button ref={ref} type="button" className={cx(classes.fab, className)} {...props}>
    {icon}
  </button>
);

export default Fab;
