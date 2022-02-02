import { useRef, useEffect, useCallback } from 'react';

/**
 * @example
 * const Example: FC = () => {
 *   const handler = (e: MouseEvent) => console.log('button clicked!');
 *   const handleClick = useThrottle(handler, 300);
 *
 *   return (
 *     <button type="button" onClick={handleClick}>
 *       Throttled button
 *     </button>
 *   );
 * };
 *
 * @param fn 쓰로틀을 적용할 함수
 * @param delay 딜레이
 * @param dependencies 함수 디펜던시
 */
export function useThrottle<T = any>(
  fn: (args: T) => void,
  delay = 300,
  dependencies: any[] = []
) {
  const timerRef = useRef(0);
  const memoizedFn = useCallback(fn, dependencies);

  useEffect(() => () => clearTimeout(timerRef.current), [memoizedFn]);

  const callback = useCallback(
    (args: T) => {
      if (timerRef.current) {
        return;
      }

      timerRef.current = setTimeout(() => {
        timerRef.current = 0;
      }, delay) as unknown as number;

      memoizedFn(args);
    },
    [memoizedFn]
  );

  return callback;
}
