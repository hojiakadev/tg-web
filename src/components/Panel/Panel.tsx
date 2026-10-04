import cx from 'clsx';
import type { PropsWithChildren, ReactNode } from 'react';

import classes from './Panel.module.scss';

type IProps = PropsWithChildren<{
  header: ReactNode;
  /** Floating action button pinned to the bottom-right corner. */
  fab?: ReactNode;
  variant?: 'default' | 'secondary';
  className?: string;
}>;

/** Left-column screen: header, scrollable body and an optional floating button. */
const Panel = ({ header, fab, variant = 'default', className, children }: IProps) => (
  <section className={cx(classes.panel, classes[variant], className)}>
    <header className={classes.header}>{header}</header>
    <div className={classes.body}>{children}</div>
    {fab && <div className={classes.fab}>{fab}</div>}
  </section>
);

export default Panel;
