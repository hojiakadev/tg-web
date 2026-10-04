import type { PropsWithChildren } from 'react';

import ThemeSwitcher from '@/components/ThemeSwitcher';

import classes from './Auth.module.scss';

const Auth = ({ children }: PropsWithChildren) => {
  return (
    <main className={classes.root}>
      <div className={classes.switcher}>
        <ThemeSwitcher />
      </div>
      <section className={classes.content}>{children}</section>
    </main>
  );
};

export default Auth;
