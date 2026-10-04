import { createTheme, Menu, Modal, type MantineColorsTuple } from '@mantine/core';

import menuClasses from './Menu.module.scss';

export const COLOR_SCHEME_STORAGE_KEY = 'ms-admin-color-scheme';

/** Telegram blue (#3390ec) as shade 6. */
const telegram: MantineColorsTuple = [
  '#e7f2fd',
  '#d0e4fa',
  '#a0c8f4',
  '#6daaee',
  '#4592ea',
  '#3a8ae9',
  '#3390ec',
  '#2272d1',
  '#1765bc',
  '#0057a7'
];

export const theme = createTheme({
  colors: { telegram },
  primaryColor: 'telegram',
  primaryShade: 6,
  activeClassName: 'active',
  fontFamily: 'Roboto, system-ui, -apple-system, sans-serif',
  headings: { fontFamily: 'Roboto, system-ui, -apple-system, sans-serif' },
  defaultRadius: 'md',
  components: {
    Paper: {
      defaultProps: {
        shadow: 'xs'
      }
    },
    Menu: Menu.extend({
      defaultProps: { shadow: 'md', transitionProps: { transition: 'pop', duration: 150 } },
      classNames: menuClasses
    }),
    Modal: Modal.extend({
      defaultProps: { radius: 'lg', centered: true }
    })
  }
});
