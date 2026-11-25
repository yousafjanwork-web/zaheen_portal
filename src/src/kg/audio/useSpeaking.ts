import { useSyncExternalStore } from 'react';
import { getSpeaking, subscribeSpeaking } from './voice';

/** True while a clip or browser voice is playing. */
export function useIsSpeaking(): boolean {
  return useSyncExternalStore(subscribeSpeaking, getSpeaking, () => false);
}
