import { useCallback, type PointerEvent, type ReactNode } from 'react';
import { Button as MantineButton, type ButtonProps, type ElementProps } from '@mantine/core';

import { useRipple } from '@/components/Button/hooks/useRipple';
import RippleLayer from '@/components/Button/components/RippleLayer';

import classes from './Button.module.scss';

// `ButtonProps` only covers Mantine's styling props. Native button attributes
// (type, onClick, form, ...) come from `ElementProps`, which is what Mantine's
// own polymorphic factory composes internally.
interface IProps extends ButtonProps, ElementProps<'button', keyof ButtonProps | 'title'> {
  title: ReactNode;
}

export default function Button({ title, ...props }: IProps) {
  const { onPointerDown, disabled, loading, ...buttonProps } = props;
  const { ripples, handlePointerDown: createRipple, removeRipple } = useRipple(Boolean(disabled), Boolean(loading));

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(event);
      createRipple(event);
    },
    [createRipple, onPointerDown]
  );

  return (
    <MantineButton
      {...buttonProps}
      disabled={disabled}
      loading={loading}
      onPointerDown={handlePointerDown}
      classNames={{
        root: classes.root,
        label: classes.label,
        loader: classes.loader,
        section: classes.section
      }}
    >
      <RippleLayer ripples={ripples} onRippleEnd={removeRipple} />
      <span className={classes.content}>{title}</span>
    </MantineButton>
  );
}
