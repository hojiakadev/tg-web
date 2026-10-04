import { createTheme } from '@mantine/core';

export const COLOR_SCHEME_STORAGE_KEY = 'ms-admin-color-scheme';

export const theme = createTheme({
  primaryColor: 'indigo',
  activeClassName: 'active',
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  headings: { fontFamily: 'Inter, system-ui, -apple-system, sans-serif' },
  defaultRadius: 'md',
  components: {
    Paper: {
      defaultProps: {
        shadow: 'xs'
      }
    }
  }
});
