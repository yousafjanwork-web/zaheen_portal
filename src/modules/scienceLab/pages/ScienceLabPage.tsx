import { useMemo, useRef, useState } from "react";
import {
  Atom,
  Beaker,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  FlaskConical,
  FlaskRound,
  GraduationCap,
  Lightbulb,
  Microscope,
  MousePointer2,
  RotateCcw,
  Scissors,
  Sparkles,
  TestTube2,
  Zap,
} from "lucide-react";

type LabKey = "chemistry" | "physics" | "biology" | "computer";
type ElementSymbol = "H" | "O" | "C" | "N";

type LabAtom = {
  id: number;
  element: ElementSymbol;
  x: number;
  y: number;
  selected: boolean;
};

type Bond = {
  a: number;
  b: number;
  order: 1 | 2 | 3;
};

const ELEMENTS: Record<ElementSymbol, { name: string; protons: number; valence: number }> = {
  H: { name: "Hydrogen", protons: 1, valence: 1 },
  O: { name: "Oxygen", protons: 8, valence: 2 },
  C: { name: "Carbon", protons: 6, valence: 4 },
  N: { name: "Nitrogen", protons: 7, valence: 3 },
};

const LABS: Array<{
  id: LabKey;
  title: string;
  subtitle: string;
  icon: typeof FlaskConical;
  available: boolean;
}> = [
  { id: "chemistry", title: "Chemistry Lab", subtitle: "Atoms, molecules & reactions", icon: FlaskConical, available: true },
  { id: "physics", title: "Physics Lab", subtitle: "Force, motion & electricity", icon: Zap, available: false },
  { id: "biology", title: "Biology Lab", subtitle: "Cells, body & life", icon: Microscope, available: false },
  { id: "computer", title: "Computer Lab", subtitle: "Logic, algorithms & code", icon: Atom, available: false },
];

const STARTER_ATOMS: LabAtom[] = [
  { id: 1, element: "H", x: 230, y: 225, selected: false },
  { id: 2, element: "H", x: 530, y: 225, selected: false },
];

function atomColor(element: ElementSymbol) {
  if (element === "H") return "#2563eb";
  if (element === "O") return "#dc2626";
  if (element === "C") return "#374151";
  return "#7c3aed";
}

function formula(atoms: LabAtom[]) {
  const counts = atoms.reduce<Record<string, number>>((acc, atom) => {
    acc[atom.element] = (acc[atom.element] || 0) + 1;
    return acc;
  }, {});
  return ["C", "H", "N", "O"].filter((key) => counts[key]).map((key) => `${key}${counts[key] > 1 ? counts[key] : ""}`).join("") || "—";
}

const ScienceLabPage = () => {
  const [activeLab, setActiveLab] = useState<LabKey>("chemistry");
  const [atoms, setAtoms] = useState<LabAtom[]>(STARTER_ATOMS);
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [message, setMessage] = useState("Select two atoms to create a covalent bond.");
  const [showGuide, setShowGuide] = useState(true);
  const [dragging, setDragging] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const selectedAtoms = useMemo(() => atoms.filter((atom) => atom.selected), [atoms]);
  const moleculeFormula = useMemo(() => formula(atoms), [atoms]);

  const resetLab = () => {
    setAtoms(STARTER_ATOMS.map((atom) => ({ ...atom })));
    setBonds([]);
    setMessage("Lab reset. Select two atoms to create a covalent bond.");
    setShowGuide(true);
  };

  const getSvgPoint = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: ((event.clientX - rect.left) / rect.width) * 760,
      y: ((event.clientY - rect.top) / rect.height) * 500,
    };
  };

  const toggleAtom = (id: number) => {
    setAtoms((current) => current.map((atom) => (atom.id === id ? { ...atom, selected: !atom.selected } : atom)));
    setMessage("Atom selected. Select another atom or drag this atom around the lab.");
  };

  const addAtom = (element: ElementSymbol) => {
    const id = Math.max(0, ...atoms.map((atom) => atom.id)) + 1;
    const positions = [
      { x: 380, y: 140 },
      { x: 380, y: 360 },
      { x: 150, y: 360 },
      { x: 610, y: 360 },
    ];
    const position = positions[(id - 1) % positions.length];
    setAtoms((current) => [...current, { id, element, x: position.x, y: position.y, selected: false }]);
    setMessage(`${ELEMENTS[element].name} added to the lab.`);
  };

  const makeBond = () => {
    if (selectedAtoms.length !== 2) {
      setMessage("Select exactly two atoms first.");
      return;
    }

    const [a, b] = selectedAtoms;
    const exists = bonds.some((bond) => (bond.a === a.id && bond.b === b.id) || (bond.a === b.id && bond.b === a.id));
    if (exists) {
      setMessage("These atoms are already bonded.");
      return;
    }

    const supported = (a.element === "H" && ["H", "O", "N", "C"].includes(b.element)) ||
      (b.element === "H" && ["H", "O", "N", "C"].includes(a.element));

    if (!supported) {
      setMessage("This MVP supports common hydrogen covalent bonds. More chemistry rules are coming next.");
      return;
    }

    setBonds((current) => [...current, { a: a.id, b: b.id, order: 1 }]);
    setAtoms((current) => current.map((atom) => ({ ...atom, selected: false })));
    setMessage(`Covalent bond created: ${a.element}–${b.element}. The shared electrons help fill the atoms' outer shells.`);
  };

  const breakBond = () => {
    if (selectedAtoms.length !== 2) {
      setMessage("Select the two bonded atoms you want to separate.");
      return;
    }
    const [a, b] = selectedAtoms;
    const next = bonds.filter((bond) => !((bond.a === a.id && bond.b === b.id) || (bond.a === b.id && bond.b === a.id)));
    if (next.length === bonds.length) {
      setMessage("No bond exists between the selected atoms.");
      return;
    }
    setBonds(next);
    setAtoms((current) => current.map((atom) => ({ ...atom, selected: false })));
    setMessage("Bond broken. Try creating a different molecule.");
  };

  const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>, id: number) => {
    event.stopPropagation();
    setDragging(id);
    (event.currentTarget as SVGSVGElement).setPointerCapture?.(event.pointerId);
    toggleAtom(id);
  };

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (dragging === null) return;
    const point = getSvgPoint(event);
    setAtoms((current) => current.map((atom) => atom.id === dragging
      ? { ...atom, x: Math.max(70, Math.min(690, point.x)), y: Math.max(80, Math.min(420, point.y)) }
      : atom));
  };

  const handlePointerUp = () => setDragging(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <section className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 py-10 text-white sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm">
                <Sparkles className="h-4 w-4" /> Zaheen Interactive Learning
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Zaheen Science Lab</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Don&apos;t just watch science. Experiment with it. Touch, drag, build and discover.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <GraduationCap className="h-6 w-6" />
              <div>
                <div className="text-sm text-slate-300">Learning mode</div>
                <div className="font-semibold">Explore & Experiment</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-10">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LABS.map((lab) => {
            const Icon = lab.icon;
            const active = activeLab === lab.id;
            return (
              <button
                key={lab.id}
                type="button"
                disabled={!lab.available}
                onClick={() => lab.available && setActiveLab(lab.id)}
                className={`group rounded-2xl border p-4 text-left transition ${active
                  ? "border-indigo-500 bg-indigo-50 shadow-sm dark:border-indigo-400 dark:bg-indigo-950/50"
                  : "border-slate-200 bg-white hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900"} ${!lab.available ? "cursor-not-allowed opacity-55" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${active ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  {!lab.available ? <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500 dark:bg-slate-800">Coming soon</span> : null}
                </div>
                <div className="mt-4 font-semibold">{lab.title}</div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{lab.subtitle}</div>
              </button>
            );
          })}
        </div>

        {activeLab === "chemistry" ? (
          <section className="mt-7 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-7">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400"><FlaskConical className="h-4 w-4" /> Chemistry Lab</div>
                  <h2 className="mt-1 text-2xl font-bold">Build a Molecule</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Drag atoms, select them and create bonds. Designed for mouse, touch and interactive boards.</p>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Current molecule</div>
                  <div className="text-xl font-bold">{moleculeFormula}</div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_300px]">
              <div className="p-4 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium dark:bg-slate-800">Step 1 · Select atoms</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium dark:bg-slate-800">Step 2 · Make bond</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium dark:bg-slate-800">Step 3 · Observe</span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">
                  <svg
                    ref={svgRef}
                    viewBox="0 0 760 500"
                    className="h-auto w-full touch-none select-none"
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    aria-label="Interactive chemistry molecule builder"
                  >
                    <defs>
                      <radialGradient id="atomGlow" cx="35%" cy="30%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.95" />
                        <stop offset="28%" stopColor="currentColor" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.72" />
                      </radialGradient>
                    </defs>
                    <rect x="0" y="0" width="760" height="500" fill="transparent" />

                    {bonds.map((bond, index) => {
                      const a = atoms.find((atom) => atom.id === bond.a);
                      const b = atoms.find((atom) => atom.id === bond.b);
                      if (!a || !b) return null;
                      const dx = b.x - a.x;
                      const dy = b.y - a.y;
                      const length = Math.max(1, Math.hypot(dx, dy));
                      const nx = -dy / length;
                      const ny = dx / length;
                      return (
                        <g key={`${bond.a}-${bond.b}-${index}`}>
                          {[0].map(() => (
                            <line key="bond" x1={a.x + nx * 7} y1={a.y + ny * 7} x2={b.x + nx * 7} y2={b.y + ny * 7} stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-indigo-500" />
                          ))}
                          {bond.order > 1 ? <line x1={a.x - nx * 7} y1={a.y - ny * 7} x2={b.x - nx * 7} y2={b.y - ny * 7} stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-indigo-500" /> : null}
                        </g>
                      );
                    })}

                    {atoms.map((atom) => {
                      const color = atomColor(atom.element);
                      const selected = atom.selected;
                      const element = ELEMENTS[atom.element];
                      return (
                        <g
                          key={atom.id}
                          onPointerDown={(event) => handlePointerDown(event, atom.id)}
                          style={{ cursor: dragging === atom.id ? "grabbing" : "grab", color }}
                        >
                          <circle cx={atom.x} cy={atom.y} r="76" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.18" />
                          <circle cx={atom.x} cy={atom.y} r="50" fill="url(#atomGlow)" className={selected ? "stroke-indigo-500" : "stroke-transparent"} strokeWidth={selected ? 6 : 0} />
                          <circle cx={atom.x} cy={atom.y} r="5" fill="white" opacity="0.8" />
                          <text x={atom.x} y={atom.y + 12} textAnchor="middle" fontSize="32" fontWeight="700" fill="white">{atom.element}</text>
                          <text x={atom.x} y={atom.y + 97} textAnchor="middle" fontSize="14" fill="currentColor" opacity="0.85">{element.name}</text>
                          <circle cx={atom.x + 76} cy={atom.y} r="9" fill="currentColor" />
                        </g>
                      );
                    })}

                    {bonds.length === 0 ? (
                      <g pointerEvents="none">
                        <rect x="210" y="38" width="340" height="44" rx="22" fill="currentColor" className="text-white dark:text-slate-900" opacity="0.92" />
                        <text x="380" y="66" textAnchor="middle" fontSize="15" fontWeight="600" fill="currentColor" className="text-slate-700 dark:text-slate-300">Select two atoms to create a bond</text>
                      </g>
                    ) : null}
                  </svg>
                </div>

                <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/30">
                  <div className="flex gap-3">
                    <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <div className="font-semibold">Lab feedback</div>
                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{message}</p>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="border-t border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-950/50 lg:border-l lg:border-t-0">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Lab controls</div>
                  <button type="button" onClick={resetLab} className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white" aria-label="Reset lab"><RotateCcw className="h-4 w-4" /></button>
                </div>

                <div className="mt-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Add atom</div>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {(Object.keys(ELEMENTS) as ElementSymbol[]).map((element) => (
                      <button key={element} type="button" onClick={() => addAtom(element)} className="rounded-xl border border-slate-200 bg-white px-2 py-3 text-center hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-900">
                        <span className="text-lg font-bold" style={{ color: atomColor(element) }}>{element}</span>
                        <span className="mt-1 block text-[10px] text-slate-500">{ELEMENTS[element].name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <button type="button" onClick={makeBond} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"><CheckCircle2 className="h-4 w-4" /> Make Covalent Bond</button>
                  <button type="button" onClick={breakBond} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><Scissors className="h-4 w-4" /> Break Bond</button>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-2 text-sm font-semibold"><MousePointer2 className="h-4 w-4" /> How to interact</div>
                  <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    <li>• Tap/click an atom to select it.</li>
                    <li>• Drag an atom anywhere in the lab.</li>
                    <li>• Select two atoms and make a bond.</li>
                    <li>• Use the same controls on a touchscreen.</li>
                  </ul>
                </div>

                <button type="button" onClick={() => setShowGuide((value) => !value)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium dark:border-slate-700"><CircleHelp className="h-4 w-4" /> {showGuide ? "Hide learning guide" : "Show learning guide"}</button>
                {showGuide ? (
                  <div className="mt-3 rounded-2xl bg-white p-4 text-sm dark:bg-slate-900">
                    <div className="font-semibold">Today&apos;s challenge</div>
                    <p className="mt-2 leading-6 text-slate-500 dark:text-slate-400">Start with two hydrogen atoms. Select both and create H₂. Next we will add oxygen and let students build H₂O.</p>
                  </div>
                ) : null}
              </aside>
            </div>

            <div className="grid gap-3 border-t border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60 sm:grid-cols-3 sm:p-6">
              <div className="flex items-center gap-3 rounded-2xl bg-white p-4 dark:bg-slate-900"><BookOpen className="h-5 w-5 text-indigo-600" /><div><div className="text-xs text-slate-500">Concept</div><div className="font-semibold">Covalent bonding</div></div></div>
              <div className="flex items-center gap-3 rounded-2xl bg-white p-4 dark:bg-slate-900"><TestTube2 className="h-5 w-5 text-indigo-600" /><div><div className="text-xs text-slate-500">Atoms in lab</div><div className="font-semibold">{atoms.length}</div></div></div>
              <div className="flex items-center gap-3 rounded-2xl bg-white p-4 dark:bg-slate-900"><Beaker className="h-5 w-5 text-indigo-600" /><div><div className="text-xs text-slate-500">Bonds created</div><div className="font-semibold">{bonds.length}</div></div></div>
            </div>
          </section>
        ) : (
          <div className="mt-7 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
            <Atom className="mx-auto h-10 w-10 text-indigo-500" />
            <h2 className="mt-4 text-2xl font-bold">{LABS.find((lab) => lab.id === activeLab)?.title}</h2>
            <p className="mx-auto mt-2 max-w-xl text-slate-500 dark:text-slate-400">This lab is planned for the next phase. We are building the chemistry interaction engine first so the same lesson architecture can power all four labs.</p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3"><FlaskRound className="h-5 w-5 text-indigo-600" /><div><div className="font-semibold">Science Lab roadmap</div><div className="text-sm text-slate-500">Chemistry → Physics → Biology → Computer Science</div></div></div>
          <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">MVP · Interactive Chemistry</div>
        </div>
      </main>
    </div>
  );
};

export default ScienceLabPage;
