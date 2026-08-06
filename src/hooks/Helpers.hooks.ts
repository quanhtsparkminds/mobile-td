import { useCallback, useEffect, useRef, useState } from "react";
import type { AppStateStatus } from "react-native";
import { useAppState } from "./AppState.hooks";

export const useBoolean = (initialValue: boolean = false) => {
  const [value, setValue] = useState(initialValue);

  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  const toggle = () => setValue((prev) => !prev);

  return { value, setTrue, setFalse, toggle };
};

export const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);

  return {
    count,
    increment: useCallback(() => setCount((c) => c + 1), []),
    decrement: useCallback(() => setCount((c) => c - 1), []),
    reset: useCallback(() => setCount(initialValue), [initialValue]),
    setValue: setCount,
  };
};

const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
};

type UseCountdownOptions = {
  initialValue: number;
  onFinish: () => void;
  autoRun?: boolean;
};

export const useCountdown = (
  options: UseCountdownOptions
): [
  number,
  { run: () => void; pause: () => void; reset: () => void; isRunning: boolean },
] => {
  const { initialValue, onFinish, autoRun = true } = options;

  const {
    count,
    decrement,
    reset: resetCounter,
    setValue,
  } = useCounter(initialValue);
  const {
    value: isRunning,
    setTrue: startCountdown,
    setFalse: stopCountdown,
  } = useBoolean(false);

  // Track background time
  const backgroundTimeRef = useRef<number | null>(null);
  const wasRunningRef = useRef<boolean>(false);

  // Handle app state changes
  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        // App going to background - save current time if countdown is running
        if (isRunning) {
          backgroundTimeRef.current = Date.now();
          wasRunningRef.current = true;
        }
      } else if (nextAppState === "active") {
        // App coming back to foreground
        if (wasRunningRef.current && backgroundTimeRef.current) {
          const timeInBackground = Date.now() - backgroundTimeRef.current;
          const secondsElapsed = Math.floor(timeInBackground / 1000);

          if (secondsElapsed > 0) {
            setValue((currentCount) => {
              const newCount = Math.max(0, currentCount - secondsElapsed);

              // If countdown finished while in background
              if (newCount === 0 && currentCount > 0) {
                stopCountdown();
                // Delay onFinish to avoid state update conflicts
                setTimeout(onFinish, 0);
              }

              return newCount;
            });
          }

          // Reset background tracking
          backgroundTimeRef.current = null;
          wasRunningRef.current = false;
        }
      }
    },
    [isRunning, setValue, stopCountdown, onFinish]
  );

  // Listen to app state changes
  useAppState(handleAppStateChange);

  const countdownCallback = useCallback(() => {
    if (count === 0) {
      stopCountdown();
      onFinish();
      return;
    }
    decrement();
  }, [count, decrement, stopCountdown, onFinish]);

  useInterval(countdownCallback, isRunning ? 1000 : null);

  const run = useCallback(() => {
    if (count === 0) {
      resetCounter();
    }
    startCountdown();
    wasRunningRef.current = true;
  }, [count, resetCounter, startCountdown]);

  const pause = useCallback(() => {
    stopCountdown();
    wasRunningRef.current = false;
    backgroundTimeRef.current = null;
  }, [stopCountdown]);

  const reset = useCallback(() => {
    stopCountdown();
    resetCounter();
    wasRunningRef.current = false;
    backgroundTimeRef.current = null;
  }, [stopCountdown, resetCounter]);

  useEffect(() => {
    if (autoRun) {
      run();
    }
  }, [autoRun]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      wasRunningRef.current = false;
      backgroundTimeRef.current = null;
    };
  }, []);

  return [count, { run, pause, reset, isRunning }];
};
