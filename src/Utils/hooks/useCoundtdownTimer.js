import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export const useCountdownTimer = (initialTimer) => {
  const [until, setUntil] = useState(Date.now() + initialTimer * 1000);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const intervalHandleRef = useRef(null);

  const interval = Math.floor(Math.max(until - currentTime, 0) / 1000);

  const clearTimerInterval = () => {
    if (intervalHandleRef.current) {
      clearInterval(intervalHandleRef.current);
      intervalHandleRef.current = null;
    }
  };

  const initTimerInterval = () => {
    if (intervalHandleRef.current) {
      return;
    }

    intervalHandleRef.current = setTimeout(() => {
      setCurrentTime(Date.now());
    }, 1000);
  };

  useFocusEffect(
    useCallback(() => {
      if (currentTime > until) {
        return;
      }

      initTimerInterval();
      return () => clearTimerInterval();
    }, [currentTime, until])
  );

  return [
    interval,
    (time) => {
      const now = Date.now();
      setCurrentTime(now);
      setUntil(now + time * 1000);
    },
  ];
};
