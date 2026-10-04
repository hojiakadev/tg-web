import { ActionIcon, type ActionIconProps, type ElementProps } from '@mantine/core';
import cx from 'clsx';
import type { ReactNode, Ref } from 'react';

import classes from './IconButton.module.scss';

interface IProps extends Omit<ActionIconProps, 'children'>, ElementProps<'button', keyof ActionIconProps> {
  icon: ReactNode;
  'aria-label': string;
  ref?: Ref<HTMLButtonElement>;
}

/** Round, borderless icon button used in Telegram headers and toolbars. */
const IconButton = ({ icon, className, ...props }: IProps) => (
  <ActionIcon variant="subtle" color="gray" size={40} radius="xl" className={cx(classes.root, className)} {...props}>
    {icon}
  </ActionIcon>
);

export default IconButton;
