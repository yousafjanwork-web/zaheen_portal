/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Layers,
  HelpCircle,
  ChevronRight,
  CheckCircle,
  XCircle,
  Send,
  CornerDownRight,
  Stethoscope,
  Info,
  Zap,
  BookMarked,
  AlertTriangle,
  Flame,
  FileText,
  ArrowLeft,
  FlaskConical,
  Atom,
  Languages,
  Brain,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { MDCATSubject } from '../types';
import { mdcatAiApi } from '../config';

interface SampleQuestion {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

interface ChapterNotes {
  id: string;
  title: string;
  weight: string;
  shortDesc: string;
  sections?: {
    heading: string;
    bullets: string[];
  }[];
  detailedContent: string[];
  boardInsights: string;
  mnemonics: string[];
  samples: SampleQuestion[];
}

interface SubjectNotes {
  subject: MDCATSubject;
  chapters: ChapterNotes[];
}

const STUDY_DATA: SubjectNotes[] = [
  {
    subject: 'Biology',
    chapters: [
      {
        id: 'bio-ch1',
        title: 'Acellular Life (Viruses)',
        weight: '6-8% of Biology Marks (Highly Urgent)',
        shortDesc: 'Microscopic and structural biology of viruses, capsids, replication cycles, and medical pathology (HIV, Hepatitis, Bacteriophages).',
        sections: [
          {
            heading: 'Discovery & Microscopic Foundations',
            bullets: [
              '**Acellular definition**: Viruses correspond to non-cellular entities because they lack cytoplasmic membranes, ribosomes, and independent binary metabolic/fission pathways. They are **obligate intracellular parasites** that only replicate inside host metabolic machinery.',
              '**Chronology of Discovery**: **Louis Pasteur** associated rabies with a pathogen he could not grow in culture. **Charles Chamberland** developed porcelain filters (1884) which held bacteria back but allowed viruses to pass. **Dmitri Ivanowsky** (1892) proved tobacco mosaic sap remained contagious after filtration. **Martinus Beijerinck** coined "contagium vivum fluidum" (soluble living germ), and **Wendell Stanley** (1935) successfully crystallized Tobacco Mosaic Virus (TMV), proving its organic-chemical composition (Nucleoprotein).',
              '**Dimensions & Scale**: Range from 20 nm (Parvovirus/Picovaviruses) up to 250-350 nm (Poxviruses/Vaccinia). Approx 10 to 1000 times smaller than standard bacterial cells.'
            ]
          },
          {
            heading: 'Nucleocapsid Chemistry & Architectural Symmetry',
            bullets: [
              '**The Virion**: A fully intact, infectious virus particle located in extracellular environments.',
              '**Genome**: Consists of either central DNA or RNA (never both), which can be single-stranded (ss) or double-stranded (ds), linear or circular, segmented or non-segmented.',
              '**Capsid Structural Units**: Protein shell composed of repeating subunits called **capsomeres**. **Adenovirus** (causes respiratory tract infection) has an icosahedral capsid with exactly **252 capsomeres**. **Herpes simplex virus** has **162 capsomeres**.',
              '**Symmetry Categories**: **Icosahedral** (polyhedral with 20 faces, e.g., Polio, Adenovirus), **Helical** (rod-shaped capsomeres wrapped spirally around nucleic acid, e.g., TMV, Influenza), or **Complex** (having extra accessory tails or layers, e.g., T4 Bacteriophage).'
            ]
          },
          {
            heading: 'Life Cycle of Bacteriophage (Lytic vs. Lysogenic)',
            bullets: [
              '**Lytic Cycle (Virulent cycle)**: 1) **Adsorption**: Phage tail fibers attach weakly to lipopolysaccharide receptors of bacterium cell wall. 2) **Penetration**: Phage lysozyme enzymatically digests a microscopic hole, and the tail sheath contracts to inject viral DNA, leaving empty capsid outside ("ghost"). 3) **Synthesis & Assembly**: Host DNA is degraded; phage DNA codes for enzymes and capsid fibers. 4) **Lysis**: After ~20 minutes, 100-200 new phages burst out, rupturing host cell membrane.',
              '**Lysogenic Cycle (Temperate cycle)**: Viral DNA inserts directly into the host bacterial chromosome, forming a **prophage**. It replicates passively along with host cell division without causing visible damage. Certain environmental stressors (UV light, chemicals) cause the prophage to undergo **induction** (excising itself from chromosome) and enter the virulent lytic cycle.',
              '**Lysogenic Conversion**: The host bacterium can acquire new characteristics and toxins (e.g., Corynebacterium diphtheriae becomes pathogenic only when lysogenized by beta-phage).'
            ]
          },
          {
            heading: 'Retroviruses & Human Immunodeficiency Virus (HIV)',
            bullets: [
              '**Retrovirus Classification**: Spherical enveloped viruses (~100 nm) containing two identical single-stranded RNA genomes and **Reverse Transcriptase** enzyme.',
              '**Core Receptors & Host Entry**: Glycoprotein knuckles of HIV (**gp120** and core stem **gp41**) bind selectively to human helper T-lymphocytes (**CD4 receptors**) and secondary chemokine co-receptors (CCR5 or CXCR4).',
              '**Reverse Transcription Loop**: Inside target cytoplasm, Reverse Transcriptase transcribes viral RNA -> single stranded DNA -> double stranded viral DNA. Highly error-prone due to absence of proofreading function, driving massive antigenic mutations.',
              '**Integration & Provirus**: Viral **Integrase** inserts double-stranded viral DNA into host nuclear chromatin, creating a permanent **provirus**. It can remain latent or actively transcribe viral mRNAs using host RNA polymerase II.',
              '**Maturation & Cleaving**: Newly assembled immature virions bud out. Viral **Protease** cleaves polyproteins into functional units to make the virus fully infectious.'
            ]
          },
          {
            heading: 'Viral Hepatitis Spectrum',
            bullets: [
              '**Hepatitis A (HAV)**: Naked, single-stranded RNA virus. Transmitted via fecal-oral routes. Causes acute, non-chronic hepatitis.',
              '**Hepatitis B (HBV)**: Enveloped, double-stranded DNA virus. Transmitted via blood, contaminated needles, pregnancy, or sexual fluids. Frequently develops into chronic cirrhosis and active hepatocellular carcinoma.',
              '**Hepatitis C (HCV)**: Enveloped, single-stranded RNA virus. Predominantly blood-borne transmission. Highly prone to chronic carrier states ("silent killer").',
              '**Prions & Viroids contrasts**: **Viroids** are naked infectious circular ssRNA particles devoid of capsid protein, primarily infecting plants (e.g., potato spindle tuber). **Prions** are infectious, abnormally folded protein particles lacking any nucleic acid genomes, causing neurodegenerative scrapie in yeast/sheep and Creutzfeldt-Jakob disease in humans.'
            ]
          }
        ],
        detailedContent: [
          '**Acellular properties**: Virions lack any cytoplasm, metabolic enzymes, or ribosomes, making them chemically inactive outside host cell organisms.',
          '**Capsomere metrics**: Remember adenovirus contains 252 capsomeres; Herpesvirus contains 162 capsomeres.',
          '**Reverse transcriptase**: Synthesizes a complementary DNA (cDNA) strand directly from an RNA template, reversing standard central dogma.',
          '**Provirus vs. Prophage**: An integrated bacteriophage is called a prophage, whereas integrated eukaryotic viral DNA is known as a provirus.',
          '**Prions**: Resistant to temperature, UV radiation, and standard enzymatic proteases because of tightly packed beta-sheet conformations.'
        ],
        boardInsights: 'The Punjab textbook emphasizes the exact dimensions and shape details of Tobacco Mosaic Virus (TMV) and rabies. The Sindh textbook details the structural chemistry of gp120 and gp41 in HIV and classifies viruses into 7 classes using the Baltimore system. KPK textbooks heavily query lysogenic conversion and the differences between viroids and prions.',
        mnemonics: [
          '**"A-E is Fecal-Oral, B-C-D is Fluid-Infective"**: Hepatitis A and E are spread via contaminated food/water (fecal-oral), while B, C, and D are spread via blood and bodily fluids.'
        ],
        samples: [
          {
            id: 1101,
            questionText: 'Which enzyme is uniquely responsible for integrating the double-stranded DNA copy of HIV into the host cell chromosome?',
            optionA: 'Reverse Transcriptase',
            optionB: 'Integrase',
            optionC: 'Protease',
            optionD: 'RNA Polymerase II',
            correctOption: 'B',
            explanation: 'Integrase is the retroviral enzyme that clean-cuts host DNA and inserts the freshly reverse-transcribed viral double-stranded DNA into the host genome.'
          },
          {
            id: 1102,
            questionText: 'An adenovirus capsid exhibits icosahedral symmetry. How many individual structural capsomeres comprise this outer protein shell?',
            optionA: '162',
            optionB: '252',
            optionC: '120',
            optionD: '574',
            correctOption: 'B',
            explanation: 'Adenovirus has icosahedral capsid architecture comprising exactly 252 capsomeres. Herpesvirus possesses 162.'
          },
          {
            id: 1103,
            questionText: 'Which infectious agents are defined as consisting solely of a short strand of highly complementary circular single-stranded RNA without any protective capsid or protein envelope?',
            optionA: 'Prions',
            optionB: 'Viroids',
            optionC: 'Bacteriophages',
            optionD: 'Retroviruses',
            correctOption: 'B',
            explanation: 'Viroids are naked, infectious circular single-stranded RNA molecules that do not encode any proteins, while Prions are proteinaceous infectious agents devoid of nucleic acid.'
          }
        ]
      },
      {
        id: 'bio-ch2',
        title: 'Biological Molecules',
        weight: '6-8% of Biology Marks',
        shortDesc: 'Structure, classification, and biochemical reactions of Carbohydrates, Proteins, Lipids, and Nucleic acids.',
        sections: [
          {
            heading: 'Classifying Carbohydrates & Monosaccharide Mechanics',
            bullets: [
              '**Monosaccharides**: Simple sugars characterized by chemical formula (CH2O)n.',
              '**Disaccharide structures**: Maltose (Glucose + Glucose, α-1,4 linkage); Lactose (Glucose + Galactose, β-1,4 linkage); Sucrose (Glucose + Fructose, α-1,2 linkage).',
              '**Polysaccharide starch branches**: **Amylose** consists of unbranched chains connected purely via α-1,4-glycosidic bonds. **Amylopectin** contains highly branched chains featuring both α-1,4 and α-1,6 linkage branches.'
            ]
          },
          {
            heading: 'Proteins & Four-Tier Structural Hierarchy',
            bullets: [
              '**Primary Structure**: Linear sequence of amino acids joined via covalent peptide bonds.',
              '**Secondary Structure**: Polypeptide folding stabilized by **hydrogen bonding** between C=O and N-H groups.',
              '**Tertiary Structure**: Three-dimensional conformational folding stabilized by hydrophobic bonds, hydrogen bonds, ionic bridges, and covalent **disulfide bridges**.',
              '**Quaternary Structure**: Association of multiple polypeptide subunits (e.g., Hemoglobin carrying 4 subgroups).'
            ]
          }
        ],
        detailedContent: [
          '**Peptide Bond Formations**: Dehydration synthesis reaction occurring between the carboxyl (COOH) group of one amino acid and the amino (NH2) group of another.',
          '**Disulfide Bridges**: Strong covalent bonds formed between matching thiol (-SH) side-chains of cysteine amino acids.',
          '**DNA GC pair vs AT pair**: GC base pairs are bound by 3 hydrogen bonds, while AT base pairs share 2.'
        ],
        boardInsights: 'Punjab textbooks focus heavily on chemical tests (Benedicts test for reducing sugars, Iodine test turning starch deep blue). Federal textbooks contain detailed structural calculations for proteins.',
        mnemonics: [
          '**"L-A-M-B"** for Glycosidic Linkages: **L**actose is **B**eta-linked; **A**mylose and **M**altose are **A**lpha-linked.'
        ],
        samples: [
          {
            id: 1104,
            questionText: 'Which amino acid side chain interaction is categorized as a true covalent bond, highly critical for the tertiary stabilizing structure of proteins?',
            optionA: 'Hydrophobic interactions',
            optionB: 'Disulfide bridges',
            optionC: 'Hydrogen bonding',
            optionD: 'Ionic salt bridges',
            correctOption: 'B',
            explanation: 'Disulfide bridges are strong covalent bonds (-S-S-) formed between the sulfhydryl (-SH) side groups of two cysteine amino acids under oxidizing conditions.'
          }
        ]
      },
      {
        id: 'bio-ch3',
        title: 'Cell Structure and Function',
        weight: '6% of Biology Marks',
        shortDesc: 'Organelles properties, cell membrane models, cytoplasmic inclusions, and plant cell wall chemistry.',
        sections: [
          {
            heading: 'Fluid Mosaic Membrane Architecture',
            bullets: [
              '**Phospholipid Bilayer**: Provides the fundamental hydrophobic barrier.',
              '**Cholesterol Role**: Acts as a fluidity buffer at high and low temperatures.',
              '**Proteins**: Integral/Transmembrane proteins span the entire bilayer; Peripheral proteins are loosely bound to surfaces.'
            ]
          }
        ],
        detailedContent: [
          '**Ribosomal Subunits**: Eukaryotes possess 80S ribosomes (60S + 40S subunits); prokaryotes possess 70S ribosomes (50S + 30S subunits).',
          '**Proton ATPases**: Lysosomal membranes actively maintain an interior acidic pH (~4.5).',
          '**Centrioles**: Direct the formation of mitotic spindle fibers during eukaryotic chromosome segregation.'
        ],
        boardInsights: 'KMU (KPK) questions focus on plant cell walls showing middle lamella composition containing calcium and magnesium pectate.',
        mnemonics: [
          '**"No Membrane on the RC"**: **R**ibosomes and **C**entrioles possess **no** surrounding membrane envelope.'
        ],
        samples: [
          {
            id: 1105,
            questionText: 'Which cellular organelle is uniquely rich in hydrolytic enzymes (acid hydrolases) that require an acidic interior pH to degrade cellular waste?',
            optionA: 'Peroxisome',
            optionB: 'Lysosome',
            optionC: 'Golgi apparatus',
            optionD: 'Glyoxysome',
            correctOption: 'B',
            explanation: 'Lysosomes store active acid hydrolases that optimally digest biological waste at an internal acidic pH (~4.5).'
          }
        ]
      },
      {
        id: 'bio-ch4',
        title: 'Enzymes Kinetics & Action',
        weight: '5% of Biology Marks',
        shortDesc: 'Active sites, activation energy profiles, enzyme inhibitors, and environmental optima.',
        sections: [],
        detailedContent: [
          '**Catalytic Action**: Enzymes lower activation energy without altering the overall thermodynamic free energy change.',
          '**Competitive Inhibitors**: Bind directly to the active site; overcome by increasing substrate concentration.',
          '**Non-Competitive Inhibitors**: Bind to an allosteric site; cannot be overcome by adding more substrate.'
        ],
        boardInsights: 'Sindh textbooks detail enzyme classification categories (Oxidoreductases, Transferases, Hydrolases, Lyases, Isomerases, Ligases).',
        mnemonics: [
          '**"Competitive climbs Km, Vmax stays same"**: Competitive inhibitors raise Km, but do not affect maximum speed Vmax.'
        ],
        samples: [
          {
            id: 1106,
            questionText: 'Malonate acts as a competitive inhibitor against which key metabolic enzyme in the Krebs Cycle?',
            optionA: 'Fumarase',
            optionB: 'Succinate Dehydrogenase',
            optionC: 'Isocitrate Dehydrogenase',
            optionD: 'Malate Dehydrogenase',
            correctOption: 'B',
            explanation: 'Malonate structurally resembles succinate, competing directly for the active site of Succinate Dehydrogenase.'
          }
        ]
      },
      {
        id: 'bio-ch5',
        title: 'Bioenergetics (Photosynthesis & Respiration)',
        weight: '8% of Biology Marks (Crucial)',
        shortDesc: 'Light harvesting complexes, Calvin cycle, Glycolysis, Krebs reactions, and ATP yields.',
        sections: [],
        detailedContent: [
          '**Chlorophyll**: Contains a porphyrin ring with a central **Magnesium (Mg²⁺)** atom.',
          '**Calvin Cycle**: RuBP (5C) reacts with CO2 using Rubisco to generate 3-phosphoglycerate (3-PGA).',
          '**Glycolysis**: Converts 1 glucose (6C) into 2 pyruvates (3C), generating net 2 ATP and 2 NADH.',
          '**Krebs Cycle**: Each turn generates 3 NADH, 1 FADH2, and 1 GTP/ATP.'
        ],
        boardInsights: 'Federal/Sindh textbooks calculate energy yields precisely (1 NADH yields ~2.5 ATP). Punjab books still mention the older values (1 NADH = 3 ATP).',
        mnemonics: [
          '**"O-I-L R-I-G"**: **O**xidation **I**s **L**oss of electrons, **R**eduction **I**s **G**ain of electrons.'
        ],
        samples: [
          {
            id: 1107,
            questionText: 'What is the exact chemical structure located in the center of the porphyrin head of a green chlorophyll molecule?',
            optionA: 'Iron atom (Fe2+)',
            optionB: 'Magnesium atom (Mg2+)',
            optionC: 'Manganese atom (Mn2+)',
            optionD: 'Copper atom (Cu2+)',
            correctOption: 'B',
            explanation: 'Chlorophyll contains a central Magnesium (Mg²⁺) atom surrounded by a nitrogen-containing porphyrin head.'
          }
        ]
      }
    ]
  },
  {
    subject: 'Chemistry',
    chapters: [
      {
        id: 'chem-ch1',
        title: 'Chemical Equilibrium & Kinetics',
        weight: '8-10 MCQs in UHS/KMU standards',
        shortDesc: 'Reversible reactions, Le Chatelier\'s parameters, activation profiles, and rate laws.',
        sections: [],
        detailedContent: [
          '**Le Chatelier\'s Principle**: If a dynamic system is subjected to change in temperature, pressure, or concentration, the system shifts to counteract that stress.',
          '**Kc vs. Kp**: Kp = Kc(RT)^(Δn). Kc is affected ONLY by changes in temperature.',
          '**Activation Energy (Ea)**: The minimum energy barrier reactants must overcome to convert to products.'
        ],
        boardInsights: 'Federal chemistry books include complex mathematical questions on solubility product constant (Ksp) calculations. Punjab books require memorizing exact optimum values for Haber\'s ammonia process.',
        mnemonics: [
          '**"Kc stays stable"**: ONLY temperature can change the actual Kc value!'
        ],
        samples: [
          {
            id: 1006,
            questionText: 'For the exothermic synthesis of ammonia (N2 + 3H2 <=> 2NH3), which operations will maximize output yield?',
            optionA: 'Elevating temperature and lowering pressure',
            optionB: 'Lowering temperature and elevating pressure',
            optionC: 'Lowering both temperature and pressure',
            optionD: 'Adding inactive nitrogen gas at constant volume',
            correctOption: 'B',
            explanation: 'Since the reaction is exothermic, a lower temperature shifts it forward. Since Δn is negative, elevated pressure shifts it forward towards fewer gas moles.'
          }
        ]
      },
      {
        id: 'chem-ch2',
        title: 'Gas Laws & Ideal Behavior',
        weight: '6-8 MCQs in MDCAT syllabus',
        shortDesc: 'Ideal gas constant R configurations, Boyles/Charles rules, and real gas deviations.',
        sections: [],
        detailedContent: [
          '**Ideal Gas Equation**: PV = nRT. R = 8.314 J mol⁻¹ K⁻¹ in SI units.',
          '**Real Gas Deviations**: Real gases deviate from ideality under high pressure and low temperature.',
          '**Van der Waals Correction**: [P + a(n/v)²][V - nb] = nRT.'
        ],
        boardInsights: 'Sindh books typically include heavier calculation questions on Graham\'s Law of Diffusion.',
        mnemonics: [
          '**"PLIGHT"**: Gases behave **ideally** under **L**ow **P**ressure and **H**igh **T**emperature.'
        ],
        samples: [
          {
            id: 1007,
            questionText: 'What are the SI units and numeric representation of the Universal Gas Constant (R)?',
            optionA: '0.0821 dm3 atm mol-1 K-1',
            optionB: '8.314 J mol-1 K-1',
            optionC: '62.4 dm3 torr mol-1 K-1',
            optionD: '1.987 cal mol-1 K-1',
            correctOption: 'B',
            explanation: 'The standard SI value of R is derived using SI units: pressure in N/m², volume in m³, giving R = 8.314 Joules per mole per Kelvin.'
          }
        ]
      }
    ]
  },
  {
    subject: 'Physics',
    chapters: [
      {
        id: 'phys-ch1',
        title: 'Electrostatics & Coulomb\'s Law',
        weight: '8 MCQs (Hard Calculus / Analytical)',
        shortDesc: 'Force interactions, electric flux, Gauss\'s theorem, and capacitor energy formulas.',
        sections: [],
        detailedContent: [
          '**Coulomb\'s Law**: F = k (q1 q2) / r², where k ≈ 9 × 10⁹ N m² C⁻².',
          '**Electric Potential (V)**: The work done per unit charge. V = k q / r (scalar quantity, in Volts).',
          '**Gauss\'s Theorem**: Total electric flux through any closed Gaussian surface equals Q_enclosed / ε₀.',
          '**Capacitance Storage**: C = ε₀ A / d. Energy stored: E = 1/2 C V².'
        ],
        boardInsights: 'Questions regarding series vs. parallel capacitors are common.',
        mnemonics: [
          '**"Capacitors are Opposite to Resistors"**: Series capacitors sum up like parallel resistors!'
        ],
        samples: [
          {
            id: 1008,
            questionText: 'If a dielectric material of relative permittivity εr = 4 is introduced between two point charges, how will the Coulombic force change?',
            optionA: 'Increases by 4 times',
            optionB: 'Decreases by 4 times',
            optionC: 'Remains completely unaffected',
            optionD: 'Becomes zero',
            correctOption: 'B',
            explanation: 'Electrostatic force in a medium is F_med = F_vacuum / εr. Adding a dielectric medium with εr = 4 reduces the interactive force by a factor of 4.'
          }
        ]
      }
    ]
  },
  {
    subject: 'English',
    chapters: [
      {
        id: 'eng-ch1',
        title: 'Subject-Verb Concord & Modification Errors',
        weight: '4-6 MCQs in mandatory exams',
        shortDesc: 'Identifying grammatical concord, collective counts, and misplaced modifiers.',
        sections: [],
        detailedContent: [
          '**The Core Rule**: Singular subjects require singular verbs, plural subjects require plural verbs.',
          '**Intervening Modifiers**: The subject controls verb agreement, not the intervening noun.',
          '**Correlative Conjunctions**: With "either...or", verb must agree with the closer subject.',
          '**Collective Nouns**: Generally singular when acting as a unified body.'
        ],
        boardInsights: 'PMDC exams test sentences containing "as well as", "along with", "together with". The verb always agrees with the first subject.',
        mnemonics: [
          '**"Far vs. Near Concord"**: Words like *along with* match the **first/far** subject. Words like *neither/nor* match the **closer/near** subject.'
        ],
        samples: [
          {
            id: 1009,
            questionText: 'Identify the grammatically correct sentence conforming to standard MDCAT conventions:',
            optionA: 'The team of physicians, junto with the supervisor, are conducting research.',
            optionB: 'The team of physicians, junto with the supervisor, is conducting research.',
            optionC: 'The team of physicians, junto with the supervisor, were conducting research.',
            optionD: 'The team of physicians and supervisor is conducting research.',
            correctOption: 'B',
            explanation: 'The head subject "The team" is singular. Parenthetical additions do not alter the singular subject structure.'
          }
        ]
      }
    ]
  },
  {
    subject: 'Logical Reasoning',
    chapters: [
      {
        id: 'log-ch1',
        title: 'Critical Syllogisms & Step Sequences',
        weight: '7 MCQs (Crucial Rank Decider)',
        shortDesc: 'Truth statements, Venn relationships, logical paths, and deductive steps.',
        sections: [],
        detailedContent: [
          '**Syllogistic Rules**: Check truth value of conclusions based on given premises. Analyze statements literally.',
          '**Venn Representations**: "All doctors are smart" -> circle "doctors" placed fully inside circle "smart".',
          '**Negative Corollaries**: A negative premise requires a negative conclusion.'
        ],
        boardInsights: 'MDCAT logical reasoning questions focus on rapid visual/logical pattern recognition. Always draw scratch diagrams during the exam.',
        mnemonics: [
          '**"Premises Drive Truth"**: Do not assume truth of things not explicitly specified in the premises.'
        ],
        samples: [
          {
            id: 1010,
            questionText: 'Premises:\n1. All cardiologists are medical graduates.\n2. Some medical graduates are researchers.\n\nWhich conclusion is logically sound?',
            optionA: 'All cardiologists are researchers.',
            optionB: 'Some cardiologists are researchers.',
            optionC: 'No researcher is a medical graduate.',
            optionD: 'It is possible that some researchers are cardiologists.',
            correctOption: 'D',
            explanation: 'Since cardiologists are inside medical graduates, and some graduates are researchers, there is an open intersection possibility.'
          }
        ]
      }
    ]
  }
]

// ─── helpers ──────────────────────────────────────────────────────────────────

const SUBJECT_META: Record<MDCATSubject, { icon: React.ReactNode; gradient: string; accent: string; badge: string }> = {
  Biology: {
    icon: <Stethoscope className="w-7 h-7" />,
    gradient: 'from-emerald-500 to-teal-600',
    accent: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800',
  },
  Chemistry: {
    icon: <FlaskConical className="w-7 h-7" />,
    gradient: 'from-amber-500 to-orange-600',
    accent: 'text-amber-600 bg-amber-50 border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
  },
  Physics: {
    icon: <Atom className="w-7 h-7" />,
    gradient: 'from-violet-500 to-purple-600',
    accent: 'text-violet-600 bg-violet-50 border-violet-200',
    badge: 'bg-violet-100 text-violet-800',
  },
  English: {
    icon: <Languages className="w-7 h-7" />,
    gradient: 'from-sky-500 to-blue-600',
    accent: 'text-sky-600 bg-sky-50 border-sky-200',
    badge: 'bg-sky-100 text-sky-800',
  },
  'Logical Reasoning': {
    icon: <Brain className="w-7 h-7" />,
    gradient: 'from-rose-500 to-pink-600',
    accent: 'text-rose-600 bg-rose-50 border-rose-200',
    badge: 'bg-rose-100 text-rose-800',
  },
};

// ─── slug helpers — used to build clean URLs instead of raw subject names ─────
const SUBJECT_SLUGS: Record<MDCATSubject, string> = {
  Biology: 'biology',
  Chemistry: 'chemistry',
  Physics: 'physics',
  English: 'english',
  'Logical Reasoning': 'logical-reasoning',
};
const SLUG_TO_SUBJECT: Record<string, MDCATSubject> = Object.fromEntries(
  Object.entries(SUBJECT_SLUGS).map(([subject, slug]) => [slug, subject as MDCATSubject])
);

interface StudyNotesProps {
  onBack?: () => void;
  onSelectQuiz?: (id: number) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT — sets up nested routing for subjects → chapters → content.
// Mounted in App.tsx at path="/mdcat/study-notes/*"
// ═══════════════════════════════════════════════════════════════════════════
export default function StudyNotes({ onBack, onSelectQuiz }: StudyNotesProps) {
  useEffect(()=>
    {
      window.scrollTo(0,0)
    },[])
  return (
    <Routes>
      <Route index element={<SubjectsView onBack={onBack} />} />
      <Route path=":subjectSlug" element={<ChaptersView />} />
      <Route path=":subjectSlug/:chapterId" element={<ContentViewWrapper onSelectQuiz={onSelectQuiz} />} />
      <Route path="*" element={<Navigate to="/study-notes" replace />} />
    </Routes>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SUBJECT CARDS VIEW  →  /mdcat/study-notes
// ═══════════════════════════════════════════════════════════════════════════
function SubjectsView({ onBack }: { onBack?: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-hidden space-y-8 px-8">
      <div
        className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-sky-950 text-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-center items-center gap-2 flex-wrap mb-3">
            <span className="px-2.5 py-0.5 text-[9px] font-black uppercase text-amber-300 bg-amber-500/15 border border-amber-400/30 rounded-md tracking-wider">
              PMDC 100% Syllabus Coverage
            </span>
            <span className="px-2.5 py-0.5 text-[9px] font-black uppercase text-sky-200 bg-sky-500/15 border border-sky-400/30 rounded-md tracking-wider">
              5 Subjects Available
            </span>
          </div>

          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight flex items-center justify-center gap-2 text-center">
            MDCAT Interactive Study Vault
            <BookOpen className="w-7 h-7 text-sky-400" />
          </h2>

          <p className="mt-3 max-w-3xl mx-auto text-center text-sm text-sky-200/80 font-medium leading-relaxed">
            Select a subject below to begin. Each subject contains high-yield chapters mapped to the national syllabus with AI-powered study tools.
          </p>
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none text-[12rem]">
          🧬
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 m-4 sm:grid-cols-2 lg:grid-cols-3 gap-5 overflow-hidden mb-4">
        {STUDY_DATA.map((subj) => {
          const meta = SUBJECT_META[subj.subject];
          return (
            <motion.button
              key={subj.subject}
              onClick={() => navigate(`/mdcat/study-notes/${SUBJECT_SLUGS[subj.subject]}`)}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="text-left bg-white border m-2 border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col h-full"
            >
              <div className={`bg-gradient-to-r ${meta.gradient} p-6  h-32 text-white flex items-center justify-between shrink-0`}>
                <div className="space-y-1">
                  <div className="opacity-90">{meta.icon}</div>
                  <h3 className="text-lg font-black uppercase tracking-tight">{subj.subject}</h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black opacity-90">{subj.chapters.length}</div>
                  <div className="text-[10px] font-bold opacity-70 uppercase tracking-wider">Chapters</div>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {subj.chapters.slice(0, 3).map((ch) => (
                    <span key={ch.id} className={`px-2 py-0.5 rounded text-[9px] font-bold border ${meta.accent}`}>
                      {ch.title.length > 22 ? ch.title.slice(0, 22) + '…' : ch.title}
                    </span>
                  ))}
                  {subj.chapters.length > 3 && (
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${meta.accent}`}>
                      +{subj.chapters.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">View Chapters</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER CARDS VIEW  →  /mdcat/study-notes/:subjectSlug
// ═══════════════════════════════════════════════════════════════════════════
function ChaptersView() {
  const { subjectSlug } = useParams();
  const navigate = useNavigate();

  const activeSubject = subjectSlug ? SLUG_TO_SUBJECT[subjectSlug] : undefined;
  const subjectData = activeSubject ? STUDY_DATA.find(s => s.subject === activeSubject) : null;

  // bad/unknown slug in the URL -> bounce back to the subject grid instead of crashing
  if (!activeSubject || !subjectData) {
    return <Navigate to="/mdcat/study-notes" replace />;
  }

  const meta = SUBJECT_META[activeSubject];

  return (
    <div className="space-y-6 mx-9">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/mdcat/study-notes')}
          className="flex items-center gap-1.5 text-xs font-black uppercase text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> All Subjects
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-xs font-black uppercase text-slate-700">{activeSubject}</span>
      </div>

      <div className={`bg-gradient-to-r ${meta.gradient} p-6 md:p-8 rounded-3xl text-white`}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl">{meta.icon}</div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">{activeSubject}</h2>
            <p className="text-sm opacity-80 font-semibold">{subjectData.chapters.length} chapters · Select a chapter to study</p>
          </div>
        </div>
      </div>

      {/* Chapter Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-8 gap-8">
        {subjectData.chapters.map((ch, idx) => (
          <motion.button
            key={ch.id}
            onClick={() => navigate(`/mdcat/study-notes/${subjectSlug}/${ch.id}`)}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="text-left bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group space-y-3"
          >
            {/* Chapter number + weight */}
            <div className="flex items-start justify-between gap-2">
              <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded border ${meta.accent}`}>
                Ch {idx + 1}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-right leading-tight max-w-[120px]">
                {ch.weight.split('(')[0].trim()}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight group-hover:text-sky-700 transition-colors">
              {ch.title}
            </h3>

            {/* Short desc */}
            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed line-clamp-2">
              {ch.shortDesc}
            </p>

            {/* Footer row */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold">
                {ch.samples.length} practice Q{ch.samples.length !== 1 ? 's' : ''}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── remounts ContentView whenever the chapter id changes, so per-chapter
//     interaction state (answers, chats, generated notes) always starts fresh ───
function ContentViewWrapper({ onSelectQuiz }: { onSelectQuiz?: (id: number) => void }) {
  const { chapterId } = useParams();
  return <ContentView key={chapterId} onSelectQuiz={onSelectQuiz} />;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT VIEW  →  /study-notes/:subjectSlug/:chapterId
// ═══════════════════════════════════════════════════════════════════════════
function ContentView({ onSelectQuiz }: { onSelectQuiz?: (id: number) => void }) {
  const { subjectSlug, chapterId } = useParams();
  const navigate = useNavigate();

  const activeSubject = subjectSlug ? SLUG_TO_SUBJECT[subjectSlug] : undefined;
  const subjectData = activeSubject ? STUDY_DATA.find(s => s.subject === activeSubject) : null;
  const chapterData = chapterId && subjectData
    ? subjectData.chapters.find(c => c.id === chapterId)
    : null;

  const [userSelectedAnswers, setUserSelectedAnswers] = useState<Record<number, string>>({});
  const [generatedTextbooks, setGeneratedTextbooks] = useState<Record<string, string>>({});
  const [isGeneratingTextbook, setIsGeneratingTextbook] = useState(false);
  const [aiWorkspaceChats, setAiWorkspaceChats] = useState<Record<string, { q: string; a: string }[]>>({});
  const [customUserQuery, setCustomUserQuery] = useState('');
  const [isAiAnswering, setIsAiAnswering] = useState(false);

  const [activeSection, setActiveSection] = useState('concepts');

  const handleVerifyOption = (qId: number, selectedOption: string) => {
    setUserSelectedAnswers(prev => ({ ...prev, [qId]: selectedOption }));
  };

  const handleGenerateFullTextbook = async () => {
    if (!chapterData || !activeSubject || isGeneratingTextbook) return;
    const chapterKey = chapterData.id;
    setIsGeneratingTextbook(true);
    try {
      const response = await fetch(mdcatAiApi('/api/mdcat/ai/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Act as a senior writer for mdcatprep.com and an elite PMDC medical entry exam preparation mentor.
Generate an incredibly comprehensive, highly academic, and ultra-detailed textbook study sheet for:
Subject: "${activeSubject}"
Chapter Title: "${chapterData.title}" (ID: ${chapterKey})
PMDC Weight: "${chapterData.weight}"

Your textbook block MUST incorporate:
1. **FULL ACADEMIC INSIGHTS**: Deep dive into every core mechanism.
2. **PROVINCIAL BOARDS COMPARISONS**: Clear distinct bullet headings on what Punjab (UHS) vs Sindh vs KPK vs Federal textbooks highlight.
3. **HIGH-YIELD CRITICAL REVISIONS & FORMULAS**: Bold terms, exact figures.
4. **MEMORABLE MNEMONICS**: Add 2 highly intelligent mnemonic memory hooks.
5. **DISSOCIATION TRAPS**: List 3 common past paper traps students frequently confuse.`,
          subject: activeSubject,
          language: 'Bilingual (English + Urdu references)'
        })
      });
      if (response.ok) {
        const data = await response.json();
        // unwrap { success, data: { reply } } response format
        setGeneratedTextbooks(prev => ({ ...prev, [chapterKey]: data.data?.reply ?? data.reply }));
      } else throw new Error('API rejected request');
    } catch (err) {
      alert('Failed to connect to Zaheen AI. Please retry!');
    } finally {
      setIsGeneratingTextbook(false);
    }
  };

  const handleSendQueryToAI = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customUserQuery.trim() || isAiAnswering || !chapterData || !activeSubject) return;
    const queryText = customUserQuery;
    setCustomUserQuery('');
    setIsAiAnswering(true);
    const cid = chapterData.id;
    const currentHistory = aiWorkspaceChats[cid] || [];
    setAiWorkspaceChats(prev => ({
      ...prev,
      [cid]: [...currentHistory, { q: queryText, a: 'Zaheen Tutor is generating a response...' }]
    }));
    try {
      const response = await fetch(mdcatAiApi('/api/mdcat/ai/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Regarding the MDCAT chapter "${chapterData.title}" (${activeSubject}):\n\nStudent asks: "${queryText}"`,
          subject: activeSubject,
          language: 'Bilingual (English + Urdu explanations in bracket annotations)'
        })
      });
      if (response.ok) {
        const result = await response.json();
        setAiWorkspaceChats(prev => {
          const list = [...(prev[cid] || [])];
          // unwrap { success, data: { reply } } response format
          if (list.length > 0) list[list.length - 1] = { q: queryText, a: result.data?.reply ?? result.reply };
          return { ...prev, [cid]: list };
        });
      } else throw new Error();
    } catch {
      setAiWorkspaceChats(prev => {
        const list = [...(prev[cid] || [])];
        if (list.length > 0) list[list.length - 1] = { q: queryText, a: 'Connection failed. Please retry!' };
        return { ...prev, [cid]: list };
      });
    } finally {
      setIsAiAnswering(false);
    }
  };

  // bad/unknown subject or chapter id in the URL -> bounce back instead of crashing
  if (!activeSubject || !subjectData || !chapterData) {
    return <Navigate to={subjectSlug ? `/mdcat/study-notes/${subjectSlug}` : '/mdcat/study-notes'} replace />;
  }

  const meta = SUBJECT_META[activeSubject];

  return (
    <div className="space-y-6 mx-5">
      {/* Breadcrumb */}
      <div className="sticky overflow-x-hidden top-0 z-20 bg-white/90 backdrop-blur-sm py-3 -mx-4 px-4 flex items-center gap-2 flex-wrap border-b border-slate-100">
        <button onClick={() => navigate('/mdcat/study-notes')} className="text-xs font-black uppercase text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">All Subjects</button>
        <span className="text-slate-300">/</span>
        <button onClick={() => navigate(`/mdcat/study-notes/${subjectSlug}`)} className="text-xs font-black uppercase text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">{activeSubject}</button>
        <span className="text-slate-300">/</span>
        <span className="text-xs font-black uppercase text-slate-700 line-clamp-1">{chapterData.title}</span>
      </div>

      {/* Chapter Header */}
      <div className={`bg-gradient-to-r ${meta.gradient} p-6 md:p-8 rounded-3xl text-white`}>
        <div className="space-y-2">
          <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-white/20 rounded tracking-wider">
            {activeSubject} · Syllabus Weight: {chapterData.weight}
          </span>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">{chapterData.title}</h2>
          <p className="text-sm opacity-80 font-semibold max-w-2xl">{chapterData.shortDesc}</p>
        </div>
      </div>

      {/* Pill Navigation */}
      <div className="flex p-10  justify-center h-10 flex-wrap gap-2 sm:gap-2.5">
        {[
          { id: 'concepts', label: 'Concepts', icon: BookOpen },
          { id: 'questions', label: 'Practice Questions', icon: HelpCircle },
          { id: 'coach', label: 'AI Coach', icon: Flame },
        ].map((tab) => {
          const isActive = activeSection === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center h-10 gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all shrink-0 ${isActive
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-200'
                  : 'bg-white text-sky-700 border border-sky-100 hover:bg-sky-50'
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}

        {/* Textbook Expander pill - always bright purple, never neutral */}
        <button
          onClick={() => setActiveSection('expander')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all shrink-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200 ${activeSection === 'expander' ? 'ring-2 ring-offset-2 ring-violet-400' : 'hover:brightness-110'
            }`}
        >
          <Sparkles className="w-3.5 h-3.5 fill-violet-200" />
          Textbook Expander
        </button>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl  border-sky-100 ">

        {/* ===== CONCEPTS TAB ===== */}
        {activeSection === 'concepts' && (
          <div className="space-y-6">
            {chapterData.sections && chapterData.sections.length > 0 ? (
              // --- PATHWAY A: STRUCTURED SECTIONS ---
              <div className="grid grid-cols-1 gap-5">
                {chapterData.sections.map((sect, sIdx) => (
                  <div
                    key={sIdx}
                    className="group relative bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-sky-300 hover:shadow-sky-100/30 transition-all duration-300"
                  >
                    {/* Card Header & Section Number Badge */}
                    <div className="flex items-center gap-3.5 mb-4 pb-3.5 border-b border-slate-100/80">
                      <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white text-xs font-black tracking-wider shadow-sm shadow-sky-500/20">
                        {String(sIdx + 1).padStart(2, '0')}
                      </span>
                      <h5 className="text-lg font-black text-sky-950 uppercase tracking-tight">
                        {sect.heading}
                      </h5>
                    </div>

                    {/* Bullet Points List */}
                    <ul className="space-y-3.5">
                      {sect.bullets.map((bullet, bIdx) => {
                        const parts = bullet.split('**');
                        return (
                          <li key={bIdx} className="text-[13px] text-slate-600 leading-relaxed font-medium flex items-start gap-3">
                            <CornerDownRight className="w-4 h-4 text-sky-500 shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                            <span className="text-slate-600">
                              {parts.map((p, pIdx) =>
                                pIdx % 2 === 1 ? (
                                  <strong key={pIdx} className="text-sky-950 font-extrabold px-1 rounded bg-sky-50/80 border border-sky-100/30">
                                    {p}
                                  </strong>
                                ) : p
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              // --- PATHWAY B: DETAILED QUICK CONTENT ---
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {chapterData.detailedContent.map((point, index) => {
                  const parts = point.split('**');
                  return (
                    <div
                      key={index}
                      className="group relative bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-sky-300 hover:shadow-sky-100/30 transition-all duration-300 flex items-start gap-4"
                    >


                      {/* Content Text */}
                      <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
                        {parts.map((p, pIdx) =>
                          pIdx % 2 === 1 ? (
                            <strong key={pIdx} className="text-sky-950 font-extrabold px-1 rounded bg-sky-50/80 border border-sky-100/30">
                              {p}
                            </strong>
                          ) : p
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}


            {/* Board Insights */}
            <div className="p-5 rounded-2xl bg-amber-50/35 border border-amber-100 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="text-[10px] font-black uppercase text-amber-800 tracking-wide">Provincial Textbook Distinctions</h5>
                <p className="text-xs text-amber-950 leading-relaxed font-semibold">{chapterData.boardInsights}</p>
              </div>
            </div>

            {/* Mnemonics */}
            {chapterData.mnemonics.length > 0 && (
              <div className="p-4 rounded-2xl bg-sky-50/30 border border-sky-100 space-y-2">
                <h5 className="text-[10px] font-black uppercase text-sky-700 tracking-wider">💡 Mnemonic Aid</h5>
                <ul className="space-y-1 pl-1">
                  {chapterData.mnemonics.map((mn, idx) => {
                    const sections = mn.split('**');
                    return (
                      <li key={idx} className="text-xs text-sky-950 font-semibold flex items-center gap-2">
                        <span className="text-sm">⚡</span>
                        <span>{sections.map((s, sIdx) => sIdx % 2 === 1 ? <strong key={sIdx} className="font-extrabold text-sky-900">{s}</strong> : s)}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ===== PRACTICE QUESTIONS TAB ===== */}
        {activeSection === 'questions' && (
          <div className="space-y-5">
            <h4 className="text-3xl uppercase font-black text-sky-400 tracking-wider flex items-center gap-1.5 border-b border-sky-50/50 pb-1">
              <HelpCircle className="size-9 text-sky-550" /> Solved Board Sample Questions
            </h4>
            {chapterData.samples.map((q, qIndex) => {
              const verifiedAnswer = userSelectedAnswers[q.id];
              const isCorrectAnswer = verifiedAnswer === q.correctOption;
              return (
                <div key={q.id} className="p-5 border border-sky-100 rounded-2xl bg-white shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="px-2.5 py-0.5 text-[8px] font-black bg-sky-50 text-sky-850 rounded uppercase tracking-wider">Q#{qIndex + 1}</span>
                    {verifiedAnswer && (
                      <span className={`text-2xl font-black uppercase flex items-center gap-1 px-2 py-0.5 rounded ${isCorrectAnswer ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {isCorrectAnswer ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {isCorrectAnswer ? 'CORRECT' : `INCORRECT (Answer: ${q.correctOption})`}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-sky-950">{q.questionText}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[{ val: 'A', text: q.optionA }, { val: 'B', text: q.optionB }, { val: 'C', text: q.optionC }, { val: 'D', text: q.optionD }].map((opt) => {
                      const isOptionSelected = verifiedAnswer === opt.val;
                      const isOptionCorrect = q.correctOption === opt.val;
                      let optStyle = 'border-sky-100 hover:bg-sky-50/25 bg-white text-sky-950';
                      if (verifiedAnswer) {
                        if (isOptionCorrect) optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-extrabold ring-1 ring-emerald-300';
                        else if (isOptionSelected) optStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                        else optStyle = 'opacity-60 border-slate-105 bg-white text-slate-500';
                      }
                      return (
                        <button key={opt.val} onClick={() => handleVerifyOption(q.id, opt.val)}
                          className={`text-left p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition ${optStyle}`}>
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${isOptionSelected ? 'bg-sky-500 text-white' : 'bg-sky-100/50 text-sky-800'}`}>{opt.val}</span>
                          <span>{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                  {verifiedAnswer && (
                    <div className="p-4 bg-emerald-50/25 border border-emerald-100 rounded-xl text-[11px] text-emerald-950 leading-relaxed font-semibold">
                      <span className="font-extrabold text-[10px] text-emerald-850 block uppercase tracking-wide flex items-center gap-1 mb-1">
                        <Info className="w-3.5 h-3.5" /> Explanation:
                      </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ===== AI COACH TAB ===== */}
        {activeSection === 'coach' && (
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-violet-50/50 via-white to-sky-50/50 border border-violet-100 space-y-5">
            <div className="space-y-1.5">
              <span className="px-2 py-0.5 rounded bg-violet-100 text-violet-700 text-[8px] font-black uppercase tracking-widest border border-violet-150">Live AI Chapter Coach</span>
              <h4 className="text-sm font-black text-sky-950 uppercase tracking-tight flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-violet-500 animate-pulse" /> Consult Zaheen AI on "{chapterData.title}"
              </h4>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {[`Give me a study checklist for ${chapterData.title}`, `What are common past paper traps in this topic?`, `Generate 3 harder questions with explanations`].map((sugg, i) => (
                <button key={i} onClick={() => setCustomUserQuery(sugg)}
                  className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-violet-900 bg-violet-50 hover:bg-violet-100 rounded-lg cursor-pointer transition-all">
                  💡 {sugg}
                </button>
              ))}
            </div>
            {aiWorkspaceChats[chapterData.id] && aiWorkspaceChats[chapterData.id].length > 0 && (
              <div className="space-y-4 max-h-[300px] overflow-y-auto border-t border-b border-slate-100 py-4 pr-1">
                {aiWorkspaceChats[chapterData.id].map((chat, cIdx) => (
                  <div key={cIdx} className="space-y-2">
                    <div className="flex items-start gap-2 max-w-[85%] ml-auto bg-violet-600 text-white rounded-2xl rounded-tr-none px-3.5 py-2.5 text-xs font-semibold shadow-sm">
                      {chat.q}
                    </div>
                    <div className="max-w-[90%] bg-zinc-50 border border-violet-100 rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs text-zinc-950 font-semibold leading-relaxed shadow-inner whitespace-pre-wrap">
                      {chat.a}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleSendQueryToAI} className="flex gap-2 items-center">
              <input type="text" placeholder="Ask anything about this chapter..."
                value={customUserQuery} onChange={(e) => setCustomUserQuery(e.target.value)}
                disabled={isAiAnswering}
                className="flex-1 bg-white border border-slate-200 focus:border-violet-400 focus:outline-none rounded-xl px-4 py-3 text-xs font-bold text-slate-800 placeholder-slate-400"
              />
              <button type="submit" disabled={isAiAnswering || !customUserQuery.trim()}
                className="px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow cursor-pointer transition disabled:opacity-40 flex items-center justify-center shrink-0">
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>
        )}

        {/* ===== TEXTBOOK EXPANDER TAB ===== */}
        {activeSection === 'expander' && (
          <div className="space-y-5">
            <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md overflow-hidden relative">
              <div className="space-y-1 z-10">
                <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-violet-100 bg-white/15 rounded-md">Premium Interactive Study</span>
                <h4 className="text-sm font-black uppercase tracking-tight flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-violet-200 fill-violet-300 animate-pulse" /> Zaheen AI Textbook Expander 🧠
                </h4>
                <p className="text-[10px] text-violet-100 font-semibold max-w-md leading-relaxed">
                  Generate highly-detailed notes including molecular structures, formulas, provincial board comparisons, and exam pitfalls!
                </p>
              </div>
              <button
                onClick={handleGenerateFullTextbook}
                disabled={isGeneratingTextbook}
                className="z-10 px-4 py-2.5 bg-white hover:bg-violet-50 text-violet-700 font-black uppercase text-[10px] tracking-wider rounded-xl shadow transition duration-200 cursor-pointer disabled:opacity-50 shrink-0 flex items-center gap-1.5 active:scale-95"
              >
                {isGeneratingTextbook ? (
                  <><span className="animate-spin text-violet-600">⚙</span><span>Compiling Notes...</span></>
                ) : (
                  <><Zap className="w-3.5 h-3.5 fill-violet-700 text-violet-700" /><span>Generate Complete Study Sheet</span></>
                )}
              </button>
            </div>

            {generatedTextbooks[chapterData.id] && (
              <div className="p-6 bg-zinc-50 border border-violet-100 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-violet-100 pb-3">
                  <span className="text-[10px] font-black text-violet-700 uppercase tracking-widest flex items-center gap-1.5">
                    <BookMarked className="w-4 h-4" /> AI Generated High-Yield Study Sheet
                  </span>
                  <button
                    onClick={() => setGeneratedTextbooks(prev => { const n = { ...prev }; delete n[chapterData.id]; return n; })}
                    className="text-[9px] font-black uppercase text-rose-600 hover:text-rose-800 bg-rose-50 px-2.5 py-1 rounded transition"
                  >Clear</button>
                </div>
                <div className="whitespace-pre-wrap font-sans text-xs text-slate-800 leading-relaxed font-semibold bg-white p-5 rounded-xl border border-slate-200">
                  {generatedTextbooks[chapterData.id]}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}