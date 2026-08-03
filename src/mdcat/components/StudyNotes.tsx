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
import SEO from './SEO';  //997-1293

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
      },
      {
        id: 'chem-ch3',
        title: 'Atomic Structure & Periodic Table',
        weight: '6-8 MCQs in MDCAT syllabus',
        shortDesc: 'Bohr model, quantum numbers, electron configuration rules, and periodic trends.',
        sections: [],
        detailedContent: [
          '**Bohr\'s Model**: Electrons orbit the nucleus in fixed circular energy shells without radiating energy; angular momentum is quantized as mvr = nh/2π.',
          '**Quantum Numbers**: **Principal (n)** defines shell size/energy. **Azimuthal (l)** defines subshell shape (0=s, 1=p, 2=d, 3=f). **Magnetic (ml)** defines orbital orientation. **Spin (ms)** defines electron spin (+1/2 or -1/2).',
          '**Aufbau Principle**: Electrons fill lowest-energy orbitals first, following the (n+l) rule for subshell ordering.',
          '**Pauli Exclusion Principle**: No two electrons in an atom can share all four identical quantum numbers.',
          '**Hund\'s Rule**: Degenerate orbitals are singly occupied before any pairing begins, minimizing repulsion.',
          '**Periodic Trends**: Atomic radius decreases left-to-right across a period (rising nuclear charge) and increases down a group (added shells). Ionization energy trends oppositely.'
        ],
        boardInsights: 'Punjab and Federal textbooks emphasize exact quantum number combinations for specific electrons. Sindh board frequently tests anomalous configurations (Chromium, Copper) that deviate from strict Aufbau filling.',
        mnemonics: [
          '**"SPDF = 2,6,10,14"**: Maximum electron capacity per subshell type follows this sequence.'
        ],
        samples: [
          {
            id: 1201,
            questionText: 'Which element shows an anomalous electronic configuration due to extra stability of a half-filled d-subshell?',
            optionA: 'Iron (Fe)',
            optionB: 'Chromium (Cr)',
            optionC: 'Zinc (Zn)',
            optionD: 'Cobalt (Co)',
            correctOption: 'B',
            explanation: 'Chromium adopts [Ar] 3d5 4s1 instead of the expected 3d4 4s2, since a half-filled d-subshell offers extra exchange-energy stability.'
          }
        ]
      },
      {
        id: 'chem-ch4',
        title: 'Chemical Bonding',
        weight: '8-10 MCQs in MDCAT syllabus',
        shortDesc: 'Ionic, covalent, and coordinate bonds, hybridization, and molecular geometry (VSEPR).',
        sections: [],
        detailedContent: [
          '**Ionic Bonding**: Complete transfer of electrons between a metal and non-metal, forming oppositely charged ions held by electrostatic attraction.',
          '**Covalent Bonding**: Mutual sharing of electron pairs between atoms; can be single, double, or triple depending on shared pairs.',
          '**Coordinate (Dative) Bond**: Both shared electrons are donated by a single atom (e.g., in NH4+ formation from NH3 and H+).',
          '**Hybridization**: sp3 gives tetrahedral geometry (109.5°, e.g., CH4); sp2 gives trigonal planar (120°, e.g., BF3); sp gives linear geometry (180°, e.g., BeCl2).',
          '**VSEPR Theory**: Molecular shape is determined by minimizing repulsion between electron pairs (bonding and lone) around the central atom.',
          '**Lone Pair Effect**: Lone pairs occupy more space than bonding pairs, compressing bond angles (e.g., water\'s H-O-H angle is 104.5°, not the ideal 109.5°).'
        ],
        boardInsights: 'KMU (KPK) and Sindh textbooks frequently test exact bond angle deviations due to lone pair repulsion. Federal board questions often ask students to predict hybridization directly from molecular formula.',
        mnemonics: [
          '**"More Lone, Less Angle"**: Each additional lone pair on the central atom compresses the bond angle further.'
        ],
        samples: [
          {
            id: 1202,
            questionText: 'What is the hybridization and molecular geometry of the central carbon atom in methane (CH4)?',
            optionA: 'sp2, trigonal planar',
            optionB: 'sp3, tetrahedral',
            optionC: 'sp, linear',
            optionD: 'sp3d, trigonal bipyramidal',
            correctOption: 'B',
            explanation: 'Carbon in methane forms four equivalent sigma bonds via sp3 hybridization, giving a tetrahedral shape with 109.5° bond angles.'
          }
        ]
      },
      {
        id: 'chem-ch5',
        title: 'Electrochemistry & Redox Reactions',
        weight: '6-8 MCQs in MDCAT syllabus',
        shortDesc: 'Oxidation states, galvanic cells, electrolysis, and standard electrode potentials.',
        sections: [],
        detailedContent: [
          '**Oxidation**: Loss of electrons, increase in oxidation state. **Reduction**: Gain of electrons, decrease in oxidation state.',
          '**Galvanic (Voltaic) Cell**: Converts spontaneous chemical energy into electrical energy; oxidation occurs at the anode (negative), reduction at the cathode (positive).',
          '**Electrolytic Cell**: Uses external electrical energy to drive a non-spontaneous reaction; anode is positive, cathode is negative here.',
          '**Standard Electrode Potential (E°)**: Measured relative to the Standard Hydrogen Electrode (SHE), assigned E° = 0.00 V.',
          '**Cell EMF**: E°cell = E°cathode − E°anode. A positive value indicates a spontaneous reaction.',
          '**Faraday\'s Laws of Electrolysis**: Mass deposited is directly proportional to the quantity of electric charge passed (Q = It).'
        ],
        boardInsights: 'Sindh and Federal boards emphasize numerical problems calculating moles of metal deposited using Faraday\'s laws. Punjab textbooks focus more on identifying anode/cathode polarity differences between galvanic and electrolytic cells.',
        mnemonics: [
          '**"AN OX, RED CAT"**: Oxidation occurs at the Anode; Reduction occurs at the Cathode — true for both cell types.'
        ],
        samples: [
          {
            id: 1203,
            questionText: 'In a galvanic cell, at which electrode does reduction take place, and what is its polarity?',
            optionA: 'Anode, negative',
            optionB: 'Cathode, positive',
            optionC: 'Anode, positive',
            optionD: 'Cathode, negative',
            correctOption: 'B',
            explanation: 'In a galvanic cell, reduction occurs at the cathode, which is the positive electrode since it attracts electrons flowing from the anode.'
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
      },
      {
        id: 'phys-ch2',
        title: 'Kinematics & Vectors',
        weight: '7-9 MCQs in MDCAT syllabus',
        shortDesc: 'Scalar vs vector quantities, equations of motion, and projectile mechanics.',
        sections: [],
        detailedContent: [
          '**Scalars vs Vectors**: Scalars have magnitude only (mass, speed, distance); vectors have both magnitude and direction (velocity, displacement, force).',
          '**Equations of Motion**: v = u + at; s = ut + ½at²; v² = u² + 2as — valid only for constant acceleration.',
          '**Projectile Motion**: Horizontal velocity remains constant (no horizontal force, ignoring air resistance); vertical motion is affected solely by gravitational acceleration (g).',
          '**Maximum Height**: H = u²sin²θ / 2g. **Range**: R = u²sin2θ / g, maximized at a launch angle of 45°.',
          '**Relative Velocity**: The velocity of one object as observed from another moving reference frame; calculated via vector subtraction.'
        ],
        boardInsights: 'Federal and Sindh textbooks include heavier numerical problems combining projectile range and maximum height in a single question. Punjab board frequently tests relative velocity in two dimensions.',
        mnemonics: [
          '**"45 for Max Range"**: Projectile range is maximized precisely at a 45° launch angle, assuming equal launch/landing height.'
        ],
        samples: [
          {
            id: 1301,
            questionText: 'At what launch angle (measured from the horizontal) is the horizontal range of a projectile maximized, assuming equal launch and landing elevation?',
            optionA: '30°',
            optionB: '45°',
            optionC: '60°',
            optionD: '90°',
            correctOption: 'B',
            explanation: 'Range R = u²sin2θ/g is maximized when sin2θ = 1, which occurs at θ = 45°.'
          }
        ]
      },
      {
        id: 'phys-ch3',
        title: 'Work, Energy & Power',
        weight: '6-8 MCQs in MDCAT syllabus',
        shortDesc: 'Work-energy theorem, conservation of mechanical energy, and power calculations.',
        sections: [],
        detailedContent: [
          '**Work Done**: W = Fd cosθ, where θ is the angle between the applied force and displacement direction.',
          '**Work-Energy Theorem**: The net work done on an object equals its change in kinetic energy (Wnet = ΔKE).',
          '**Conservation of Mechanical Energy**: In the absence of non-conservative forces (friction, air resistance), total mechanical energy (KE + PE) remains constant.',
          '**Power**: Rate of doing work, P = W/t = Fv (force times velocity), measured in Watts (J/s).',
          '**Elastic vs Inelastic Collisions**: Elastic collisions conserve both momentum and kinetic energy; inelastic collisions conserve only momentum.'
        ],
        boardInsights: 'KMU and Punjab boards frequently test the distinction between conservative and non-conservative forces using pendulum or inclined-plane scenarios. Sindh board includes collision-based numericals.',
        mnemonics: [
          '**"Elastic Keeps Both"**: Elastic collisions conserve both momentum AND kinetic energy; inelastic keeps only momentum.'
        ],
        samples: [
          {
            id: 1302,
            questionText: 'In a perfectly elastic collision between two bodies, which quantities are conserved?',
            optionA: 'Only momentum',
            optionB: 'Only kinetic energy',
            optionC: 'Both momentum and kinetic energy',
            optionD: 'Neither is conserved',
            correctOption: 'C',
            explanation: 'A perfectly elastic collision conserves both total momentum and total kinetic energy of the system, unlike an inelastic collision which conserves only momentum.'
          }
        ]
      },
      {
        id: 'phys-ch4',
        title: 'Current Electricity & Circuits',
        weight: '8 MCQs in MDCAT syllabus',
        shortDesc: 'Ohm\'s law, series/parallel resistor networks, and Kirchhoff\'s laws.',
        sections: [],
        detailedContent: [
          '**Ohm\'s Law**: V = IR, valid only for ohmic conductors at constant temperature.',
          '**Series Resistors**: Total resistance is the sum, R_total = R1 + R2 + ...; current stays the same through each resistor.',
          '**Parallel Resistors**: Reciprocal of total resistance equals the sum of reciprocals, 1/R_total = 1/R1 + 1/R2 + ...; voltage stays the same across each branch.',
          '**Kirchhoff\'s Current Law (KCL)**: Total current entering a junction equals total current leaving it (conservation of charge).',
          '**Kirchhoff\'s Voltage Law (KVL)**: The sum of potential differences around any closed loop equals zero (conservation of energy).'
        ],
        boardInsights: 'Sindh and Federal boards frequently combine series-parallel networks in a single numerical. Punjab board tests Kirchhoff\'s laws conceptually rather than with heavy calculation.',
        mnemonics: [
          '**"Series Adds, Parallel Halves-ish"**: Series resistances add directly; parallel resistances always give a total smaller than the smallest individual resistor.'
        ],
        samples: [
          {
            id: 1303,
            questionText: 'Two resistors of 4Ω and 6Ω are connected in parallel. What is the equivalent resistance?',
            optionA: '10Ω',
            optionB: '2.4Ω',
            optionC: '5Ω',
            optionD: '24Ω',
            correctOption: 'B',
            explanation: '1/R = 1/4 + 1/6 = 5/12, so R = 12/5 = 2.4Ω.'
          }
        ]
      },
      {
        id: 'phys-ch5',
        title: 'Modern Physics (Atomic & Nuclear)',
        weight: '6-7 MCQs in MDCAT syllabus',
        shortDesc: 'Photoelectric effect, atomic models, radioactivity, and nuclear binding energy.',
        sections: [],
        detailedContent: [
          '**Photoelectric Effect**: Emission of electrons from a metal surface when struck by light of sufficient frequency (above the threshold frequency); explained by Einstein using discrete photon energy, E = hf.',
          '**Bohr\'s Atomic Model**: Electrons occupy discrete stationary energy orbits; radiation is emitted or absorbed only during transitions between orbits, with energy ΔE = hf.',
          '**Radioactive Decay Types**: Alpha decay emits a helium nucleus (mass -4, charge -2); beta decay emits an electron (mass unchanged, charge +1); gamma decay emits high-energy photons (no mass/charge change).',
          '**Half-Life**: The time required for half of a radioactive sample to decay; follows N = N0(1/2)^(t/T½).',
          '**Mass-Energy Equivalence**: E = mc², explaining nuclear binding energy released during fission and fusion reactions.'
        ],
        boardInsights: 'Federal textbooks include half-life decay calculations with multiple half-life periods. KMU board frequently tests conceptual differences between alpha, beta, and gamma radiation penetration power.',
        mnemonics: [
          '**"Alpha Stops at Skin, Gamma Needs Lead"**: Alpha radiation is stopped by paper/skin, beta by a few mm of aluminum, gamma requires thick lead or concrete shielding.'
        ],
        samples: [
          {
            id: 1304,
            questionText: 'A radioactive sample has a half-life of 4 days. What fraction of the original sample remains after 12 days?',
            optionA: '1/2',
            optionB: '1/4',
            optionC: '1/8',
            optionD: '1/16',
            correctOption: 'C',
            explanation: '12 days corresponds to exactly 3 half-lives (12/4 = 3), so the remaining fraction is (1/2)³ = 1/8.'
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
      },
      {
        id: 'eng-ch2',
        title: 'Vocabulary — Synonyms & Antonyms',
        weight: '5-6 MCQs in mandatory exams',
        shortDesc: 'High-frequency MDCAT vocabulary, contextual synonym selection, and antonym traps.',
        sections: [],
        detailedContent: [
          '**Contextual Meaning**: Always select the synonym that fits the specific context of the sentence, not just the most common dictionary meaning of the word.',
          '**Antonym Traps**: Many options are near-synonyms of the original word rather than true opposites — read all four options carefully before selecting.',
          '**Root Word Strategy**: Breaking an unfamiliar word into prefix, root, and suffix often reveals its meaning (e.g., "benevolent" = bene (good) + volent (wishing) = kind-hearted).',
          '**Register Awareness**: Formal exam vocabulary tends to favor precise, less commonly used synonyms over casual ones.'
        ],
        boardInsights: 'PMDC exams draw vocabulary heavily from academic and scientific reading passages rather than everyday conversational English.',
        mnemonics: [
          '**"Context is King"**: When two options seem correct, the sentence\'s context always decides the better fit.'
        ],
        samples: [
          {
            id: 1401,
            questionText: 'Choose the best synonym for the underlined word: The scientist\'s findings were entirely "empirical".',
            optionA: 'Theoretical',
            optionB: 'Observational',
            optionC: 'Imaginary',
            optionD: 'Abstract',
            correctOption: 'B',
            explanation: '"Empirical" means based on observation or experiment rather than theory, making "observational" the closest synonym.'
          }
        ]
      },
      {
        id: 'eng-ch3',
        title: 'Reading Comprehension & Inference',
        weight: '6-8 MCQs in mandatory exams',
        shortDesc: 'Passage-based questions testing main idea identification, tone, and inference skills.',
        sections: [],
        detailedContent: [
          '**Main Idea vs Detail**: The main idea captures the passage\'s overall purpose; details are supporting facts that should not be mistaken for the central theme.',
          '**Inference Questions**: Answers must be logically supported by the passage\'s content — never assume information not stated or implied.',
          '**Tone Identification**: Authors\' tone can be neutral, critical, persuasive, or informative — identified through word choice and sentence structure, not just topic.',
          '**Elimination Strategy**: Eliminate options that are too broad, too narrow, or directly contradicted by the passage before selecting the best answer.'
        ],
        boardInsights: 'Sindh and Federal boards typically use scientific/medical passages for comprehension, testing both vocabulary and logical inference simultaneously.',
        mnemonics: [
          '**"Stick to the Text"**: Correct inference answers are always traceable back to something stated in the passage, never outside knowledge.'
        ],
        samples: [
          {
            id: 1402,
            questionText: 'A passage describes an author enthusiastically detailing recent advances in vaccine research. What is the author\'s likely tone?',
            optionA: 'Skeptical',
            optionB: 'Optimistic',
            optionC: 'Indifferent',
            optionD: 'Hostile',
            correctOption: 'B',
            explanation: 'Enthusiastic detailing of scientific progress indicates an optimistic tone rather than doubt, indifference, or hostility.'
          }
        ]
      },
      {
        id: 'eng-ch4',
        title: 'Tenses & Sentence Structure',
        weight: '5-6 MCQs in mandatory exams',
        shortDesc: 'Correct tense usage, sentence fragments, and run-on sentence correction.',
        sections: [],
        detailedContent: [
          '**Present Perfect vs Simple Past**: Present perfect (have/has + past participle) connects a past action to the present; simple past describes a completed action at a specific past time.',
          '**Conditional Sentences**: Zero conditional states general truths; first conditional describes real future possibilities; second conditional describes hypothetical present/future situations; third conditional describes hypothetical past situations.',
          '**Sentence Fragments**: An incomplete sentence lacking a subject, verb, or complete thought, often mistakenly punctuated as a full sentence.',
          '**Run-on Sentences**: Two or more independent clauses joined without proper punctuation or conjunctions — corrected using a period, semicolon, or coordinating conjunction.'
        ],
        boardInsights: 'Punjab textbooks frequently test conditional sentence type identification. Federal board favors run-on/fragment correction questions.',
        mnemonics: [
          '**"If-Would = Hypothetical"**: Second and third conditionals almost always pair "if" with "would/could/might" to signal an unreal situation.'
        ],
        samples: [
          {
            id: 1403,
            questionText: 'Identify the correct sentence: "If I ___ more time, I would have finished the assignment."',
            optionA: 'have',
            optionB: 'had had',
            optionC: 'will have',
            optionD: 'has',
            correctOption: 'B',
            explanation: 'This is a third conditional (hypothetical past), requiring "if + past perfect" (had had) paired with "would have + past participle".'
          }
        ]
      },
      {
        id: 'eng-ch5',
        title: 'Idioms, Phrasal Verbs & Usage',
        weight: '4-5 MCQs in mandatory exams',
        shortDesc: 'Common idiomatic expressions, phrasal verb meanings, and preposition usage.',
        sections: [],
        detailedContent: [
          '**Idioms**: Fixed expressions whose meaning cannot be derived from the literal meaning of individual words (e.g., "break the ice" = to initiate conversation in an awkward situation).',
          '**Phrasal Verbs**: Verb + preposition/adverb combinations that create a new meaning distinct from the base verb (e.g., "give up" = to quit, not literally "give" something "up").',
          '**Preposition Pairing**: Certain adjectives and verbs pair with specific fixed prepositions (e.g., "interested in", "capable of", "depend on").',
          '**Formal vs Idiomatic Register**: Exam answers typically favor standard formal usage over overly casual idiomatic phrasing unless the question specifically tests idiom recognition.'
        ],
        boardInsights: 'KMU board frequently tests fixed preposition pairings in fill-in-the-blank format. Sindh board includes idiom-meaning matching questions.',
        mnemonics: [
          '**"Verb + Particle ≠ Literal"**: Always interpret phrasal verbs as a single unit of meaning, never word-by-word.'
        ],
        samples: [
          {
            id: 1404,
            questionText: 'What does the phrasal verb "put off" mean in the sentence: "They decided to put off the meeting until next week"?',
            optionA: 'Cancel permanently',
            optionB: 'Postpone',
            optionC: 'Attend',
            optionD: 'Announce',
            correctOption: 'B',
            explanation: '"Put off" means to postpone or delay something to a later time, not to cancel it permanently.'
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
      },
      {
        id: 'log-ch2',
        title: 'Number Series & Analogies',
        weight: '6 MCQs (High Scoring Potential)',
        shortDesc: 'Identifying numeric patterns, missing terms, and word/number analogy relationships.',
        sections: [],
        detailedContent: [
          '**Arithmetic Series**: Each term increases/decreases by a constant difference (e.g., 2, 5, 8, 11... difference of 3).',
          '**Geometric Series**: Each term is multiplied by a constant ratio (e.g., 3, 6, 12, 24... ratio of 2).',
          '**Alternating Pattern Series**: Two interwoven patterns exist within a single sequence, requiring separate analysis of alternating positions.',
          '**Analogies**: Identify the precise relationship in the first pair (e.g., cause-effect, part-whole, category-example) and apply the same relationship to the second pair.'
        ],
        boardInsights: 'MDCAT logical reasoning favors quick pattern recognition over lengthy calculation — practicing timed drills improves speed significantly.',
        mnemonics: [
          '**"Check the Gaps First"**: Always compute the difference (or ratio) between consecutive terms before assuming a complex pattern.'
        ],
        samples: [
          {
            id: 1501,
            questionText: 'Find the next number in the series: 4, 9, 16, 25, ?',
            optionA: '30',
            optionB: '36',
            optionC: '35',
            optionD: '32',
            correctOption: 'B',
            explanation: 'The series follows perfect squares (2², 3², 4², 5²...), so the next term is 6² = 36.'
          }
        ]
      },
      {
        id: 'log-ch3',
        title: 'Coding-Decoding',
        weight: '5 MCQs (Quick Scoring)',
        shortDesc: 'Letter shifting, number substitution, and symbol-based coding patterns.',
        sections: [],
        detailedContent: [
          '**Letter Shift Coding**: Each letter is shifted a fixed number of positions in the alphabet (e.g., A→C is a shift of +2).',
          '**Number Substitution**: Letters or words are assigned corresponding numeric values, often based on alphabetical position (A=1, B=2, etc.).',
          '**Reverse Coding**: Words or letter sequences are coded in reverse order rather than through substitution.',
          '**Pattern Consistency Check**: Always verify the coding rule against a second example if provided, before applying it to solve for the unknown.'
        ],
        boardInsights: 'MDCAT questions favor simple, consistent shift-based coding rather than multi-step compound codes — look for the simplest rule that fits all given examples.',
        mnemonics: [
          '**"Test the Rule Twice"**: Confirm your assumed coding rule works for every given letter/word before applying it to the answer.'
        ],
        samples: [
          {
            id: 1502,
            questionText: 'If CAT is coded as DBU, how is DOG coded using the same rule?',
            optionA: 'EPH',
            optionB: 'EPI',
            optionC: 'FPH',
            optionD: 'EOH',
            correctOption: 'A',
            explanation: 'Each letter is shifted forward by one position in the alphabet (C→D, A→B, T→U), so D→E, O→P, G→H gives EPH.'
          }
        ]
      },
      {
        id: 'log-ch4',
        title: 'Blood Relations & Direction Sense',
        weight: '5-6 MCQs (Common Rank Decider)',
        shortDesc: 'Family relationship puzzles and directional/positional reasoning problems.',
        sections: [],
        detailedContent: [
          '**Family Tree Mapping**: Draw a simple diagram connecting each stated relationship rather than tracking relations mentally, to avoid confusion in multi-generation puzzles.',
          '**Gender-Neutral Relation Terms**: Terms like "sibling", "parent", and "cousin" don\'t specify gender — read carefully for gender-specific clues (brother, sister, son, daughter) before concluding.',
          '**Direction Sense**: Standard convention treats North as up, movements are tracked cumulatively, and right/left turns must be interpreted relative to current facing direction, not fixed compass directions.',
          '**Shortest Distance Calculation**: When a path involves multiple turns, calculate net displacement using the Pythagorean theorem rather than adding all path segments together.'
        ],
        boardInsights: 'MDCAT direction-sense questions frequently combine turns with distance calculations, testing both spatial reasoning and basic geometry.',
        mnemonics: [
          '**"Draw, Don\'t Just Think"**: Blood relation and direction problems are solved far more reliably with a quick sketch than mental tracking alone.'
        ],
        samples: [
          {
            id: 1503,
            questionText: 'Pointing to a photograph, a man says, "She is the daughter of my grandfather\'s only son." How is the woman related to the man?',
            optionA: 'Sister',
            optionB: 'Mother',
            optionC: 'Cousin',
            optionD: 'Aunt',
            correctOption: 'A',
            explanation: 'The man\'s grandfather\'s only son is the man\'s father, so the daughter of the man\'s father is his sister.'
          }
        ]
      },
      {
        id: 'log-ch5',
        title: 'Data Sufficiency & Statement Analysis',
        weight: '5 MCQs (Analytical Precision)',
        shortDesc: 'Determining whether given statements provide enough information to reach a definitive conclusion.',
        sections: [],
        detailedContent: [
          '**Core Principle**: The goal is not to solve the problem, but to determine whether the given statement(s) alone are sufficient to solve it.',
          '**Independent Statement Testing**: Each statement must first be evaluated completely on its own before considering both statements combined.',
          '**Common Trap**: A statement that seems intuitively related to the question may still be logically insufficient if it doesn\'t provide a definitive, calculable answer.',
          '**Combined Sufficiency**: If neither statement alone is sufficient, check whether both statements together provide enough information — this is a distinct case from either being individually sufficient.'
        ],
        boardInsights: 'MDCAT data sufficiency questions test precise logical discipline — avoid assuming outside information not explicitly stated in either statement.',
        mnemonics: [
          '**"Alone First, Together Second"**: Always test each statement in isolation before ever considering them jointly.'
        ],
        samples: [
          {
            id: 1504,
            questionText: 'Is x an even number?\nStatement 1: x is divisible by 4.\nStatement 2: x is divisible by 2.\nWhich statement(s) are sufficient?',
            optionA: 'Statement 1 alone is sufficient',
            optionB: 'Statement 2 alone is sufficient',
            optionC: 'Both together are required',
            optionD: 'Neither is sufficient',
            correctOption: 'A',
            explanation: 'Statement 1 alone is sufficient since any number divisible by 4 must also be divisible by 2, making it even. Statement 2 alone is also sufficient by definition, so either alone answers the question — the precise answer here is that each statement independently suffices.'
          }
        ]
      }
    ]
  }
];

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
    
            <SEO
        title="MDCAT Study Notes — All Subjects"
        description="Complete MDCAT syllabus notes covering Biology, Chemistry, Physics, English, and Logical Reasoning, mapped to Punjab, Sindh, KPK, and Federal board standards."
        path="/study-notes"
      />      
      <div
        className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-sky-950 text-white overflow-hidden"
      >
        <button
            onClick={onBack}
            className="flex items-center gap-1 text-[10px] font-black uppercase text-sky-200 hover:text-white transition-colors absolute left-6 md:left-10 top-6 md:top-13"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-center items-center gap-2 flex-wrap mb-3">
            <span className="px-2.5 py-0.5 text-[9px] font-black uppercase text-amber-300 bg-amber-500/15 border border-amber-400/30 rounded-md tracking-wider">
              PMDC 100% Syllabus Coverage
            </span>
            <span className="px-2.5 py-0.5 text-[9px] font-black uppercase text-sky-200 bg-sky-500/15 border border-sky-400/30 rounded-md tracking-wider">
              5 Subjects Available
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight flex items-center justify-center gap-2 text-center">
            MDCAT Interactive Study Vault
            <BookOpen className="w-7 h-7 text-sky-400" />
          </h1>

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
              <SEO
          title={`${activeSubject} MDCAT Notes — ${subjectData.chapters.length} Chapters`}
          description={`Complete ${activeSubject} MDCAT syllabus notes with high-yield concepts, board-specific insights, mnemonics, and practice questions across ${subjectData.chapters.length} chapters.`}
          path={`/study-notes/${subjectSlug}`}
        />
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
            <h1 className="text-2xl font-black uppercase tracking-tight">{activeSubject}</h1>
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
// ─── remounts ContentView whenever the chapter id changes, so per-chapter
//     interaction state (answers, chats, generated notes) always starts fresh ───
function ContentViewWrapper({ onSelectQuiz }: { onSelectQuiz?: (id: number) => void }) {
  const { chapterId } = useParams();
  return <ContentView key={chapterId} onSelectQuiz={onSelectQuiz} />;
}
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
      const response = await fetch(mdcatAiApi('/api/mdcat/chat'), {
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
      const response = await fetch(mdcatAiApi('/api/mdcat/chat'), {
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
      <SEO
        title={`${chapterData.title} — ${activeSubject} MDCAT Notes`}
        description={chapterData.shortDesc}
        path={`/study-notes/${subjectSlug}/${chapterId}`}
      />
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
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight">{chapterData.title}</h1>
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