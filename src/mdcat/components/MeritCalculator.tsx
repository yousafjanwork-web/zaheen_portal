import { useState } from "react";
import { Calculator, GraduationCap, BookOpen, Award } from "lucide-react";

interface MeritCalculatorProps {
  mdcatMax?: number;
  fscMax?: number;
  matricMax?: number;
  mdcatWeight?: number;
  fscWeight?: number;
  matricWeight?: number;
}

// Reuses colors straight from ProgressBar's SUBJECT_THEME (emerald/orange/violet)
const FIELD_THEME = {
  mdcat: { iconBg: "bg-emerald-500", ring: "#10b981", track: "#d1fae5", focus: "focus-within:border-emerald-400" },
  fsc: { iconBg: "bg-orange-500", ring: "#f97316", track: "#ffedd5", focus: "focus-within:border-orange-400" },
  matric: { iconBg: "bg-violet-500", ring: "#8b5cf6", track: "#ede9fe", focus: "focus-within:border-violet-400" },
};

const MeritCalculator = ({
  mdcatMax = 180,
  fscMax = 1100,
  matricMax = 1100,
  mdcatWeight = 0.5,
  fscWeight = 0.4,
  matricWeight = 0.1,
}: MeritCalculatorProps) => {
  const [mdcat, setMdcat] = useState("");
  const [fsc, setFsc] = useState("");
  const [matric, setMatric] = useState("");
  const [result, setResult] = useState<{
    total: number; mdcatPct: number; fscPct: number; matricPct: number;
  } | null>(null);

  const calculate = () => {
    const m = parseFloat(mdcat) || 0;
    const f = parseFloat(fsc) || 0;
    const t = parseFloat(matric) || 0;
    const mdcatPct = (m / mdcatMax) * mdcatWeight * 100;
    const fscPct = (f / fscMax) * fscWeight * 100;
    const matricPct = (t / matricMax) * matricWeight * 100;
    setResult({ total: mdcatPct + fscPct + matricPct, mdcatPct, fscPct, matricPct });
  };

  const circumference = 2 * Math.PI * 54;
  const filled = result ? Math.min(result.total, 100) / 100 : 0;

  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl card-shadow p-4 sm:p-6 space-y-5 border border-sky-100">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-sky-500">
            Aggregate
          </span>
          <h3 className="text-lg sm:text-xl font-black uppercase text-sky-950">
            Merit Calculator
          </h3>
        </div>
        <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center shrink-0">
          <Calculator className="w-4 h-4 text-sky-600" strokeWidth={2.5} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 items-center">
        <div className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-sky-950 mb-1.5 block">
              MDCAT Score <span className="text-slate-400 font-medium">(out of {mdcatMax})</span>
            </label>
            <div className={`flex items-center gap-2 bg-sky-50/60 border border-sky-100 rounded-xl px-3 py-2.5 ${FIELD_THEME.mdcat.focus} focus-within:bg-white transition-colors`}>
              <div className={`w-6 h-6 rounded-full ${FIELD_THEME.mdcat.iconBg} flex items-center justify-center shrink-0`}>
                <GraduationCap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <input
                type="number"
                value={mdcat}
                onChange={(e) => setMdcat(e.target.value)}
                placeholder="e.g., 165"
                className="w-full bg-transparent text-sm font-bold text-sky-950 placeholder:text-slate-300 placeholder:font-medium outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-sky-950 mb-1.5 block">
              FSc Marks <span className="text-slate-400 font-medium">(out of {fscMax})</span>
            </label>
            <div className={`flex items-center gap-2 bg-sky-50/60 border border-sky-100 rounded-xl px-3 py-2.5 ${FIELD_THEME.fsc.focus} focus-within:bg-white transition-colors`}>
              <div className={`w-6 h-6 rounded-full ${FIELD_THEME.fsc.iconBg} flex items-center justify-center shrink-0`}>
                <BookOpen className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <input
                type="number"
                value={fsc}
                onChange={(e) => setFsc(e.target.value)}
                placeholder="e.g., 1050"
                className="w-full bg-transparent text-sm font-bold text-sky-950 placeholder:text-slate-300 placeholder:font-medium outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-sky-950 mb-1.5 block">
              Matric Marks <span className="text-slate-400 font-medium">(out of {matricMax})</span>
            </label>
            <div className={`flex items-center gap-2 bg-sky-50/60 border border-sky-100 rounded-xl px-3 py-2.5 ${FIELD_THEME.matric.focus} focus-within:bg-white transition-colors`}>
              <div className={`w-6 h-6 rounded-full ${FIELD_THEME.matric.iconBg} flex items-center justify-center shrink-0`}>
                <Award className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <input
                type="number"
                value={matric}
                onChange={(e) => setMatric(e.target.value)}
                placeholder="e.g., 1020"
                className="w-full bg-transparent text-sm font-bold text-sky-950 placeholder:text-slate-300 placeholder:font-medium outline-none"
              />
            </div>
          </div>

          <button
            onClick={calculate}
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-black uppercase text-xs tracking-widest rounded-xl shadow-md shadow-sky-600/25 hover:shadow-lg hover:shadow-sky-600/30 transition-all duration-300"
          >
            Calculate Aggregate
          </button>
        </div>

        <div className="flex flex-col items-center gap-5">
          {/* Ring is now a 3-segment stacked arc — one color per input, not flat blue */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#f1f5f9" strokeWidth="10" />
              {result && (
                <>
                  <circle
                    cx="60" cy="60" r="54" fill="none" stroke={FIELD_THEME.mdcat.ring} strokeWidth="10"
                    strokeDasharray={`${(result.mdcatPct / 100) * circumference} ${circumference}`}
                    strokeDashoffset={0}
                    className="transition-all duration-700 ease-out"
                  />
                  <circle
                    cx="60" cy="60" r="54" fill="none" stroke={FIELD_THEME.fsc.ring} strokeWidth="10"
                    strokeDasharray={`${(result.fscPct / 100) * circumference} ${circumference}`}
                    strokeDashoffset={-(result.mdcatPct / 100) * circumference}
                    className="transition-all duration-700 ease-out"
                  />
                  <circle
                    cx="60" cy="60" r="54" fill="none" stroke={FIELD_THEME.matric.ring} strokeWidth="10"
                    strokeDasharray={`${(result.matricPct / 100) * circumference} ${circumference}`}
                    strokeDashoffset={-((result.mdcatPct + result.fscPct) / 100) * circumference}
                    className="transition-all duration-700 ease-out"
                  />
                </>
              )}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl sm:text-3xl font-black text-sky-950">
                {result ? result.total.toFixed(1) : "0.0"}%
              </span>
            </div>
          </div>

          <div className="w-full space-y-2">
            {[
              { label: "MDCAT", weight: mdcatWeight, value: result?.mdcatPct, color: FIELD_THEME.mdcat.ring },
              { label: "FSc", weight: fscWeight, value: result?.fscPct, color: FIELD_THEME.fsc.ring },
              { label: "Matric", weight: matricWeight, value: result?.matricPct, color: FIELD_THEME.matric.ring },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-xs border-b border-sky-50 pb-2 last:border-0">
                <span className="flex items-center gap-1.5 font-semibold text-slate-500">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                  {row.label} ({(row.weight * 100).toFixed(0)}%)
                </span>
                <span className="font-black text-sky-950">{(row.value ?? 0).toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeritCalculator;