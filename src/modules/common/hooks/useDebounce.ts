import { useCallback, useEffect, useRef } from 'react';

/**
 * @example
 * const Example: FC = () => {
 *   const handler = (e: KeyboardEvent) => console.log(e.target.value);
 *   // 300 미리초가 지날 때 까지 추가적인 입력이 없으면 콘솔에 출력한다.
 *   const handleChange = useDebounce(handler, 300);
 *
 *   return (
 *     <input onChange={handleChange} />
 *   );
 * };
 * @param fn 디바운스가 적용되어야 할 함수
 * @param delay 디바운스 딜레이
 * @param dependencies 함수 생성 조건 디펜던시
 */
export function useDebounce<T = any>(
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
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        memoizedFn(args);
      }, delay) as unknown as number;
    },
    [memoizedFn]
  );

  return callback;
}
