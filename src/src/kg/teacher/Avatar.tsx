import { useEffect, useRef } from 'react';
import { getMouthLevel } from '../audio/voice';
import { useIsSpeaking } from '../audio/useSpeaking';
import { KG_TEACHER_IMAGE } from '../config';
import { AVATAR_H, AVATAR_W, BLINK_SPRITE, MOUTH_SPRITES, Sprite } from './avatarSprites';

function place(s: Sprite): React.CSSProperties {
  return {
    left: `${(s.x / AVATAR_W) * 100}%`,
    top: `${(s.y / AVATAR_H) * 100}%`,
    width: `${(s.w / AVATAR_W) * 100}%`,
    height: `${(s.h / AVATAR_H) * 100}%`,
  };
}

/** Miss Ayesha: natural blinking all the time + mouth that follows the voice. */
export function Avatar() {
  const ref = useRef<HTMLDivElement>(null);
  const speaking = useIsSpeaking();

  // Blinking: random gap of 2.2s - 6s, sometimes a double blink.
  useEffect(() => {
    const el = ref.current;
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(() => blink(Math.random() < 0.18), 2200 + Math.random() * 3800);
    };
    const blink = (double: boolean) => {
      el?.classList.add('is-blink');
      timer = window.setTimeout(() => {
        el?.classList.remove('is-blink');
        if (double) timer = window.setTimeout(() => blink(false), 120);
        else schedule();
      }, 130);
    };
    schedule();
    return () => {
      window.clearTimeout(timer);
      el?.classList.remove('is-blink');
    };
  }, []);

  // Mouth: runs only while speaking. Fast attack + quick release = crisp lip movement.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!speaking) {
      el.dataset.v = '0';
      el.classList.remove('is-talking');
      return;
    }
    el.classList.add('is-talking');
    let raf = 0;
    let smooth = 0;
    let peak = 0.25;
    let cur = 0;
    const tick = () => {
      const raw = getMouthLevel();
      peak = Math.max(raw, peak * 0.996, 0.25); // auto-gain: quiet and loud voices both look lively
      const n = raw < 0.04 ? 0 : Math.min(1, raw / peak);
      smooth += (n - smooth) * (n > smooth ? 0.9 : 0.55);
      const v = smooth < 0.1 ? 0 : smooth < 0.28 ? 1 : smooth < 0.5 ? 2 : smooth < 0.74 ? 3 : 4;
      if (v !== cur) {
        cur = v;
        el.dataset.v = String(v);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.dataset.v = '0';
      el.classList.remove('is-talking');
    };
  }, [speaking]);

  return (
    <div className="zkg-avatar" ref={ref} data-v="0">
      <img
        className="zkg-dock-img"
        src={KG_TEACHER_IMAGE}
        alt="Miss Ayesha"
        width={AVATAR_W}
        height={AVATAR_H}
        draggable={false}
      />
      <img className="zkg-av-blink" src={BLINK_SPRITE.src} alt="" aria-hidden="true" draggable={false} style={place(BLINK_SPRITE)} />
      {MOUTH_SPRITES.map((s, i) => (
        <img key={i} className={`zkg-av-m zkg-av-m${i + 1}`} src={s.src} alt="" aria-hidden="true" draggable={false} style={place(s)} />
      ))}
    </div>
  );
}