import type { PropsWithChildren, ReactNode } from 'react';

import classes from './Panel.module.scss';

type IProps = PropsWithChildren<{
  header: ReactNode;
  /** Floating action button pinned to the bottom-right corner. */
  fab?: ReactNode;
  className?: string;
}>;

const Panel = ({ header, fab, className, children }: IProps) => (
  <section className={[classes.panel, className].filter(Boolean).join(' ')}>
    <header className={classes.header}>{header}</header>
    <div className={classes.body}>{children}</div>
    {fab && <div className={classes.fab}>{fab}</div>}
  </section>
);

export default Panel;
