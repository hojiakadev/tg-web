import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';

import classes from './Fab.module.scss';

type IProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  'aria-label': string;
  ref?: Ref<HTMLButtonElement>;
};

const Fab = ({ icon, className, ref, ...props }: IProps) => (
  <button ref={ref} type="button" className={[classes.fab, className].filter(Boolean).join(' ')} {...props}>
    {icon}
  </button>
);

export default Fab;
