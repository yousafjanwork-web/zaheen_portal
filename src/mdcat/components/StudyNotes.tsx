/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  Award, 
  ChevronRight, 
  Bookmark, 
  CheckCircle, 
  XCircle, 
  Send,
  CornerDownRight,
  Stethoscope,
  Info,
  Zap,
  RotateCcw,
  BookMarked,
  AlertTriangle,
  Flame,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MDCATSubject } from '../types';
import { mdcatApi } from '../config';

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
  weight: string; // MDCAT questions weight
  shortDesc: string;
  // Pre-seeded high-yield microscopic notes
  sections?: {
    heading: string;
    bullets: string[];
  }[];
  detailedContent: string[];
  boardInsights: string; // Provincial board differences
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
            heading: '1. Discovery & Microscopic Foundations',
            bullets: [
              '**Acellular definition**: Viruses correspond to non-cellular entities because they lack cytoplasmic membranes, ribosomes, and independent binary metabolic/fission pathways. They are **obligate intracellular parasites** that only replicate inside host metabolic machinery.',
              '**Chronology of Discovery**: **Louis Pasteur** associated rabies with a pathogen he could not grow in culture. **Charles Chamberland** developed porcelain filters (1884) which held bacteria back but allowed viruses to pass. **Dmitri Ivanowsky** (1892) proved tobacco mosaic sap remained contagious after filtration. **Martinus Beijerinck** coined "contagium vivum fluidum" (soluble living germ), and **Wendell Stanley** (1935) successfully crystallized Tobacco Mosaic Virus (TMV), proving its organic-chemical composition (Nucleoprotein).',
              '**Dimensions & Scale**: Range from 20 nm (Parvovirus/Picovaviruses) up to 250-350 nm (Poxviruses/Vaccinia). Approx 10 to 1000 times smaller than standard bacterial cells.'
            ]
          },
          {
            heading: '2. Nucleocapsid Chemistry & Architectural Symmetry',
            bullets: [
              '**The Virion**: A fully intact, infectious virus particle located in extracellular environments.',
              '**Genome**: Consists of either central DNA or RNA (never both), which can be single-stranded (ss) or double-stranded (ds), linear or circular, segmented or non-segmented.',
              '**Capsid Structural Units**: Protein shell composed of repeating subunits called **capsomeres**. **Adenovirus** (causes respiratory tract infection) has an icosahedral capsid with exactly **252 capsomeres**. **Herpes simplex virus** has **162 capsomeres**.',
              '**Symmetry Categories**: **Icosahedral** (polyhedral with 20 faces, e.g., Polio, Adenovirus), **Helical** (rod-shaped capsomeres wrapped spirally around nucleic acid, e.g., TMV, Influenza), or **Complex** (having extra accessory tails or layers, e.g., T4 Bacteriophage).'
            ]
          },
          {
            heading: '3. Life Cycle of Bacteriophage (Lytic vs. Lysogenic)',
            bullets: [
              '**Lytic Cycle (Virulent cycle)**: 1) **Adsorption**: Phage tail fibers attach weakly to lipopolysaccharide receptors of bacterium cell wall. 2) **Penetration**: Phage lysozyme enzymatically digests a microscopic hole, and the tail sheath contracts to inject viral DNA, leaving empty capsid outside ("ghost"). 3) **Synthesis & Assembly**: Host DNA is degraded; phage DNA codes for enzymes and capsid fibers. 4) **Lysis**: After ~20 minutes, 100-200 new phages burst out, rupturing host cell membrane.',
              '**Lysogenic Cycle (Temperate cycle)**: Viral DNA inserts directly into the host bacterial chromosome, forming a **prophage**. It replicates passively along with host cell division without causing visible damage. Certain environmental stressors (UV light, chemicals) cause the prophage to undergo **induction** (excising itself from chromosome) and enter the virulent lytic cycle.',
              '**Lysogenic Conversion**: The host bacterium can acquire new characteristics and toxins (e.g., Corynebacterium diphtheriae becomes pathogenic only when lysogenized by beta-phage).'
            ]
          },
          {
            heading: '4. Retroviruses & Human Immunodeficiency Virus (HIV)',
            bullets: [
              '**Retrovirus Classification**: Spherical enveloped viruses (~100 nm) containing two identical single-stranded RNA genomes and **Reverse Transcriptase** enzyme.',
              '**Core Receptors & Host Entry**: Glycoprotein knuckles of HIV (**gp120** and core stem **gp41**) bind selectively to human helper T-lymphocytes (**CD4 receptors**) and secondary chemokine co-receptors (CCR5 or CXCR4).',
              '**Reverse Transcription Loop**: Inside target cytoplasm, Reverse Transcriptase transcribes viral RNA -> single stranded DNA -> double stranded viral DNA. Highly error-prone due to absence of proofreading function, driving massive antigenic mutations.',
              '**Integration & Provirus**: Viral **Integrase** inserts double-stranded viral DNA into host nuclear chromatin, creating a permanent **provirus**. It can remain latent or actively transcribe viral mRNAs using host RNA polymerase II.',
              '**Maturation & Cleaving**: Newly assembled immature virions bud out. Viral **Protease** cleaves polyproteins into functional units to make the virus fully infectious.'
            ]
          },
          {
            heading: '5. Viral Hepatitis Spectrum',
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
            heading: '1. Classifying Carbohydrates & Monosaccharide Mechanics',
            bullets: [
              '**Monosaccharides**: Simple sugars characterized by chemical formula (CH2O)n. Categorized into Aldoses (containing aldehyde functional group, e.g., Glucose) and Ketoses (containing ketone functional group, e.g., Fructose). All monosaccharides are reducing sugars.',
              '**Disaccharide structures**: Maltose (Glucose + Glucose, α-1,4 linkage); Lactose (Glucose + Galactose, β-1,4 linkage); Sucrose (Glucose + Fructose, α-1,2 linkage). Because both active reducing/carbonyl carbons are locked in Sucrose, it is a non-reducing sugar.',
              '**Polysaccharide starch branches**: **Amylose** consists of unbranched chains connected purely via α-1,4-glycosidic bonds (soluble in hot water). **Amylopectin** contains highly branched chains featuring both α-1,4 and α-1,6 linkage branches (insoluble in water).'
            ]
          },
          {
            heading: '2. Proteins & Four-Tier Structural Hierarchy',
            bullets: [
              '**Primary Structure**: Linear sequence of amino acids joined via covalent peptide bonds. Governed directly by nucleic acid codons on mRNA.',
              '**Secondary Structure**: Polypeptide folding stabilized by **hydrogen bonding** between C=O and N-H groups of the peptide backbone. Includes stable alpha-helix (exactly 3.6 amino acids per turn) and beta-pleated sheets.',
              '**Tertiary Structure**: Solid, three-dimensional conformational folding of a single peptide chain. Stabilized by interactions between variable R-groups: hydrophobic bonds, hydrogen bonds, ionic/salt bridges, and covalent **disulfide bridges** (-S-S- bonds formed between cysteine residues).',
              '**Quaternary Structure**: Association of multiple polypeptide subunits (e.g., Hemoglobin carrying 4 subgroups, Collagen containing triple helices).'
            ]
          }
        ],
        detailedContent: [
          '**Peptide Bond Formations**: Dehydration synthesis reaction occurring between the carboxyl (COOH) group of one amino acid and the amino (NH2) group of another.',
          '**Disulfide Bridges**: Strong covalent bonds formed between matching thiol (-SH) side-chains of cysteine amino acids, crucial for tertiary thermal stability.',
          '**DNA GC pair vs AT pair**: GC base pairs are bound by 3 hydrogen bonds, while AT base pairs share 2, making GC-rich sequences more stable against thermal denaturation.'
        ],
        boardInsights: 'Punjab textbooks focus heavily on chemical tests (e.g. Benedicts test for reducing sugars, Iodine test turning starch deep blue, glycogen red, cellulose no color). Federal textbooks contain detailed structural calculations for proteins (molecular weight of hemoglobin is 68,000 AMU).',
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
            heading: '1. Fluid Mosaic Membrane Architecture',
            bullets: [
              '**Phospholipid Bilayer**: Provides the fundamental hydrophobic barrier. Phospholipids consist of polar hydrophilic heads (facing external aqueous environments) and non-polar, long, hydrophobic fatty acid tails (oriented inwards).',
              '**Cholesterol Role**: Acts as a fluidity buffer. At high temperatures, it stabilizes membrane movement. At low temperatures, it prevents fatty acids from packing tightly together and crystallizing.',
              '**Proteins**: **Integral/Transmembrane proteins** span the entire bilayer, acting as passive ion channels or active pumps. **Peripheral proteins** are loosely bound to the cytoplasm or extracellular surface.'
            ]
          },
          {
            heading: '2. Eukaryotic Organelles and Cellular Labor',
            bullets: [
              '**Double-Membrane Organelles**: Plastids, Mitochondria, and the Nucleus. Mitochondria host the respiratory Tricarboxylic Acid (TCA/Krebs) cycle and electron transport chain on the folded **cristae**.',
              '**Single-Membrane Organelles**: Endoplasmic reticulum, Golgi complex, Lysosomes, and Peroxisomes.',
              '**Acellular/Non-Membrane Organelles**: Ribosomes (assembled in the nucleolus) and Centrioles (composed of a 9+0 triplet microtubule array).'
            ]
          }
        ],
        detailedContent: [
          '**Ribosomal Subunits**: Eukaryotes possess 80S ribosomes (60S + 40S subunits); prokaryotes possess 70S ribosomes (50S + 30S subunits).',
          '**Proton ATPases**: Lysosomal membranes actively maintain an interior acidic pH (~4.5) by pumping H+ ions from the cytosol using ATP hydrolysis.',
          '**Centrioles**: Direct the formation of mitotic spindle fibers during eukaryotic chromosome segregation.'
        ],
        boardInsights: 'KMU (KPK) questions focus on plant cell walls showing middle lamella composition containing calcium and magnesium pectate. UHS (Punjab) quizzes details about glyoxysomes (convert fatty acids to sugars in lipid-rich seeds).',
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
        sections: [
          {
            heading: '1. Mechanism of Enzymatic Catalysis',
            bullets: [
              '**Catalytic Action**: Enzymes are globular proteins that accelerate chemical reactions by lowering the **activation energy (Ea)** boundary, without altering the overall thermodynamic free energy change (ΔG) or equilibrium constant (Kc).',
              '**Active Site Zones**: Comprises a **binding site** (selects and holds the substrate molecule using weak hydrogen/ionic bonds) and a **catalytic site** (enzymatically transforms substrate to product).',
              '**Catalytic Models**: Emil Fischer\'s **Lock and Key Model** (rigid active site). Daniel Koshland\'s **Induced Fit Model** (flexible active site that changes conformation slightly upon substrate binding to optimize catalytic orientation).'
            ]
          },
          {
            heading: '2. Enzyme Inhibitors (Competitive vs. Non-Competitive)',
            bullets: [
              '**Competitive Inhibitors**: Structurally resemble the substrate. Bind directly to the **active site**. Can be overcome by increasing substrate concentration. Increases Km, but Vmax remains unchanged.',
              '**Non-Competitive Inhibitors**: Bind to an **allosteric site** (a site other than the active site). This structurally distorts the active site, preventing catalysis. Cannot be overcome by adding more substrate. Vmax decreases, while Km remains unchanged.'
            ]
          }
        ],
        detailedContent: [
          '**Coenzymes**: Loose, organic helper molecules (e.g., NAD, FAD) transiently carrying chemical groups between enzymes.',
          '**Prosthetic Groups**: Covalently bonded organic or organometallic structures (e.g., heme group inside peroxidase/catalase).',
          '**Inhibitor examples**: Malonate is a competitive inhibitor of succinate dehydrogenase. Cyanide binds to the iron atom inside cytochrome oxidase, halting respiration.'
        ],
        boardInsights: 'Sindh textbooks detail enzyme classification categories (Oxidoreductases, Transferases, Hydrolases, Lyases, Isomerases, Ligases) and cover competitive malonate reactions extensively.',
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
        weight: '8% of Biology Marks (Crucial Chapter)',
        shortDesc: 'Light harvesting complexes, Calvin cycle, Glycolysis splits, Krebs reactions, and ATP yields.',
        detailedContent: [
          '**Light Harvesting Complexes**: Chlorophyll contains a porphyrin ring with a central **magnesium (Mg²⁺)** atom, which absorbs red and blue light waves while reflecting green.',
          '**Non-Cyclic Photophosphorylation (Z-Scheme)**: Photons excite electrons in Photosystem II (P680) -> passes via plastoquinone (PQ), cytochrome b6f complex, and plastocyanin (PC) -> Photosystem I (P700) -> ferredoxin -> NADP+ Reductase to synthesize NADPH. Involves water photolysis to release O2 and protons.',
          '**Calvin Cycle (Dark Reactions)**: 1) Carbon fixation: RuBP (5C) reacts with CO2 using Rubisco to generate 3-phosphoglycerate (3-PGA). 2) Reduction: 3-PGA is phosphorylated by ATP and reduced by NADPH to form glyceraldehyde 3-phosphate (G3P). 3) RuBP regeneration: Requires ATP.',
          '**Glycolysis Splits**: Occurs in the cytoplasm. Converts 1 glucose (6C) into 2 pyruvates (3C), generating a net of 2 ATP and 2 NADH molecules through substrate-level phosphorylation.',
          '**Krebs Cycle (Mitochondrial Matrix)**: Acetyl-CoA (2C) combines with oxaloacetate (OAA, 4C) to form citrate (6C). Each turns of Krebs cycle generates 3 NADH, 1 FADH2, and 1 GTP/ATP.',
          '**Electron Transport Chain (ETC)**: NADH transfers electrons to Complex I, while FADH2 transfers electrons to Complex II. Coenzyme Q and cytochrome c shuttle electrons to oxygen (the final electron acceptor). Cytochrome c contains a crucial iron cofactor.'
        ],
        boardInsights: 'Federal/Sindh textbooks calculate energy yields precisely (1 NADH yields ~2.5 ATP, 1 FADH2 yields ~1.5 ATP via oxidative phosphorylation). Punjab books still mention the older values (1 NADH = 3 ATP, 1 FADH2 = 2 ATP). Under the modern curriculum, the total yield of 1 glucose molecule is 30 or 32 ATP.',
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
            explanation: 'Chlorophyll contains a central Magnesium (Mg²⁺) atom surrounded by a nitrogen-containing porphyrin head. Hemoglobin has an Iron atom instead.'
          }
        ]
      },
      {
        id: 'bio-ch6',
        title: 'Gaseous Exchange & Respiratory Surface',
        weight: '5% of Biology Marks',
        shortDesc: 'Gas transport, oxygen dissociation curves, and homeostatic lung volumes.',
        detailedContent: [
          '**Respiratory Membrane**: Built for rapid diffusion. Thin epithelial cell walls, massive surface area, and extensive networks of blood capillaries.',
          '**Oxygen Transport**: 97% of oxygen binds reversibly to the iron groups inside hemoglobin to form **oxyhemoglobin**.',
          '**Carbon Dioxide Transport Pathways**: 70% as chemical bicarbonate (HCO3⁻) ions inside plasma (catalyzed by **carbonic anhydrase** inside erythrocytes), 23% as carbaminohemoglobin, and 7% dissolved in plasma.',
          '**Bohr Effect**: Decreases hemoglobins affinity for oxygen in regions with low pH, high pCO2, and elevated temperatures (typically in micro-capillaries of hard-working tissues), shifting the oxygen-hemoglobin dissociation curve to the right to release O2.'
        ],
        boardInsights: 'Federal board exams ask direct questions about lung volumes. Tidal volume (resting exchange) is ~500mL, Vital Capacity is ~4600mL, and Residual Volume (trapped/non-collapsed gas) is ~1200mL.',
        mnemonics: [
          '**"CO2 turns to Carbonic fast"**: Carbonic anhydrase is the zinc-containing enzyme inside RBCs that accelerates CO2 + H2O <=> H2CO3.'
        ],
        samples: [
          {
            id: 1108,
            questionText: 'In what chemical state is the largest fraction (~70%) of metabolic carbon dioxide transported within human systemic blood?',
            optionA: 'Carbaminohemoglobin complexes',
            optionB: 'Bicarbonate ions (HCO3-) dissolved in plasma',
            optionC: 'Free dissolved CO2 gas in cytoplasm',
            optionD: 'Carbon monoxide compounds',
            correctOption: 'B',
            explanation: 'Most CO2 diffuses into red blood cells, where carbonic anhydrase converts it into carbonic acid (H₂CO₃), which dissociates into hydrogen ions (H⁺) and bicarbonate ions (HCO₃⁻).'
          }
        ]
      },
      {
        id: 'bio-ch7',
        title: 'Fluid Transport & Circulation',
        weight: '7% of Biology Marks',
        shortDesc: 'Cardiac cycles, nodal regulators (SA/AV), vascular differences, and lymphatic filtration.',
        detailedContent: [
          '**Cardiac Pacemakers**: The **Sinoatrial (SA) Node** (right atrium wall) is the primary pacemaker that generates electrical impulses. The **Atrioventricular (AV) Node** introduces a brief electrical delay of 0.1 seconds to allow the ventricles to fill with blood.',
          '**Vessel Architecture**: Arteries have thick, highly elastic wall smooth muscle layers (tunicas) to withstand high ventricular pressures. Veins contain passive one-way valves to prevent backflow and assist low-pressure venous return.',
          '**Capillary Exchanges**: Hydrostatic pressure drives fluid filtration out of capillaries at the arterial end, while oncotic pressure (sustained by blood albumin proteins) draws water back in at the venule end.'
        ],
        boardInsights: 'Sindh biology textbooks detailedly list granulocytes (Neutrophils, Eosinophils, Basophils) and agranulocytes (Monocytes, Lymphocytes) and specify their core life durations in systemic circulation.',
        mnemonics: [
          '**"S-A leads to A-V"**: Signal starts at the **S**inoatrial node and travels to the **A**trioventricular node.'
        ],
        samples: [
          {
            id: 1109,
            questionText: 'Why does the AV node delay the electrical conduction signal by approximately 0.1 seconds?',
            optionA: 'To let the ventricles contract first',
            optionB: 'To allow the atria to fully empty their blood contents into the ventricles',
            optionC: 'To increase the heart rate during exercise',
            optionD: 'To lower systemic arterial blood pressure',
            correctOption: 'B',
            explanation: 'The 0.1-second delay introduced by the AV node ensures the atria contract completely and empty their blood into the ventricles before ventricular contraction begins.'
          }
        ]
      },
      {
        id: 'bio-ch8',
        title: 'Immunity, Antibodies & Vaccines',
        weight: '5% of Biology Marks (High Yield)',
        shortDesc: 'Innate vs adaptive immune responses, cell-mediated vs humoral pathways, and antibody structures.',
        detailedContent: [
          '**Innate Immunity (Non-specific)**: Physical barriers (skin, mucous membranes), chemical agents (stomach HCl, lysozyme in tears), and phagocytic cells (macrophages, neutrophils).',
          '**Adaptive Immunity (Specific)**: Exhibits antigenic specificity, diversity, memory, and self/non-self recognition.',
          '**Humoral Immunity**: B-lymphocytes differentiate into **plasma cells** to produce solute **antibodies** that target extracellular pathogens.',
          '**Cell-Mediated Immunity**: T-lymphocytes (helper CD4+ and cytotoxic CD8+) target intracellular pathogens, infected host cells, and cancer cells.',
          '**Antibody Structure**: Y-shaped glycoprotein composed of two identical light chains and two identical heavy chains connected by disulfide bonds. Contains a variable region (Fab) that binds antigens and a constant region (Fc).'
        ],
        boardInsights: 'Federal syllabus books categorize antibodies into 5 classes: IgG (most abundant, crosses placenta), IgA (present in breast milk and colostrum), IgM (first responder pentamer), IgD (B-cell receptor), and IgE (mediates allergic reactions).',
        mnemonics: [
          '**"G-A-M-E-D"** for Immunoglobulins: **G** (IgG), **A** (IgA), **M** (IgM), **E** (IgE), **D** (IgD).'
        ],
        samples: [
          {
            id: 1110,
            questionText: 'Which class of immunoglobulins is capable of crossing the human placental barrier to provide passive immunity to the developing fetus?',
            optionA: 'IgA',
            optionB: 'IgG',
            optionC: 'IgM',
            optionD: 'IgE',
            correctOption: 'B',
            explanation: 'IgG is the only class of antibodies that can cross the placenta, providing systemic passive protection to the fetus.'
          }
        ]
      },
      {
        id: 'bio-ch9',
        title: 'Homeostasis & Excretory System',
        weight: '6% of Biology Marks',
        shortDesc: 'Osmoregulation, nephron anatomy, countercurrent multiplier, and thermoregulatory systems.',
        detailedContent: [
          '**Nephron Filtration**: Ultrafiltration occurs at the glomerulus. High hydrostatic blood pressure forces small solutes and water out of capillaries into Bowman\'s capsule, leaving behind proteins and blood cells.',
          '**Water Reabsorption**: The descending limb of the Loop of Henle is permeable to water but impermeable to solutes, concentrating the filtrate. The ascending limb is impermeable to water but actively transports NaCl out into the medullary interstitium.',
          '**Hormonal Control**: **Antidiuretic Hormone (ADH/Vasopressin)** increases water permeability in the collecting duct by inserting **aquaporin** channels, yielding concentrated urine. **Aldosterone** stimulates active Na+ reabsorption and K+ secretion.'
        ],
        boardInsights: 'KPK biology books emphasize the osmolarity values in the renal medulla (rising from 300 mOsm/L at the cortex boundary to 1200 mOsm/L in the deep medulla to drive osmosis).',
        mnemonics: [
          '**"A-D-H Holds Water"**: ADH (Antidiuretic Hormone) prevents water excretion, keeping blood circulating volume high.'
        ],
        samples: [
          {
            id: 1111,
            questionText: 'Which nephron segment is structurally impermeable to salt ions while being highly permeable to water?',
            optionA: 'Ascending limb of Loop of Henle',
            optionB: 'Descending limb of Loop of Henle',
            optionC: 'Proximal Convoluted Tubule (PCT)',
            optionD: 'Glomerulus',
            correctOption: 'B',
            explanation: 'The descending limb of the Loop of Henle allows water to exit freely via passive osmosis, increasing the concentration of the remaining filtrate.'
          }
        ]
      },
      {
        id: 'bio-ch10',
        title: 'Support, Bones & Muscle Physiology',
        weight: '5% of Biology Marks',
        shortDesc: 'Skeletal systems, bone growth, sliding filament model, and neuromuscular junction steps.',
        detailedContent: [
          '**Bone Histology**: **Osteoblasts** build bone matrix. **Osteocytes** are mature cells that maintain the matrix. **Osteoclasts** resorb bone matrix list.',
          '**Sliding Filament Theory**: Action potentials release Ca²⁺ from the **sarcoplasmic reticulum** into the sarcoplasm. Ca²⁺ binds to troponin, causing tropomyosin to shift and expose myosin-binding sites on actin filaments.',
          '**Cross-Bridge Cycle**: Myosin heads hydrolyze ATP to enter an "energized" state, bind to actin, and release ADP + Pi to pull the actin filament (the power stroke). Binding of a new ATP molecule releases the myosin head from the actin.'
        ],
        boardInsights: 'UHS exams require memorization of skeletal counts: Axial skeleton has exactly 80 bones, while Appendicular skeleton has 126 bones, totalling 206 bones in adults.',
        mnemonics: [
          '**"A-T-P pulls apart"**: Binding of fresh **ATP** releases the myosin head from the actin filament. Lack of ATP causes rigor mortis!'
        ],
        samples: [
          {
            id: 1112,
            questionText: 'During skeletal muscle contraction, calcium ions released from the sarcoplasmic reticulum bind directly to which regulatory protein?',
            optionA: 'Tropomyosin',
            optionB: 'Troponin',
            optionC: 'Actin',
            optionD: 'Myosin',
            correctOption: 'B',
            explanation: 'Calcium binds directly to troponin, which undergoes a conformational change that pulls tropomyosin away from the active binding sites on the actin filament.'
          }
        ]
      },
      {
        id: 'bio-ch11',
        title: 'Coordination and Control (Nervous & Endocrine)',
        weight: '7% of Biology Marks',
        shortDesc: 'Resting potentials, action potentials, synaptic gaps, and hormonal feed-forward loops.',
        detailedContent: [
          '**Resting Membrane Potential**: Typically -70mV, maintained by the Na+/K+ constant ATPase pumps (3 Na+ out, 2 K+ in) and K+ leak channels.',
          '**Endocrine Hormones**: Includes peptide/protein hormones (insulin, glucagon, ADH; bind to extracellular receptors) and lipid-derived steroid hormones (aldosterone, estrogen, cortisol; bind to intracellular receptors).'
        ],
        boardInsights: 'Punjab textbooks focus on reflexes. Federal textbooks prioritize details of action potential graphs, showing positive hyperpolarization thresholds.',
        mnemonics: [
          '**"Resting is negative"**: The interior of a resting neuron is always negative (-70mV) relative to the exterior.'
        ],
        samples: [
          {
            id: 1113,
            questionText: 'What generates the initial rapid depolarization phase of a neural action potential?',
            optionA: 'Active transport of K+ ions',
            optionB: 'Opening of voltage-gated Na+ channels',
            optionC: 'Closing of chloride channels',
            optionD: 'Inward pumping of calcium',
            correctOption: 'B',
            explanation: 'Sensory stimuli trigger voltage-gated Na+ channels to open rapidly, causing Na+ ions to rush into the cell down their electrochemical gradient.'
          }
        ]
      },
      {
        id: 'bio-ch12',
        title: 'Reproduction & Developmental Stages',
        weight: '6% of Biology Marks',
        shortDesc: 'Menstrual hormonal cycle, gametogenesis, and developmental steps.',
        detailedContent: [
          '**Male Gametogenesis**: Luteinizing Hormone (LH) stimulates **Leydig cells** to produce testosterone. Follicle-Stimulating Hormone (FSH) stimulates **Sertoli cells** to promote spermatogenesis.',
          '**Uterine/Menstrual Cycle**: FSH stimulates follicular growth. A surge in LH triggers **ovulation** at day 14. The ruptured follicle becomes the **corpus luteum**, which secretes progesterone to maintain the uterine lining.'
        ],
        boardInsights: 'The PMDC syllabus tests understanding of the menstrual cycle stages in detail (Follicular, Luteal, Menstrual). Know the dates and relative hormone concentrations.',
        mnemonics: [
          '**"L-H drives L-e-y-d-i-g"**: **LH** stimulates **Leydig** cells to secrete testosterone.'
        ],
        samples: [
          {
            id: 1114,
            questionText: 'A surge in which hormone is directly responsible for triggering ovulation around day 14 of the menstrual cycle?',
            optionA: 'FSH',
            optionB: 'Progesterone',
            optionC: 'LH (Luteinizing Hormone)',
            optionD: 'Estrogen',
            correctOption: 'C',
            explanation: 'An LH surge at day 14 triggers the mature follicle to rupture, releasing the secondary oocyte from the ovary.'
          }
        ]
      },
      {
        id: 'bio-ch13',
        title: 'Growth and Development in Animals',
        weight: '4% of Biology Marks',
        shortDesc: 'Embryogenesis, gastrulation, germ layer derivatives, and active regeneration.',
        detailedContent: [
          '**Cleavage Splits**: Rapid mitotic divisions of the zygote without cellular growth, forming a solid ball of blastomere cells called a **morula**.',
          '**Gastrulation**: Cell rearrangements that establish the three primary germ layers: **ectoderm** (gives rise to nervous system and skin), **mesoderm** (muscles and skeleton), and **endoderm** (digestive tract organs).'
        ],
        boardInsights: 'Board questions focus on identifying tissue origins of the three germ layers (e.g. cardiac muscle originates from the mesoderm).',
        mnemonics: [
          '**"Ectoderm is Exterior"**: Ectoderm gives rise to exterior tissues like epidermis, hair, and the nervous system.'
        ],
        samples: [
          {
            id: 1115,
            questionText: 'Which primary germ layer gives rise to the blood vessels, bones, and skeletal muscles in vertebrate embryos?',
            optionA: 'Ectoderm',
            optionB: 'Mesoderm',
            optionC: 'Endoderm',
            optionD: 'Blastoderm',
            correctOption: 'B',
            explanation: 'The mesoderm gives rise to vascular systems, skeletal frameworks, excretory organs, and muscles.'
          }
        ]
      },
      {
        id: 'bio-ch14',
        title: 'Chromosomes and DNA Replication',
        weight: '5% of Biology Marks',
        shortDesc: 'DNA double-helix organization, DNA polymerases, replication forks, and transcription machinery.',
        detailedContent: [
          '**DNA Structure**: Semi-conservative replication. Helical backbones consist of alternating deoxyribose sugar and phosphate groups linked via phosphodiester bonds.',
          '**Replication Enzymes**: **Helicase** unwinds DNA. **Primase** synthesizes RNA primers. **DNA Polymerase III** copy-builds the leading and lagging (Okazaki fragment) strands. **DNA Ligase** seals nicks on the lagging strand.'
        ],
        boardInsights: 'Federal books include extensive descriptions of Hershey-Chase and Meselson-Stahl experiments, which proved DNA is genetic and replicates semi-conservatively.',
        mnemonics: [
          '**"Ligase Links Lagging"**: **Ligase** seals the phosphodiester backbone of Okazaki fragments on the **lagging** strand.'
        ],
        samples: [
          {
            id: 1116,
            questionText: 'Which enzyme synthesizes short RNA primers necessary for DNA polymerase activity during replication?',
            optionA: 'Helicase',
            optionB: 'Primase',
            optionC: 'Gyrase',
            optionD: 'Ligase',
            correctOption: 'B',
            explanation: 'DNA polymerase cannot initiate synthesis de novo; it requires a free 3\'-OH group provided by the RNA primers synthesized by primase.'
          }
        ]
      },
      {
        id: 'bio-ch15',
        title: 'Cell Cycle & Division',
        weight: '4% of Biology Marks',
        shortDesc: 'Mitosis, meiosis stages, non-disjunction errors, and apoptosis controls.',
        detailedContent: [
          '**Interphase Stages**: G1 (growth and enzyme synthesis), S (DNA replication), G2 (pre-mitotic checks, tubulin synthesis).',
          '**Meiotic Prophase I**: Leptotene, Zygotene (synapsis begins, forming bivalents), Pachytene (crossing over occurs), Diplotene (chiasmata become visible), Diakinesis (nucleolus disappears).'
        ],
        boardInsights: 'Sindh textbooks emphasize meiotic chromosomal anomalies like Downs (trisomy 21), Turners (45, XO), and Klinefelters (47, XXY) syndromes.',
        mnemonics: [
          '**"Lazy Zebra Plays Double Drums (LZPDD)"**: Prophase I stages in sequence: **L**eptotene, **Z**ygotene, **P**achytene, **D**iplotene, **D**iakinesis.'
        ],
        samples: [
          {
            id: 1117,
            questionText: 'During which precise stage of meiotic prophase I does chromosomal crossing over and genetic recombination occur?',
            optionA: 'Zygotene',
            optionB: 'Pachytene',
            optionC: 'Diplotene',
            optionD: 'Leptotene',
            correctOption: 'B',
            explanation: 'Crossing over (exchange of genetic material between non-sister chromatids) occurs during the pachytene stage of prophase I.'
          }
        ]
      },
      {
        id: 'bio-ch16',
        title: 'Variation, Genetics & Inheritance Laws',
        weight: '6% of Biology Marks',
        shortDesc: 'Mendelian laws, incomplete dominance, epistasis, and sex-linked traits.',
        detailedContent: [
          '**Mendel\'s First Law (Segregation)**: Two alleles for a gene separate during gamete formation, so each gamete receives only one allele.',
          '**Mendel\'s Second Law (Independent Assortment)**: Alleles of different genes assort independently of one another during gamete formation (only applies to genes on different chromosomes or far apart on the same chromosome).'
        ],
        boardInsights: 'Board exams require solving rapid genetic cross probability calculations (such as dihybrid ratios: 9:3:3:1).',
        mnemonics: [
          '**"Dominant is Expressed"**: Dominant alleles mask recessive ones in simple heterozygous genotypes.'
        ],
        samples: [
          {
            id: 1118,
            questionText: 'What is the theoretical phenotypical ratio expected in a classical Mendelian dihybrid cross with independent assortment of alleles?',
            optionA: '3:1',
            optionB: '9:3:3:1',
            optionC: '1:2:1',
            optionD: '9:7',
            correctOption: 'B',
            explanation: 'A cross between two heterozygotes for two genes yields a phenotypic ratio of 9:3:3:1.'
          }
        ]
      },
      {
        id: 'bio-ch17',
        title: 'Biotechnology, PCR & Recombinant DNA',
        weight: '5% of Biology Marks',
        shortDesc: 'PCR steps, restriction endonucleases, vectors, DNA profiling, and gene therapy.',
        detailedContent: [
          '**Restriction Enzymes**: Endonucleases that cut DNA at specific palindromic sequences, creating "sticky" or "blunt" ends.',
          '**Polymerase Chain Reaction (PCR)**: 1) Denaturation (~94°C) to separate DNA strands. 2) Annealing (~55°C) for primers to bind. 3) Extension (~72°C) via heat-stable **Taq Polymerase**.'
        ],
        boardInsights: 'KMU/UHS exams frequently query details of Taq Polymerase isolated from Thermus aquaticus, a thermophilic bacterium.',
        mnemonics: [
          '**"D-A-E"** for PCR: **D**enature, **A**nneal, **E**xtend.'
        ],
        samples: [
          {
            id: 1119,
            questionText: 'At which temperature does Taq polymerase optimally synthesize complementary DNA strands during the PCR cycle?',
            optionA: '94 degrees C',
            optionB: '55 degrees C',
            optionC: '72 degrees C',
            optionD: '37 degrees C',
            correctOption: 'C',
            explanation: 'Denaturation occurs at ~94°C, annealing at ~55°C, and elongation/extension by Taq polymerase is performed optimally at ~72°C.'
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
        detailedContent: [
          '**Le Chatelier\'s Principle**: If a dynamic system is subjected to change in temperature, pressure, or concentration, the system shifts to counteract that stress.',
          '**Pressure Effects**: Increasing pressure shifts equilibrium towards the side with fewer gas molecules. If delta N of dry gas is 0 (e.g., H2 + I2 <=> 2HI), pressure modifications do not affect equilibrium position.',
          '**Kc vs. Kp**: Kp = Kc(RT)^(Δn). If Δn > 0, Kp > Kc. If Δn < 0, Kp < Kc. Kc is affected ONLY by changes in temperature.',
          '**Activation Energy (Ea)**: The minimum energy barrier reactants must overcome to convert to products. Catalysts speed up reactions by offering alternative mechanisms with lower activation energies, without affecting the Kc equilibrium constant.'
        ],
        boardInsights: 'Federal chemistry books include complex mathematical questions on solubility product constant (Ksp) calculations. Punjab books require memorizing exact optimum values for Haber\'s ammonia process (temperature around 450°C and 200 atm pressure with iron catalyst).',
        mnemonics: [
          '**"Kc stays stable"**: Remember that adding pressure, volume, concentration, or inert gas changes the reaction quotient Q, but **ONLY temperature** can change the actual Kc value!'
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
            explanation: 'Since the reaction is exothermic, a lower temperature shifts it forward (Le Chatelier). Since Δn is negative (4 moles reactant -> 2 moles product), elevated pressure shifts it forward towards fewer gas moles.'
          }
        ]
      },
      {
        id: 'chem-ch2',
        title: 'Gas Laws & Ideal Behavior',
        weight: '6-8 MCQs in MDCAT syllabus',
        shortDesc: 'Ideal gas constant R configurations, Boyles/Charles rules, and real gas deviations.',
        detailedContent: [
          '**Ideal Gas Equation**: PV = nRT. Here, R is the universal gas constant.',
          '**Values of R**: R = 8.314 J mol⁻¹ K⁻¹ in SI units. Under standard volumetric conditions (liter-atmospheres), R = 0.0821 dm³ atm mol⁻¹ K⁻¹.',
          '**Real Gas Deviations**: Real gases deviate from ideality under **high pressure** and **low temperature** because intermolecular attractive forces dominate and molecular volume is no longer negligible.',
          '**Van der Waals Correction**: [P + a(n/v)²][V - nb] = nRT. Value of "a" measures intermolecular cohesion forces, while "b" measures the co-volume (excluded size) of real gas molecules.'
        ],
        boardInsights: 'Sindh books typically include heavier calculation questions on Graham\'s Law of Diffusion. Remember that the rate of diffusion is inversely proportional to the square root of the molecular weight: Rate1/Rate2 = √(M2/M1).',
        mnemonics: [
          '**"PLIGHT"**: Gases behave **ideally** under **L**ow **P**ressure and **H**igh **T**emperature (P-Low, H-Temp).'
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
        detailedContent: [
          '**Coulomb\'s Law**: F = k (q1 q2) / r², where k = 1 / (4 π ε₀) ≈ 9 × 10⁹ N m² C⁻² in vacuum. If a dielectric medium with relative permittivity εr is placed between charges, the electrostatic force decreases by a factor of εr.',
          '**Electric Potential (V)**: The work done per unit charge in moving a dry test charge from infinity to that point. V = k q / r (scalar quantity, in Volts).',
          '**Gauss\'s Theorem**: Total electric flux through any closed Gaussian surface equals 1/ε₀ times the total enclosed charge. Φ = Q_enclosed / ε₀.',
          '**Capacitance Storage**: C = ε₀ A / d. Energy stored inside a capacitor is held in the electric field between plates: E = 1/2 C V².'
        ],
        boardInsights: 'Questions regarding series vs. parallel capacitors are common. In series: 1/Ceq = 1/C1 + 1/C2 (charge Q remains constant, voltage divides). In parallel: Ceq = C1 + C2 (voltage remains constant, charge divides).',
        mnemonics: [
          '**"Capacitors are Opposite to Resistors"**: Series capacitors sum up like parallel resistors, and parallel capacitors sum directly!'
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
        detailedContent: [
          '**The Core Rule**: Singular subjects require singular verbs, plural subjects require plural verbs. It sounds simple, but intervening modifiers try to disrupt this concord.',
          '**Intervening Modifiers**: "The quality of these mangoes is excellent" (not *are*). The subject is "quality", which is singular; "mangoes" is an object of the preposition.',
          '**Correlative Conjunctions**: With "either...or", "neither...nor", or "not only...but also", the verb must agree with the **closer** grammatical subject (e.g., "Neither the teacher nor the students are arriving" vs. "Neither the students nor the teacher is arriving").',
          '**Collective Nouns**: Generally singular when acting as a unified body (e.g., "The jury was unanimous in its verdict"), but plural when acting individually (e.g., "The jury were divided in their molecular evaluations").'
        ],
        boardInsights: 'The PMDC exams test sentences containing words like "as well as", "along with", "together with", and "accompanied by". In these cases, the verb always agrees with the **first** subject mentioned (e.g., "The captain, along with his crew members, is/was safe").',
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
            explanation: 'The head subject of the sentence is "The team", which is singular. Parenthetical additions like "along with..." do not alter the singular subject structure, requiring "is conducting".'
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
        detailedContent: [
          '**Syllogistic Rules**: Check the truth value of conclusions based on given statements (premises). Avoid using real-world biases; analyze statements literally.',
          '**Venn Representations**: Construct overlapping circles. "All doctors are smart" -> circle "doctors" is placed fully inside circle "smart". "Some doctors are tall" -> circle "tall" intersects circle "doctors".',
          '**Negative Corollaries**: In syllogistic statements, a negative premise requires a negative conclusion. Two negative premises yield no valid logical conclusion.'
        ],
        boardInsights: 'MDCAT logical reasoning questions are extremely clear-cut. They rarely involve high-level calculus, focusing instead on rapid visual/logical pattern recognition. Always draw scratch diagrams during the exam.',
        mnemonics: [
          '**"Premises Drive Truth"**: Do not assume truth of things not explicitly specified in the premises. Keep logic absolute.'
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
            explanation: 'Since cardiologists are inside medical graduates, and some graduates are researchers, there is an open intersection possibility. D represents the only sound potential deduction.'
          }
        ]
      }
    ]
  }
];

interface StudyNotesProps {
  onBack?: () => void;
  onSelectQuiz?: (id: number) => void;
}

export default function StudyNotes({ onBack, onSelectQuiz }: StudyNotesProps) {
  const [activeSubjectTab, setActiveSubjectTab] = useState<MDCATSubject>('Biology');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('bio-ch1');
  
  // MCQ Interactive verification state
  const [userSelectedAnswers, setUserSelectedAnswers] = useState<Record<number, string>>({});
  
  // Dynamic Live Full Textbook Generation state
  const [generatedTextbooks, setGeneratedTextbooks] = useState<Record<string, string>>({});
  const [isGeneratingTextbook, setIsGeneratingTextbook] = useState(false);

  // AI Interactive Workspace Chat log state
  const [aiWorkspaceChats, setAiWorkspaceChats] = useState<Record<string, { q: string; a: string }[]>>({});
  const [customUserQuery, setCustomUserQuery] = useState('');
  const [isAiAnswering, setIsAiAnswering] = useState(false);

  // Filter subject data
  const activeSubjectData = STUDY_DATA.find(s => s.subject === activeSubjectTab) || STUDY_DATA[0];
  const activeChapterData = activeSubjectData.chapters.find(c => c.id === selectedChapterId) || activeSubjectData.chapters[0];

  const handleSubjectChange = (subject: MDCATSubject) => {
    setActiveSubjectTab(subject);
    const firstChapter = STUDY_DATA.find(s => s.subject === subject)?.chapters[0];
    if (firstChapter) {
      setSelectedChapterId(firstChapter.id);
    }
  };

  const handleVerifyOption = (qId: number, selectedOption: string) => {
    setUserSelectedAnswers(prev => ({
      ...prev,
      [qId]: selectedOption
    }));
  };

  // Generate highly localized textbook chapter sheets utilizing server-side Gemini API
  const handleGenerateFullTextbook = async () => {
    const chapterId = activeChapterData.id;
    if (isGeneratingTextbook) return;

    setIsGeneratingTextbook(true);
    try {
      const response = await fetch(mdcatApi('/api/mdcat/ai/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Act as a senior writer for mdcatprep.com and an elite PMDC medical entry exam preparation mentor.
Generate an incredibly comprehensive, highly academic, and ultra-detailed textbook study sheet for:
Subject: "${activeSubjectTab}"
Chapter Title: "${activeChapterData.title}" (ID: ${chapterId})
PMDC Weight: "${activeChapterData.weight}"

Your textbook block MUST incorporate:
1. **FULL ACADEMIC INSIGHTS**: Deep dive into every core mechanism (for example, if this is Acellular Life, detail Charles Chamberland, Ivanowsky filtration, viral dimensions of parvovirus vs poxvirus, adenovirus/herpes capsomere counts 252 vs 162, retrovirus reverse transcription, lytic and lysogenic transduction induction). Make it read like a genuine premium resource!
2. **PROVINCIAL BOARDS COMPARISONS**: Formulate clear distinct bullet headings on what "Punjab (UHS) vs Sindh (MD-CAT) vs KPK (KMU) vs Federal (SZABMU) Baluchistan" textbooks highlight or differ on.
3. **HIGH-YIELD CRITICAL REVISIONS & FORMULAS**: Bold terms, exact figures, structural metrics, biological rules.
4. **MEMORABLE MNEMONICS**: Add 2 highly intelligent dual-language mnemonic memory hooks.
5. **DISSOCIATION TRAPS**: List 3 common "past paper traps" or tricky concepts that students frequently confuse on actual MDCAT exam day.

Maintain a deeply serious, professional, and friendly academic tone. Use clear spacing, bullet points, and highly professional English, supplemented with helpful Roman-Urdu annotations in brackets only to make complex points easy to remember.`,
          subject: activeSubjectTab,
          language: 'Bilingual (English + Urdu references)'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedTextbooks(prev => ({
          ...prev,
          [chapterId]: data.reply
        }));
      } else {
        throw new Error('API server rejected request');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to Zaheen AI textbook engine. Check your connection or retry in a moment!');
    } finally {
      setIsGeneratingTextbook(false);
    }
  };

  const getBadgeColor = (subject: MDCATSubject) => {
    switch (subject) {
      case 'Biology': return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'Chemistry': return 'text-amber-700 bg-amber-50 border-amber-100';
      case 'Physics': return 'text-purple-700 bg-purple-50 border-purple-100';
      case 'English': return 'text-blue-700 bg-blue-50 border-blue-100';
      default: return 'text-rose-700 bg-rose-50 border-rose-100';
    }
  };

  const getSubjectIconColor = (subject: MDCATSubject) => {
    switch (subject) {
      case 'Biology': return 'text-emerald-500';
      case 'Chemistry': return 'text-amber-500';
      case 'Physics': return 'text-purple-500';
      case 'English': return 'text-blue-500';
      default: return 'text-rose-500';
    }
  };

  // Submit direct chat question to Zaheen AI Coach
  const handleSendQueryToAI = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customUserQuery.trim() || isAiAnswering) return;

    const queryText = customUserQuery;
    setCustomUserQuery('');
    setIsAiAnswering(true);

    const currentChapterId = activeChapterData.id;
    const currentHistory = aiWorkspaceChats[currentChapterId] || [];
    setAiWorkspaceChats(prev => ({
      ...prev,
      [currentChapterId]: [...currentHistory, { q: queryText, a: 'Zaheen Tutor is generating a comprehensive textbook-level response...' }]
    }));

    try {
      const response = await fetch(mdcatApi('/api/mdcat/ai/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Regarding the MDCAT chapter "${activeChapterData.title}" (${activeSubjectTab}):\n\nStudent asks: "${queryText}"\n\nProvide an extremely clear, accurate, and highly academic explanation conforming to UHS/KPK/Sindh board standards. Highlight any useful exam tips, formulas, or provincial distinctions.`,
          subject: activeSubjectTab,
          language: 'Bilingual (English + Urdu explanations in bracket annotations)'
        })
      });

      if (response.ok) {
        const result = await response.json();
        setAiWorkspaceChats(prev => {
          const freshList = [...(prev[currentChapterId] || [])];
          if (freshList.length > 0) {
            freshList[freshList.length - 1] = { q: queryText, a: result.reply };
          }
          return { ...prev, [currentChapterId]: freshList };
        });
      } else {
        throw new Error('API server rejected request');
      }
    } catch (err) {
      setAiWorkspaceChats(prev => {
        const freshList = [...(prev[currentChapterId] || [])];
        if (freshList.length > 0) {
          freshList[freshList.length - 1] = { q: queryText, a: 'Connection failed. Please retry your inquiry in a second!' };
        }
        return { ...prev, [currentChapterId]: freshList };
      });
    } finally {
      setIsAiAnswering(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Dynamic Cover Card */}
      <div className="bg-sky-950 p-6 md:p-8 rounded-3xl text-white relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 card-shadow border border-sky-900">
        <div className="space-y-2 z-10 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[9px] font-black uppercase text-amber-300 bg-amber-500/15 border border-amber-400/30 rounded-md tracking-wider">
              PMDC 100% Syllabus Coverage
            </span>
            <span className="px-2.5 py-0.5 text-[9px] font-black uppercase text-sky-200 bg-sky-500/15 border border-sky-400/30 rounded-md tracking-wider">
              17 Biology Chapters Complete
            </span>
          </div>
          <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-2">
            MDCAT Interactive Study Vault <BookOpen className="w-6 h-6 text-sky-400" />
          </h2>
          <p className="text-xs text-sky-200/80 font-semibold leading-relaxed">
            Unravel high-yield textbook concepts, anatomical structures, physical laws, and formulas mapped to the National Syllabus. Instantly switch chapters or initiate our **Zaheen AI Textbook Expander** to access premium deep-dive notes with provincial board breakdowns!
          </p>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none text-[12rem] text-white">
          🧬
        </div>
      </div>

      {/* Subjects Switcher row */}
      <div className="bg-white p-2.5 rounded-2xl border border-sky-100 card-shadow flex flex-wrap gap-2">
        {(['Biology', 'Chemistry', 'Physics', 'English', 'Logical Reasoning'] as MDCATSubject[]).map((subj) => {
          const isActive = activeSubjectTab === subj;
          return (
            <button
              key={subj}
              onClick={() => handleSubjectChange(subj)}
              className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 ${isActive ? 'bg-sky-600 text-white shadow-md' : 'text-sky-950 hover:bg-sky-50/50'}`}
            >
              <Stethoscope className={`w-4 h-4 ${isActive ? 'text-white font-black' : getSubjectIconColor(subj)}`} />
              <span>{subj}</span>
            </button>
          );
        })}
      </div>

      {/* Main Study Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Hand: Detailed Chapter Navigation rail */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-sky-100 card-shadow space-y-4">
            <div className="flex items-center justify-between border-b border-sky-50 pb-2">
              <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest flex items-center gap-1">
                <Layers className="w-4 h-4 text-sky-500" /> {activeSubjectTab} Syllabus Chapters
              </span>
              <span className="text-[10px] bg-sky-50 font-black px-2 py-0.5 rounded-lg text-sky-700">
                {activeSubjectData.chapters.length} Topics
              </span>
            </div>
            
            {/* Scrollable list content */}
            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1 scrollbar-thin">
              {activeSubjectData.chapters.map((ch, idx) => {
                const isSelected = selectedChapterId === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChapterId(ch.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer group ${isSelected ? 'bg-sky-50 border-sky-200 ring-1 ring-sky-100 shadow-sm' : 'bg-transparent border-transparent hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center justify-between gap-2 w-full">
                      <span className={`text-[9px] font-black uppercase ${isSelected ? 'text-sky-600' : 'text-slate-400'}`}>
                        Chapter {idx + 1} • {ch.id.toUpperCase()}
                      </span>
                      <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-100/40 text-sky-900 border border-sky-100/50">
                        High Weight
                      </span>
                    </div>
                    <span className="text-xs font-black text-sky-950 uppercase tracking-tight group-hover:text-sky-600 transition-colors">
                      {ch.title}
                    </span>
                    <p className="text-[10px] text-slate-500 font-semibold line-clamp-1 leading-relaxed">
                      {ch.shortDesc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Custom Interactive Expansion Note */}
            <div className="p-4 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl space-y-1.5">
              <p className="text-[9px] font-black text-violet-700 uppercase flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-violet-500 animate-bounce" /> Need deeper textbooks?
              </p>
              <p className="text-[10px] text-slate-700 font-semibold leading-relaxed">
                Click any chapter in the list, then trigger the **Zaheen AI Textbook Expander** on the right to auto-generate a comprehensive study sheet in real-time!
              </p>
            </div>
          </div>
        </div>

        {/* Right Hand: Detailed Chapter Notes Panel with Live Expansion and Verification Questions */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-sky-100 card-shadow space-y-8">
            
            {/* Chapter overview header */}
            <div className="border-b border-sky-50 pb-5 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border self-start ${getBadgeColor(activeSubjectTab)}`}>
                  {activeSubjectTab} Reference Material
                </span>
                <span className="text-[11px] text-zinc-500 font-semibold flex items-center gap-1 bg-zinc-50 border border-zinc-150 px-2 py-0.5 rounded">
                  Syllabus Weight: <strong className="text-sky-950 font-black">{activeChapterData.weight}</strong>
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-sky-950 uppercase tracking-tight">
                {activeChapterData.title}
              </h3>
              <p className="text-xs text-slate-550 font-black italic max-w-2xl leading-relaxed">
                "{activeChapterData.shortDesc}"
              </p>
            </div>

            {/* Dynamic AI Textbook Expander Trigger Trigger Header */}
            <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md overflow-hidden relative group">
              <div className="space-y-1 z-10">
                <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-violet-100 bg-white/15 rounded-md">
                  Premium Interactive Study
                </span>
                <h4 className="text-sm font-black uppercase tracking-tight flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-violet-200 fill-violet-300 animate-pulse" /> Zaheen AI Textbook Expander 🧠
                </h4>
                <p className="text-[10px] text-violet-100 font-semibold max-w-md leading-relaxed">
                  Generate highly-detailed notes for this chapter including detailed molecular structures, formulas, provincial board comparisons, and clinical diagnosis pitfalls!
                </p>
              </div>
              <button
                onClick={handleGenerateFullTextbook}
                disabled={isGeneratingTextbook}
                className="z-10 px-4 py-2.5 bg-white hover:bg-violet-50 text-violet-750 font-black uppercase text-[10px] tracking-wider rounded-xl shadow transition duration-200 cursor-pointer disabled:opacity-50 shrink-0 select-none flex items-center gap-1.5 active:scale-95"
              >
                {isGeneratingTextbook ? (
                  <>
                    <span className="animate-spin text-violet-600 font-black">⚙</span>
                    <span>Compiling Notes...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-violet-700 text-violet-700 animate-pulse" />
                    <span>Generate Complete Textbook Study Sheet</span>
                  </>
                )}
              </button>
              <div className="absolute right-0 bottom-0 opacity-[0.04] pointer-events-none select-none text-8xl text-white">
                📚
              </div>
            </div>

            {/* Output of dynamic AI generated textbook (if requested), priority rendering! */}
            {generatedTextbooks[activeChapterData.id] && (
              <div className="p-6 md:p-8 bg-zinc-50 border border-violet-100 rounded-2xl shadow-inner space-y-4 animate-fade-in relative">
                <div className="flex items-center justify-between border-b border-violet-100 pb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] font-black text-violet-700 uppercase tracking-widest flex items-center gap-1.5">
                      <BookMarked className="w-4 h-4" /> AI Generated High-Yield Textbook Sheet
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const cid = activeChapterData.id;
                      setGeneratedTextbooks(prev => {
                        const next = { ...prev };
                        delete next[cid];
                        return next;
                      });
                    }}
                    className="text-[9px] font-black uppercase text-rose-600 hover:text-rose-800 bg-rose-50 px-2.5 py-1 rounded transition"
                  >
                    Clear Dynamic Study Sheet
                  </button>
                </div>

                <div className="whitespace-pre-wrap font-sans text-xs text-slate-850 leading-relaxed font-semibold pl-1 space-y-3 select-text bg-white p-5 rounded-xl border border-slate-200">
                  {generatedTextbooks[activeChapterData.id]}
                </div>
                <p className="text-[9px] text-center text-slate-400 font-mono italic">
                  Note: The generated revision module conforms to UHS & PMDC syllabus and incorporates references across provincial textbooks.
                </p>
              </div>
            )}

            {/* Microstructural Sections (Traditional Pre-seeded Notes) */}
            {activeChapterData.sections ? (
              <div className="space-y-6">
                <h4 className="text-[10px] uppercase font-black text-sky-400 tracking-wider flex items-center gap-1.5 border-b border-sky-50 pb-1.5">
                  <FileText className="w-4 h-4 text-sky-500" /> Syllabus Conceptual Guidelines
                </h4>
                
                <div className="space-y-6">
                  {activeChapterData.sections.map((sect, sIdx) => (
                    <div key={sIdx} className="space-y-3 bg-slate-50/20 p-5 rounded-2xl border border-slate-100">
                      <h5 className="text-xs font-black text-sky-950 uppercase tracking-tight flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                        {sect.heading}
                      </h5>
                      <ul className="space-y-2.5 pl-3 list-none">
                        {sect.bullets.map((bullet, bIdx) => {
                          const parts = bullet.split('**');
                          return (
                            <li key={bIdx} className="text-xs text-slate-700 leading-relaxed font-semibold flex items-start gap-2">
                              <CornerDownRight className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                              <span>
                                {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-sky-950 font-extrabold">{p}</strong> : p)}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Fallback default bulleted list */
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase font-black text-sky-400 tracking-wider flex items-center gap-1.5 border-b border-sky-50/50 pb-1">
                  <BookOpen className="w-4 h-4 text-sky-500" /> Syllabus High-Yield Concepts
                </h4>
                <div className="grid grid-cols-1 gap-3.5">
                  {activeChapterData.detailedContent.map((point, index) => {
                    const parts = point.split('**');
                    return (
                      <div key={index} className="flex items-start gap-2.5 p-4 rounded-xl bg-slate-50/40 border border-slate-100">
                        <CornerDownRight className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-750 font-semibold leading-relaxed">
                          {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-sky-950 font-extrabold">{p}</strong> : p)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Provincial Board Insights Comparison */}
            <div className="p-5 rounded-2xl bg-amber-50/35 border border-amber-100 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="text-[10px] font-black uppercase text-amber-800 tracking-wide">
                  Provincial Textbook Distinctions (Punjab, Sindh, Federal, KPK)
                </h5>
                <p className="text-xs text-amber-950 leading-relaxed font-semibold">
                  {activeChapterData.boardInsights}
                </p>
              </div>
            </div>

            {/* Memory triggers and Mnemonics */}
            {activeChapterData.mnemonics && activeChapterData.mnemonics.length > 0 && (
              <div className="p-4 rounded-2xl bg-sky-50/30 border border-sky-100 space-y-2">
                <h5 className="text-[10px] font-black uppercase text-sky-700 tracking-wider flex items-center gap-1">
                  💡 High-Yield Mnemonic Aid / Formula Key
                </h5>
                <ul className="space-y-1 list-none pl-1">
                  {activeChapterData.mnemonics.map((mn, idx) => {
                    const sections = mn.split('**');
                    return (
                      <li key={idx} className="text-xs text-sky-950 font-semibold flex items-center gap-2">
                        <span className="text-sm">⚡</span>
                        <span>
                          {sections.map((s, sIdx) => sIdx % 2 === 1 ? <strong key={sIdx} className="font-extrabold text-sky-900">{s}</strong> : s)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Interactive Concept solved sample questions */}
            <div className="space-y-5">
              <h4 className="text-[10px] uppercase font-black text-sky-400 tracking-wider flex items-center gap-1.5 border-b border-sky-50/50 pb-1">
                <HelpCircle className="w-5 h-5 text-sky-550" /> Solved Board Sample Questions
              </h4>
              
              <div className="space-y-5">
                {activeChapterData.samples.map((q, qIndex) => {
                  const verifiedAnswer = userSelectedAnswers[q.id];
                  const isCorrectAnswer = verifiedAnswer === q.correctOption;
                  return (
                    <div key={q.id} className="p-5 border border-sky-100 rounded-2xl bg-white shadow-sm space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <span className="px-2.5 py-0.5 text-[8px] font-black bg-sky-50 text-sky-850 rounded uppercase tracking-wider">
                          Concept Practice Q#{qIndex + 1}
                        </span>
                        {verifiedAnswer && (
                          <span className={`text-[10px] font-black uppercase flex items-center gap-1 px-2 py-0.5 rounded ${isCorrectAnswer ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                            {isCorrectAnswer ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            {isCorrectAnswer ? 'CORRECT' : `INCORRECT (Solution: ${q.correctOption})`}
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-bold text-sky-950 pl-0.5">
                        {q.questionText}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          { val: 'A', text: q.optionA },
                          { val: 'B', text: q.optionB },
                          { val: 'C', text: q.optionC },
                          { val: 'D', text: q.optionD }
                        ].map((opt) => {
                          const isOptionSelected = verifiedAnswer === opt.val;
                          const isOptionCorrect = q.correctOption === opt.val;
                          let optStyle = 'border-sky-100 hover:bg-sky-50/25 bg-white text-sky-950';

                          if (verifiedAnswer) {
                            if (isOptionCorrect) {
                              optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-extrabold ring-1 ring-emerald-300';
                            } else if (isOptionSelected) {
                              optStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                            } else {
                              optStyle = 'opacity-60 border-slate-105 bg-white text-slate-500';
                            }
                          }

                          return (
                            <button
                              key={opt.val}
                              onClick={() => handleVerifyOption(q.id, opt.val)}
                              className={`text-left p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition ${optStyle}`}
                            >
                              <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${isOptionSelected ? 'bg-sky-500 text-white' : 'bg-sky-100/50 text-sky-800'}`}>
                                {opt.val}
                              </span>
                              <span>{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>

                      {verifiedAnswer && (
                        <div className="p-4 bg-emerald-50/25 border border-emerald-100 rounded-xl space-y-1.5 animate-fade-in text-[11px] text-emerald-950 leading-relaxed font-semibold">
                          <span className="font-extrabold text-[10px] text-emerald-850 block uppercase tracking-wide flex items-center gap-1">
                            <Info className="w-3.5 h-3.5" /> High-Yield Remedial explanation:
                          </span>
                          <p>{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chat Room Workspace for the Chapter */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-violet-50/50 via-white to-sky-50/50 border border-violet-100 space-y-5">
              <div className="space-y-1.5">
                <span className="px-2 py-0.5 rounded bg-violet-100 text-violet-700 text-[8px] font-black uppercase tracking-widest border border-violet-150">
                  Live AI Chapter Coach
                </span>
                <h4 className="text-sm font-black text-sky-950 uppercase tracking-tight flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-violet-500 animate-pulse" /> Consult Zaheen AI on "{activeChapterData.title}"
                </h4>
                <p className="text-[11px] text-slate-650 leading-relaxed font-bold">
                  Stuck on this chapter or require notes regarding any other KPK/Sindh/Punjab boards? Enter any custom questions or topics below. Your AI coach generates detailed dual-language analyses instantly!
                </p>
              </div>

              {/* Instant Suggestions chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  `Give me a study checklist for ${activeChapterData.title}`,
                  `What are common past paper traps in this topic?`,
                  `Generate 3 harder questions with explanations`
                ].map((sugg, i) => (
                  <button
                    key={i}
                    onClick={() => setCustomUserQuery(sugg)}
                    className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-violet-900 bg-violet-50 hover:bg-violet-100 rounded-lg cursor-pointer transition-all"
                  >
                    💡 {sugg}
                  </button>
                ))}
              </div>

              {/* Chat thread list */}
              {aiWorkspaceChats[activeChapterData.id] && aiWorkspaceChats[activeChapterData.id].length > 0 && (
                <div className="space-y-4 max-h-[300px] overflow-y-auto border-t border-b border-slate-100 py-4 pr-1 scrollbar-thin">
                  {aiWorkspaceChats[activeChapterData.id].map((chat, cIdx) => (
                    <div key={cIdx} className="space-y-2 animate-fade-in">
                      <div className="flex items-start gap-2 max-w-[85%] ml-auto bg-violet-600 text-white rounded-2xl rounded-tr-none px-3.5 py-2 px-3.5 py-2.5 text-xs font-semibold shadow-sm">
                        <span>{chat.q}</span>
                      </div>
                      <div className="flex items-start gap-2 max-w-[90%] bg-zinc-50 border border-violet-100 rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs text-zinc-950 font-semibold leading-relaxed shadow-inner">
                        <div className="whitespace-pre-wrap select-text pr-2">
                          {chat.a}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Query form input */}
              <form onSubmit={handleSendQueryToAI} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Ask a question (e.g. 'explain lytic vs lysogenic cycles in simple urdu')..."
                  value={customUserQuery}
                  onChange={(e) => setCustomUserQuery(e.target.value)}
                  disabled={isAiAnswering}
                  className="flex-1 bg-white border border-slate-200 focus:border-violet-400 focus:outline-none rounded-xl px-4 py-3 text-xs font-bold text-slate-800 placeholder-slate-400"
                />
                <button
                  type="submit"
                  disabled={isAiAnswering || !customUserQuery.trim()}
                  className="px-4 py-3 bg-violet-650 hover:bg-violet-750 text-white rounded-xl shadow cursor-pointer transition disabled:opacity-40 flex items-center justify-center shrink-0"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
