import cx from 'clsx';
import type { PropsWithChildren, ReactNode } from 'react';

import classes from './Main.module.scss';

type IProps = PropsWithChildren<{
  /** Left floating column (chat list, contacts, settings…). */
  navbar: ReactNode;
  /** On narrow screens the column is replaced by the content while something is open. */
  hasContent?: boolean;
}>;

const Main = ({ children, navbar, hasContent = false }: IProps) => (
  <div className={cx(classes.shell, hasContent && classes.withContent)}>
    <aside className={classes.navbar}>{navbar}</aside>
    <main className={classes.main}>{children}</main>
  </div>
);

export default Main;
