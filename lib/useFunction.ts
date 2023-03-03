import { useRef, useCallback } from 'react';

/** A callback hook (like `useCallback`) but with no need to specify the callback's dependencies or change the identity of the function it returns when the dependencies change. */
const useFunction = <Callback extends (...args: any[]) => any>(
	callback: Callback
): Callback => {
	const callbackRef = useRef(callback);
	callbackRef.current = callback;

	return useCallback((
		(...args: Parameters<Callback>) => callbackRef.current(...args)
	) as Callback, []);
};

export default useFunction;
