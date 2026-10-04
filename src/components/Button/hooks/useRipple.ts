import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';

import type { Ripple } from '../components/RippleLayer';

const RIPPLE_CLEANUP_MS = 700;

const getRippleSize = (x: number, y: number, width: number, height: number) =>
  2 *
  Math.max(
    Math.hypot(x, y),
    Math.hypot(width - x, y),
    Math.hypot(x, height - y),
    Math.hypot(width - x, height - y),
  );

export const useRipple = (disabled: boolean, loading: boolean) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextRippleId = useRef(0);
  const cleanupTimers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const removeRipple = useCallback((id: number) => {
    const timer = cleanupTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      cleanupTimers.current.delete(id);
    }

    setRipples((current) => current.filter((ripple) => ripple.id !== id));
  }, []);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      if (disabled || loading) {
        return;
      }

      const { left, top, width, height } =
        event.currentTarget.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;
      const id = nextRippleId.current++;

      setRipples((current) => [
        ...current,
        { id, x, y, size: getRippleSize(x, y, width, height) },
      ]);
      cleanupTimers.current.set(
        id,
        setTimeout(() => removeRipple(id), RIPPLE_CLEANUP_MS),
      );
    },
    [disabled, loading, removeRipple],
  );

  useEffect(
    () => () => {
      cleanupTimers.current.forEach((timer) => clearTimeout(timer));
      cleanupTimers.current.clear();
    },
    [],
  );

  return { ripples, handlePointerDown, removeRipple };
};
