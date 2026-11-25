import { useEffect, useRef, useState } from 'react';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
import { LanguageCode } from '../types';
import { playPopSound, playSuccessChime, speakText } from './sfx';

interface TracingCanvasProps {
  character: string;
  strokeHintEn?: string;
  strokeHintUr?: string;
  language: LanguageCode;
  onComplete: (accuracy: number) => void;
}

export function TracingCanvas({ character, strokeHintEn, strokeHintUr, language, onComplete }: TracingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const pointsCountRef = useRef(0);
  const [strokePoints, setStrokePoints] = useState(0);
  const [completed, setCompleted] = useState(false);
  const isUr = language === 'ur';

  const drawGuide = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    // Subtle ruled kindergarten guidelines
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(24, h * 0.22);
    ctx.lineTo(w - 24, h * 0.22);
    ctx.moveTo(24, h * 0.5);
    ctx.lineTo(w - 24, h * 0.5);
    ctx.moveTo(24, h * 0.78);
    ctx.lineTo(w - 24, h * 0.78);
    ctx.stroke();
    ctx.setLineDash([]);

    // Large dotted guide character
    ctx.save();
    ctx.font = `800 ${Math.round(h * 0.62)}px "Outfit", "Noto Nastaliq Urdu", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#E2E8F0';
    ctx.fillText(character, w / 2, h / 2 + 6);
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.strokeText(character, w / 2, h / 2 + 6);
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawGuide(ctx, canvas.width, canvas.height);
    pointsCountRef.current = 0;
    setStrokePoints(0);
    setCompleted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character]);

  const getCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#57BCEB';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    playPopSound();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    pointsCountRef.current += 1;
    setStrokePoints(pointsCountRef.current);
  };

  const handlePointerUp = () => {
    drawingRef.current = false;
  };

  const handleReset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawGuide(ctx, canvas.width, canvas.height);
    pointsCountRef.current = 0;
    setStrokePoints(0);
    setCompleted(false);
  };

  const handleFinishTracing = () => {
    if (strokePoints < 12) {
      speakText(
        isUr ? 'پہلے نقطوں کے اوپر اپنی انگلی سے لکیر بنائیں!' : 'Trace along the dotted lines first!',
        isUr ? 'ur' : 'en'
      );
      return;
    }
    const accuracy = Math.min(98, Math.max(78, 70 + Math.round(strokePoints / 3)));
    setCompleted(true);
    playSuccessChime();
    onComplete(accuracy);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className={`text-sm font-semibold text-slate-600 ${isUr ? 'zkg-ur' : ''}`}>
          {isUr ? strokeHintUr || strokeHintEn : strokeHintEn || strokeHintUr}
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm min-h-[40px] cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isUr ? 'صاف کریں' : 'Clear'}</span>
        </button>
      </div>

      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={420}
          height={280}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="w-full max-w-[420px] aspect-[3/2] rounded-2xl border-2 border-dashed border-[#57BCEB] touch-none cursor-crosshair bg-white"
        />
      </div>

      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={handleFinishTracing}
          disabled={completed}
          className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-base transition-transform active:scale-95 min-h-[52px] cursor-pointer ${
            completed
              ? 'bg-[#60C994] text-slate-950'
              : 'bg-[#FFD45C] hover:bg-[#F5C642] text-slate-950 shadow-sm'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>
            {completed
              ? isUr
                ? 'شاباش! مکمل ہو گیا'
                : 'Wonderful Tracing!'
              : isUr
                ? 'میں نے لکھ لیا!'
                : 'I Finished Tracing!'}
          </span>
        </button>
      </div>
    </div>
  );
}
