import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { Moon, Sun } from 'lucide-react';

import classes from './ThemeSwitcher.module.scss';

type IProps = {
  className?: string;
};

const ThemeSwitcher = ({ className }: IProps) => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');
  const isDark = computedColorScheme === 'dark';

  return (
    <ActionIcon
      className={className ?? classes.root}
      classNames={{ icon: classes.icon }}
      variant="subtle"
      size="lg"
      radius="xl"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Sun size={19} strokeWidth={2} /> : <Moon size={19} strokeWidth={2} />}
    </ActionIcon>
  );
};

export default ThemeSwitcher;
