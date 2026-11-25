import { useEffect, useRef, useState } from 'react';
import { useIsSpeaking } from './useSpeaking';

/**
 * Calls `fire` once, by itself, after `armed` becomes true.
 * It waits at least `minMs`, then waits until Miss Ayesha has finished speaking
 * (plus a short 0.7s pause), but never longer than `maxMs`.
 */
export function useAutoAdvance(armed: boolean, fire: () => void, minMs = 1800, maxMs = 8000) {
  const speaking = useIsSpeaking();
  const fireRef = useRef(fire);
  fireRef.current = fire;
  const fired = useRef(false);
  const [minPassed, setMinPassed] = useState(false);
  const [maxPassed, setMaxPassed] = useState(false);

  useEffect(() => {
    if (!armed) {
      setMinPassed(false);
      setMaxPassed(false);
      return undefined;
    }
    const t1 = window.setTimeout(() => setMinPassed(true), minMs);
    const t2 = window.setTimeout(() => setMaxPassed(true), maxMs);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [armed, minMs, maxMs]);

  useEffect(() => {
    if (!armed || fired.current) return undefined;
    const go = () => {
      if (fired.current) return;
      fired.current = true;
      fireRef.current();
    };
    if (maxPassed) {
      go();
      return undefined;
    }
    if (!minPassed || speaking) return undefined;
    const t = window.setTimeout(go, 700);
    return () => window.clearTimeout(t);
  }, [armed, minPassed, maxPassed, speaking]);
}