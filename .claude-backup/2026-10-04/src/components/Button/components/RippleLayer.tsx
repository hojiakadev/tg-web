import type { CSSProperties } from 'react';

import classes from '../Button.module.scss';

export type Ripple = {
  id: number;
  x: number;
  y: number;
  size: number;
};

type IProps = {
  ripples: Ripple[];
  onRippleEnd: (id: number) => void;
};

const RippleLayer = ({ ripples, onRippleEnd }: IProps) => (
  <span className={classes.rippleLayer} aria-hidden="true">
    {ripples.map((ripple) => (
      <span
        key={ripple.id}
        className={classes.ripple}
        style={
          {
            '--ripple-x': `${ripple.x}px`,
            '--ripple-y': `${ripple.y}px`,
            '--ripple-size': `${ripple.size}px`,
          } as CSSProperties
        }
        onAnimationEnd={() => onRippleEnd(ripple.id)}
      />
    ))}
  </span>
);

export default RippleLayer;
