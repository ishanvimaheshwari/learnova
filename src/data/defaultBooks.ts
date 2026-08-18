import { Textbook } from "../types";

export const DEFAULT_TEXTBOOKS: Textbook[] = [
  {
    id: "phys-11",
    title: "Principles of Physics: Mechanics & Energy",
    subject: "Physics",
    gradeLevel: "Grade 11-12",
    author: "Dr. Eleanor Vance & Prof. Marcus Sterling",
    edition: "4th Digital Edition",
    physicalWeightKg: 2.8,
    coverColor: "from-blue-600 to-indigo-800",
    accentColor: "blue",
    iconName: "Zap",
    description: "Comprehensive guide to classical mechanics, Newton's laws, energy conservation, rotational dynamics, and wave motion with worked examples.",
    totalPages: 684,
    chapters: [
      {
        id: "phys-ch1",
        number: 1,
        title: "Kinematics: Motion in One & Two Dimensions",
        estimatedReadTimeMinutes: 12,
        content: `### 1.1 Vectors, Scalars, and Reference Frames
Kinematics is the branch of classical mechanics that describes the motion of points, bodies, and systems of bodies without considering the forces that cause them to move.

A scalar quantity is specified entirely by its magnitude (e.g., speed, time, mass, distance). In contrast, a vector quantity requires both magnitude and direction in space (e.g., velocity, acceleration, displacement, force).

### 1.2 The Equations of Constant Acceleration
When an object undergoes uniform acceleration $a$ along a straight path:
1. $v = v_0 + at$ (Velocity-Time Relation)
2. $x = x_0 + v_0 t + \\frac{1}{2}at^2$ (Position-Time Relation)
3. $v^2 = v_0^2 + 2a(x - x_0)$ (Torricelli's Velocity-Displacement Relation)
4. $x - x_0 = \\frac{(v_0 + v)}{2} t$ (Average Velocity Form)

### 1.3 Projectile Motion in a Gravitational Field
Projectile motion is a form of two-dimensional motion where an object is thrown near the earth's surface and moves along a curved path under the action of gravity alone (neglecting air resistance).
The horizontal velocity remains constant: $v_x = v_0 \\cos(\\theta)$.
The vertical velocity changes uniformly: $v_y = v_0 \\sin(\\theta) - gt$.
Maximum Height reached: $H_{max} = \\frac{v_0^2 \\sin^2(\\theta)}{2g}$.
Total Horizontal Range: $R = \\frac{v_0^2 \\sin(2\\theta)}{g}$.

### 1.4 Real-World Application & Engineering Insights
In aerospace trajectory calculation and sports engineering, precise kinematic analysis allows prediction of ballistic trajectories, vehicle stopping distances, and elevator acceleration curves for passenger comfort.`,
        summary: "Kinematics analyzes displacement, velocity, and acceleration. With constant acceleration, the three foundational kinematic equations govern all linear motion. Projectile motion separates cleanly into independent horizontal and vertical components.",
        keyFormulas: [
          { name: "Velocity Formula", formula: "v = v₀ + at", explanation: "Final velocity under constant acceleration" },
          { name: "Displacement Formula", formula: "Δx = v₀t + ½at²", explanation: "Total distance travelled in time t" },
          { name: "Time-Independent Equation", formula: "v² = v₀² + 2aΔx", explanation: "Relates initial and final speeds directly to displacement" },
          { name: "Horizontal Range", formula: "R = (v₀² sin 2θ) / g", explanation: "Maximum projectile distance on level ground" }
        ],
        glossary: [
          { term: "Kinematics", definition: "Study of motion without regard to the forces causing it." },
          { term: "Displacement", definition: "A vector representing the shortest straight-line distance from initial to final position." },
          { term: "Acceleration", definition: "The rate of change of velocity with respect to time." }
        ],
        checkpoints: [
          {
            question: "An electric vehicle accelerates uniformly from rest to 24 m/s in 6 seconds. What is its acceleration?",
            options: ["4 m/s²", "2 m/s²", "8 m/s²", "144 m/s²"],
            correctIndex: 0,
            explanation: "Using a = (v - v₀) / t = (24 - 0) / 6 = 4 m/s²."
          },
          {
            question: "At what launch angle is the horizontal range of a projectile maximized (assuming level ground and no air resistance)?",
            options: ["30°", "45°", "60°", "90°"],
            correctIndex: 1,
            explanation: "The range formula depends on sin(2θ). sin(2θ) reaches its maximum value of 1 when 2θ = 90°, so θ = 45°."
          }
        ]
      },
      {
        id: "phys-ch2",
        number: 2,
        title: "Newton's Laws of Motion & Friction",
        estimatedReadTimeMinutes: 15,
        content: `### 2.1 The Concept of Force and Inertia
Forces are vector interactions that cause a mass to change its velocity. Newton's First Law of Motion (the Law of Inertia) states that an object at rest stays at rest, and an object in motion remains at constant velocity, unless acted upon by a non-zero net external force.

### 2.2 Newton's Second Law of Dynamics
The fundamental relationship of classical mechanics connects net force to mass and acceleration:
$$\\sum \\vec{F} = m \\vec{a} = \\frac{d\\vec{p}}{dt}$$
Where $\\vec{p} = m\\vec{v}$ is linear momentum. The SI unit of force is the Newton ($1\\text{ N} = 1\\text{ kg}\\cdot\\text{m/s}^2$).

### 2.3 Newton's Third Law & Normal Contact Force
For every action force, there is an equal and opposite reaction force: $\\vec{F}_{A\\to B} = -\\vec{F}_{B\\to A}$. These action-reaction pairs act on different bodies and never cancel each other out.

### 2.4 Frictional Forces: Static vs Kinetic
Friction opposes relative motion between contacting surfaces.
Static friction prevents motion until the maximum threshold is reached: $f_s \\le \\mu_s N$.
Once in motion, kinetic friction acts with constant magnitude: $f_k = \\mu_k N$, where $\\mu_k < \\mu_s$.`,
        summary: "Forces cause acceleration, not velocity. Mass is the quantitative measure of inertia. Net force equals mass times acceleration. Friction depends directly on normal force and surface coefficients.",
        keyFormulas: [
          { name: "Newton's Second Law", formula: "F_net = m · a", explanation: "Net external force produces proportional acceleration" },
          { name: "Max Static Friction", formula: "f_s(max) = μ_s · N", explanation: "Breakaway friction threshold" },
          { name: "Kinetic Friction", formula: "f_k = μ_k · N", explanation: "Frictional resistance during sliding" }
        ],
        glossary: [
          { term: "Inertia", definition: "The tendency of an object to resist changes in its state of motion." },
          { term: "Normal Force", definition: "The perpendicular contact force exerted by a surface on an object." }
        ],
        checkpoints: [
          {
            question: "A 5 kg block sits on a horizontal table. The coefficient of static friction is 0.4. What is the minimum horizontal force needed to start moving it? (g = 9.8 m/s²)",
            options: ["19.6 N", "49 N", "2 N", "9.8 N"],
            correctIndex: 0,
            explanation: "Normal force N = mg = 5 × 9.8 = 49 N. Maximum static friction = μ_s × N = 0.4 × 49 = 19.6 N."
          }
        ]
      },
      {
        id: "phys-ch3",
        number: 3,
        title: "Work, Energy, and Conservation Principles",
        estimatedReadTimeMinutes: 14,
        content: `### 3.1 Work Done by a Constant and Variable Force
Work is scalar energy transfer: $W = \\vec{F} \\cdot \\vec{d} = F d \\cos(\\theta)$.
For variable forces: $W = \\int_{x_1}^{x_2} F(x) dx$.

### 3.2 The Work-Energy Theorem
The net work done on a particle equals the change in its kinetic energy:
$$W_{\\text{net}} = \\Delta K = \\frac{1}{2}m v_f^2 - \\frac{1}{2}m v_i^2$$

### 3.3 Conservative Forces and Potential Energy
For conservative forces (e.g., gravity, spring elastic force), work is path-independent.
Gravitational Potential Energy: $U_g = mgh$.
Elastic Potential Energy (Hooke's Law): $U_s = \\frac{1}{2}kx^2$.

### 3.4 Conservation of Total Mechanical Energy
In an isolated system with only conservative forces:
$$E_{\\text{mech}} = K_i + U_i = K_f + U_f = \\text{constant}$$`,
        summary: "Work is force applied along a displacement. Energy changes forms but is conserved in closed systems.",
        keyFormulas: [
          { name: "Work", formula: "W = F · d · cos(θ)", explanation: "Energy transferred by force" },
          { name: "Kinetic Energy", formula: "K = ½ m v²", explanation: "Energy of a moving mass" },
          { name: "Spring Energy", formula: "U_s = ½ k x²", explanation: "Elastic potential energy in a compressed spring" }
        ],
        glossary: [
          { term: "Joule", definition: "The SI unit of work and energy, equivalent to 1 N·m." },
          { term: "Power", definition: "The rate at which work is performed (P = W/t, measured in Watts)." }
        ]
      }
    ]
  },
  {
    id: "bio-10",
    title: "Modern Biology: Cell Life & Genetics",
    subject: "Biology",
    gradeLevel: "Grade 10-12",
    author: "Dr. Aris Thorne & Dr. Maya Lin",
    edition: "3rd Interactive Edition",
    physicalWeightKg: 2.6,
    coverColor: "from-emerald-600 to-teal-800",
    accentColor: "emerald",
    iconName: "Dna",
    description: "Explore cellular architecture, photosynthesis, cellular respiration, DNA replication, gene expression, and modern biotechnology.",
    totalPages: 576,
    chapters: [
      {
        id: "bio-ch1",
        number: 1,
        title: "Cell Structure, Membranes & Organelles",
        estimatedReadTimeMinutes: 14,
        content: `### 1.1 The Cell Theory
All living organisms are composed of one or more cells. The cell is the basic structural and functional unit of life, and all cells arise from pre-existing cells through division.

### 1.2 Prokaryotic vs Eukaryotic Architecture
- **Prokaryotes (Bacteria & Archaea):** Lack membrane-bound organelles and a true nucleus; DNA is organized in a circular nucleoid.
- **Eukaryotes (Animals, Plants, Fungi, Protists):** Feature compartmentalized organelles, an endomembrane system, and linear chromosomes within a nuclear envelope.

### 1.3 Organelle Specialization
- **Mitochondria:** Sites of aerobic cellular respiration, generating ATP through the electron transport chain.
- **Chloroplasts (Plants/Algae):** Contain thylakoid membranes and chlorophyll for solar energy capture via photosynthesis.
- **Endoplasmic Reticulum (Rough & Smooth):** Rough ER synthesizes membrane and secretory proteins; Smooth ER synthesizes lipids and handles detoxification.
- **Golgi Apparatus:** Modifies, sorts, and packages proteins for secretion or lysosomal delivery.

### 1.4 The Fluid Mosaic Membrane
The cell membrane consists of a phospholipid bilayer with hydrophilic heads facing aqueous environments and hydrophobic fatty acid tails sequestered inside. Embedded integral and peripheral proteins facilitate selective transport, signal transduction, and cell recognition.`,
        summary: "Cells are the fundamental units of living organisms. Eukaryotes utilize membrane-bound organelles for biochemical compartmentalization.",
        keyFormulas: [
          { name: "Surface Area to Volume Ratio", formula: "SA/V = 3/r (for sphere)", explanation: "Governs upper limit of cell size and diffusion efficiency" }
        ],
        glossary: [
          { term: "Phospholipid", definition: "Amphipathic lipid with a phosphate head and two fatty acid tails." },
          { term: "Osmosis", definition: "Passive diffusion of water across a semipermeable membrane down its concentration gradient." }
        ],
        checkpoints: [
          {
            question: "Which organelle is responsible for synthesizing ribosomal RNA (rRNA) and assembling ribosome subunits?",
            options: ["Nucleolus", "Golgi Body", "Lysosome", "Peroxisome"],
            correctIndex: 0,
            explanation: "The nucleolus, located inside the nucleus, is the specialized subnuclear structure where rRNA transcription and ribosome assembly take place."
          }
        ]
      },
      {
        id: "bio-ch2",
        number: 2,
        title: "Cellular Respiration & Energy Harvesting",
        estimatedReadTimeMinutes: 16,
        content: `### 2.1 ATP: The Universal Energy Currency
Adenosine triphosphate (ATP) stores metabolic energy within high-energy phosphoanhydride bonds. Hydrolysis of ATP into ADP and inorganic phosphate yields $\\approx -30.5\\text{ kJ/mol}$.

### 2.2 The Four Stages of Aerobic Respiration
1. **Glycolysis (Cytosol):** 1 Glucose ($C_6H_{12}O_6$) is split into 2 Pyruvate molecules, producing net $2\\text{ ATP}$ and $2\\text{ NADH}$.
2. **Pyruvate Oxidation (Mitochondrial Matrix):** Pyruvate is converted into Acetyl-CoA with release of $CO_2$ and production of $NADH$.
3. **Citric Acid Cycle / Krebs Cycle (Matrix):** Acetyl-CoA enters a circular metabolic cycle producing $2\\text{ ATP/GTP}$, $6\\text{ NADH}$, and $2\\text{ FADH}_2$ per glucose.
4. **Oxidative Phosphorylation (Inner Mitochondrial Membrane):** Electrons from NADH and FADH₂ travel down the Electron Transport Chain (ETC), pumping protons ($H^+$) into the intermembrane space. The proton gradient drives ATP Synthase (chemiosmosis), yielding $\\approx 26-28\\text{ ATP}$.

### 2.3 Total Yield & Fermentation
Under aerobic conditions, one glucose molecule generates $\\approx 30-32\\text{ ATP}$. In the absence of oxygen, cells perform lactic acid or ethanol fermentation to regenerate $NAD^+$ for glycolysis.`,
        summary: "Aerobic cellular respiration converts chemical energy in glucose into ATP through glycolysis, Krebs cycle, and chemiosmotic oxidative phosphorylation.",
        keyFormulas: [
          { name: "Overall Respiration", formula: "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 30-32 ATP", explanation: "Net stoichiometric breakdown of glucose" }
        ],
        glossary: [
          { term: "Chemiosmosis", definition: "The movement of ions across a semipermeable membrane down their electrochemical gradient to synthesize ATP." },
          { term: "Anaerobic", definition: "Processes occurring in the absence of molecular oxygen." }
        ]
      }
    ]
  },
  {
    id: "chem-11",
    title: "Advanced Chemistry: Structure & Reactions",
    subject: "Chemistry",
    gradeLevel: "Grade 11-12",
    author: "Prof. Julian Thorne & Dr. Sarah Al-Mansoor",
    edition: "5th Digital Master Edition",
    physicalWeightKg: 3.1,
    coverColor: "from-amber-600 to-orange-800",
    accentColor: "amber",
    iconName: "FlaskConical",
    description: "In-depth atomic orbital models, periodic periodicity, stoichiometry, thermochemistry, equilibrium constants, and acid-base kinetics.",
    totalPages: 740,
    chapters: [
      {
        id: "chem-ch1",
        number: 1,
        title: "Atomic Structure, Orbitals & Quantum Numbers",
        estimatedReadTimeMinutes: 15,
        content: `### 1.1 The Quantum Mechanical Model of the Atom
Electrons do not orbit in fixed planetary paths. Instead, Schrödinger wave equations describe electron probability densities known as atomic orbitals ($s, p, d, f$).

### 1.2 The Four Quantum Numbers
1. **Principal Quantum Number ($n$):** Determines energy level and orbital size ($n = 1, 2, 3, \\dots$).
2. **Azimuthal / Angular Momentum Number ($l$):** Determines orbital shape ($l = 0$ to $n-1$; $s=0, p=1, d=2, f=3$).
3. **Magnetic Quantum Number ($m_l$):** Determines spatial orientation ($-l$ to $+l$).
4. **Spin Quantum Number ($m_s$):** Determines electron intrinsic spin ($+\\frac{1}{2}, -\\frac{1}{2}$).

### 1.3 Electron Configuration Rules
- **Aufbau Principle:** Electrons fill the lowest available energy orbitals first ($1s \\to 2s \\to 2p \\to 3s \\to 3p \\to 4s \\to 3d$).
- **Pauli Exclusion Principle:** No two electrons in an atom can have the exact same set of 4 quantum numbers.
- **Hund's Rule:** Orbitals of equal energy are each occupied by one electron with parallel spin before pairing occurs.`,
        summary: "Quantum mechanics dictates electron distribution across probability orbitals defined by four quantum numbers, governing chemical bonding behaviors.",
        keyFormulas: [
          { name: "Energy of Photon", formula: "E = h · ν = (h · c) / λ", explanation: "Relates light wavelength and frequency to photon energy" },
          { name: "De Broglie Wavelength", formula: "λ = h / (m · v)", explanation: "Wave-particle duality of moving particles" }
        ],
        glossary: [
          { term: "Orbital", definition: "Three-dimensional region of space where there is a high probability of locating an electron." },
          { term: "Electronegativity", definition: "The ability of an atom in a covalent bond to attract shared electron pairs toward itself." }
        ],
        checkpoints: [
          {
            question: "What is the maximum number of electrons that can occupy the 3d subshell?",
            options: ["10", "6", "14", "2"],
            correctIndex: 0,
            explanation: "For d subshell, l=2, so m_l can be -2, -1, 0, +1, +2 (5 orbitals). Each orbital holds 2 electrons with opposite spins: 5 × 2 = 10 electrons."
          }
        ]
      },
      {
        id: "chem-ch2",
        number: 2,
        title: "Chemical Equilibrium & Le Chatelier's Principle",
        estimatedReadTimeMinutes: 16,
        content: `### 2.1 The Dynamic Nature of Equilibrium
Chemical equilibrium is reached when the rate of the forward reaction equals the rate of the reverse reaction, resulting in constant concentrations of reactants and products over time.

### 2.2 The Equilibrium Constant ($K_c$ and $K_p$)
For a generalized reversible reaction: $aA + bB \\rightleftharpoons cC + dD$, the equilibrium expression is:
$$K_c = \\frac{[C]^c [D]^d}{[A]^a [B]^b}$$
Pure solids ($s$) and pure liquids ($l$) are excluded from the expression as their activities equal 1.

### 2.3 Le Chatelier's Principle
When a dynamic equilibrium is subjected to an external disturbance (change in concentration, pressure, volume, or temperature), the system shifts its position of equilibrium in the direction that counteracts the change.
- **Concentration:** Adding reactants shifts equilibrium to the right (products).
- **Pressure/Volume (Gases):** Increasing pressure shifts toward fewer moles of gas.
- **Temperature:** For exothermic reactions ($\\Delta H < 0$), increasing temperature shifts equilibrium to the left, decreasing $K$.`,
        summary: "Equilibrium constants quantify product-to-reactant ratios at balance. Systems dynamically respond to stress per Le Chatelier's principle.",
        keyFormulas: [
          { name: "Equilibrium Constant", formula: "K_c = [Products]^coefficients / [Reactants]^coefficients", explanation: "Constant ratio at a given temperature" },
          { name: "Reaction Quotient Comparison", formula: "Q < K (forward shift), Q > K (reverse shift)", explanation: "Predicts shift direction" }
        ],
        glossary: [
          { term: "Exothermic", definition: "Reaction that releases heat to the surroundings (negative ΔH)." },
          { term: "Catalyst", definition: "A substance that increases reaction rate by lowering activation energy without altering K_eq." }
        ]
      }
    ]
  },
  {
    id: "math-12",
    title: "Pure Mathematics: Calculus & Analytical Geometry",
    subject: "Mathematics",
    gradeLevel: "Grade 11-12",
    author: "Prof. Kenneth Wei & Dr. Sofia Rostova",
    edition: "6th Rigorous Edition",
    physicalWeightKg: 2.9,
    coverColor: "from-purple-600 to-indigo-900",
    accentColor: "purple",
    iconName: "Calculator",
    description: "Limits, derivatives, curve sketching, integral techniques, differential equations, and vector spaces for college-prep STEM.",
    totalPages: 812,
    chapters: [
      {
        id: "math-ch1",
        number: 1,
        title: "Limits, Continuity & The Derivative Definition",
        estimatedReadTimeMinutes: 18,
        content: `### 1.1 Intuitive and Formal Definition of Limits
The limit of a function $f(x)$ as $x$ approaches $c$ is $L$, written $\\lim_{x \\to c} f(x) = L$, if $f(x)$ can be made arbitrarily close to $L$ by taking $x$ sufficiently close to $c$.
A function is continuous at $x = c$ if:
1. $f(c)$ is defined.
2. $\\lim_{x \\to c} f(x)$ exists.
3. $\\lim_{x \\to c} f(x) = f(c)$.

### 1.2 The Limit Definition of the Derivative
The instantaneous rate of change and slope of the tangent line to $y = f(x)$ is defined as:
$$f'(x) = \\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$

### 1.3 Standard Differentiation Rules
- **Power Rule:** $\\frac{d}{dx}[x^n] = n x^{n-1}$
- **Product Rule:** $\\frac{d}{dx}[u \\cdot v] = u' v + u v'$
- **Quotient Rule:** $\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u' v - u v'}{v^2}$
- **Chain Rule:** $\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$

### 1.4 Trigonometric and Exponential Derivatives
$\\frac{d}{dx}[\\sin x] = \\cos x$, $\\frac{d}{dx}[\\cos x] = -\\sin x$, $\\frac{d}{dx}[e^x] = e^x$, $\\frac{d}{dx}[\\ln x] = \\frac{1}{x}$.`,
        summary: "Derivatives measure instantaneous rate of change. The chain rule, product rule, and power rule unlock differentiation of complex composite functions.",
        keyFormulas: [
          { name: "Difference Quotient", formula: "f'(x) = lim(h→0) [f(x+h) - f(x)] / h", explanation: "Fundamental definition of derivative" },
          { name: "Chain Rule", formula: "(f ∘ g)'(x) = f'(g(x)) · g'(x)", explanation: "Differentiating nested composite functions" },
          { name: "Product Rule", formula: "(uv)' = u'v + uv'", explanation: "Differentiating two multiplied terms" }
        ],
        glossary: [
          { term: "Derivative", definition: "The slope of the tangent line to a curve at any given point." },
          { term: "Continuity", definition: "A graph with no breaks, holes, or asymptotes across its domain." }
        ],
        checkpoints: [
          {
            question: "What is the derivative of f(x) = 3x⁴ - 5x² + 7x - 9?",
            options: ["12x³ - 10x + 7", "12x³ - 10x", "3x³ - 5x + 7", "12x⁴ - 10x² + 7"],
            correctIndex: 0,
            explanation: "Apply power rule term by term: d/dx(3x⁴) = 12x³, d/dx(-5x²) = -10x, d/dx(7x) = 7, d/dx(-9) = 0. Sum = 12x³ - 10x + 7."
          }
        ]
      },
      {
        id: "math-ch2",
        number: 2,
        title: "Integration Techniques & The Fundamental Theorem",
        estimatedReadTimeMinutes: 20,
        content: `### 2.1 The Indefinite Integral as Antiderivative
Integration is the inverse operation of differentiation. If $F'(x) = f(x)$, then $\\int f(x) dx = F(x) + C$, where $C$ is the constant of integration.

### 2.2 The Fundamental Theorem of Calculus (FTC)
- **FTC Part 1:** If $g(x) = \\int_{a}^{x} f(t) dt$, then $g'(x) = f(x)$.
- **FTC Part 2 (Evaluation):** $\\int_{a}^{b} f(x) dx = F(b) - F(a)$, where $F$ is any antiderivative of $f$.

### 2.3 Integration by Substitution ($u$-sub)
When an integral contains a function and its derivative:
$$\\int f(g(x)) g'(x) dx = \\int f(u) du \\quad \\text{where } u = g(x)$$

### 2.4 Integration by Parts
Derived directly from the product rule of differentiation:
$$\\int u \\, dv = u v - \\int v \\, du$$
Follow the **LIATE** rule for selecting $u$: Logarithmic, Inverse trigonometric, Algebraic, Trigonometric, Exponential.`,
        summary: "The Fundamental Theorem of Calculus bridges slope and accumulated area. U-substitution and Integration by Parts are vital analytical integration tools.",
        keyFormulas: [
          { name: "Fundamental Theorem of Calculus", formula: "∫[a to b] f(x) dx = F(b) - F(a)", explanation: "Computes exact net signed area" },
          { name: "Integration by Parts", formula: "∫ u dv = u·v - ∫ v du", explanation: "Used for integrals of products" }
        ],
        glossary: [
          { term: "Riemann Sum", definition: "Approximating total area under a curve using summation of rectangular partitions." },
          { term: "Antiderivative", definition: "A differentiable function whose derivative equals the original given function." }
        ]
      }
    ]
  },
  {
    id: "cs-10",
    title: "Foundations of Computer Science & Algorithms",
    subject: "Computer Science",
    gradeLevel: "Grade 10-12",
    author: "Elena Rostova & Dave K. Chen",
    edition: "2nd Interactive Edition",
    physicalWeightKg: 2.1,
    coverColor: "from-cyan-600 to-blue-800",
    accentColor: "cyan",
    iconName: "Code",
    description: "Computational thinking, Python programming, asymptotic complexity (Big-O), search/sort algorithms, recursion, and object-oriented paradigms.",
    totalPages: 520,
    chapters: [
      {
        id: "cs-ch1",
        number: 1,
        title: "Algorithmic Complexity & Big-O Notation",
        estimatedReadTimeMinutes: 14,
        content: `### 1.1 Measuring Efficiency: Time and Space Complexity
In computer science, algorithms are evaluated not by raw milliseconds on a specific CPU, but by their growth rate as input size $N$ approaches infinity.

### 1.2 Common Big-O Complexity Classes
- **$O(1)$ (Constant Time):** Array index lookup, push/pop on a stack.
- **$O(\\log N)$ (Logarithmic Time):** Binary Search on sorted arrays, balanced BST lookups.
- **$O(N)$ (Linear Time):** Linear search, single pass through an array.
- **$O(N \\log N)$ (Linearithmic Time):** Merge Sort, Quick Sort (average), Tim Sort.
- **$O(N^2)$ (Quadratic Time):** Nested loops, Bubble Sort, Selection Sort.
- **$O(2^N)$ (Exponential Time):** Brute-force subsets, naive Fibonacci recursion.

### 1.3 Asymptotic Analysis Rules
1. Drop constant multipliers: $O(3N^2 + 500N) \\to O(N^2)$.
2. Focus on the dominant term: the highest exponent dictates behavior for large $N$.`,
        summary: "Big-O notation describes the upper bound of resource consumption as data size grows. Logarithmic and linearithmic algorithms scale gracefully to millions of items.",
        keyFormulas: [
          { name: "Binary Search Steps", formula: "k = ⌈log₂(N)⌉", explanation: "Maximum comparisons needed to search N elements" }
        ],
        glossary: [
          { term: "Asymptotic", definition: "Approaching a limiting value or trend as input parameters scale to infinity." },
          { term: "Algorithm", definition: "A well-defined step-by-step procedure for solving a computational problem." }
        ],
        checkpoints: [
          {
            question: "What is the worst-case time complexity of searching for an item in an unsorted array of size N?",
            options: ["O(N)", "O(log N)", "O(1)", "O(N²)"],
            correctIndex: 0,
            explanation: "In an unsorted array, we may have to check all N elements one by one, giving linear time complexity O(N)."
          }
        ]
      },
      {
        id: "cs-ch2",
        number: 2,
        title: "Data Structures: Arrays, Lists, Stacks & Hash Maps",
        estimatedReadTimeMinutes: 16,
        content: `### 2.1 Contiguous Memory vs Node Pointers
- **Static Array:** Fixed-size block in contiguous memory. $O(1)$ random access, but resizing requires allocating a new block and copying ($O(N)$).
- **Linked List:** Discrete nodes connected via memory pointers. Efficient $O(1)$ head insertions, but requires $O(N)$ traversal for indexed access.

### 2.2 Stacks (LIFO) and Queues (FIFO)
- **Stack (Last In, First Out):** Operations are \`push\` and \`pop\`. Used in call stack execution, undo buffers, and syntax parsing.
- **Queue (First In, First Out):** Operations are \`enqueue\` and \`dequeue\`. Used in printer queues, breadth-first search (BFS), and event loops.

### 2.3 Hash Maps & Hash Tables
A Hash Table maps keys to values using a hashing function that computes an index into an array of buckets.
- Average lookup, insert, and delete: $O(1)$.
- Collision resolution strategies: Separate Chaining (linked lists at bucket) and Open Addressing (Linear/Quadratic Probing).`,
        summary: "Choosing the appropriate data structure directly governs runtime efficiency. Hash maps provide near-instant average lookup time.",
        keyFormulas: [
          { name: "Hash Bucket Index", formula: "index = hash(key) % array_size", explanation: "Maps arbitrary hash codes into bounded memory slots" }
        ],
        glossary: [
          { term: "LIFO", definition: "Last In, First Out - principle governing Stack structures." },
          { term: "Hash Collision", definition: "When two distinct keys produce the identical hash table index." }
        ]
      }
    ]
  },
  {
    id: "hist-10",
    title: "Global Civilizations & World History",
    subject: "History",
    gradeLevel: "Grade 9-11",
    author: "Dr. Arthur Pendelton & Prof. Priya Sharma",
    edition: "4th Illustrated Edition",
    physicalWeightKg: 2.7,
    coverColor: "from-rose-600 to-red-900",
    accentColor: "rose",
    iconName: "Landmark",
    description: "Chronicles of global trade networks, Enlightenment philosophies, Industrial Revolutions, 20th-century conflicts, and international diplomacy.",
    totalPages: 620,
    chapters: [
      {
        id: "hist-ch1",
        number: 1,
        title: "The Enlightenment & The Age of Revolutions",
        estimatedReadTimeMinutes: 15,
        content: `### 1.1 Roots of the Enlightenment (17th–18th Century)
The Enlightenment was an intellectual and philosophical movement in Europe that emphasized reason, empirical evidence, individualism, and religious tolerance over tradition and absolute monarchical authority.

### 1.2 Key Thinkers and Social Contract Theory
- **John Locke:** Posited that humans possess natural rights to life, liberty, and property, and governments derive legitimate authority only from the consent of the governed.
- **Baron de Montesquieu:** Advocated for the separation of powers into legislative, executive, and judicial branches to prevent tyranny.
- **Jean-Jacques Rousseau:** Articulated the idea of the "General Will" and sovereign democracy in *The Social Contract*.
- **Voltaire:** Championed freedom of speech, freedom of religion, and the separation of church and state.

### 1.3 The Atlantic Revolutions
These ideals fueled major revolutionary upheavals:
1. **The American Revolution (1775–1783):** Culminating in the Declaration of Independence and constitutional republic.
2. **The French Revolution (1789–1799):** Abolished feudalism and proclaimed the *Declaration of the Rights of Man and of the Citizen*.
3. **The Haitian Revolution (1791–1804):** Led by Toussaint Louverture, the first successful anti-slavery and anti-colonial insurrection in the Western Hemisphere.`,
        summary: "The Enlightenment challenged absolute monarchy and divine right, establishing democratic governance, individual human rights, and constitutional law.",
        keyFormulas: [],
        glossary: [
          { term: "Social Contract", definition: "An implicit agreement among individuals to establish civil government in exchange for protection of rights." },
          { term: "Separation of Powers", definition: "Dividing government authority across independent branches to maintain checks and balances." }
        ],
        checkpoints: [
          {
            question: "Which Enlightenment philosopher proposed the division of government into three distinct branches with checks and balances?",
            options: ["Montesquieu", "Locke", "Hobbes", "Voltaire"],
            correctIndex: 0,
            explanation: "Baron de Montesquieu in 'The Spirit of the Laws' outlined the separation of executive, legislative, and judicial powers."
          }
        ]
      }
    ]
  },
  {
    id: "lit-11",
    title: "World Literature & Critical Analysis",
    subject: "Literature",
    gradeLevel: "Grade 10-12",
    author: "Prof. Clara Higgins & Michael Sterling",
    edition: "3rd Critical Edition",
    physicalWeightKg: 2.2,
    coverColor: "from-violet-600 to-purple-800",
    accentColor: "violet",
    iconName: "BookOpen",
    description: "Close reading techniques, literary movements (Romanticism, Modernism, Post-Colonialism), rhetoric, theme analysis, and essay writing.",
    totalPages: 480,
    chapters: [
      {
        id: "lit-ch1",
        number: 1,
        title: "Narrative Craft, Rhetorical Devices & Symbolism",
        estimatedReadTimeMinutes: 13,
        content: `### 1.1 Structural Elements of Narrative
Every rich narrative deploys a structured arc: Exposition, Inciting Incident, Rising Action, Climax, Falling Action, and Resolution (Dénouement).

### 1.2 Point of View and Narrative Reliability
- **First Person ('I/We'):** Provides immediate intimacy and psychological depth, but can introduce unreliable narration.
- **Third Person Limited:** Follows the internal thoughts and sensory experiences of a single focal character.
- **Third Person Omniscient:** An all-knowing narrator with access to the thoughts and backstories of all characters.

### 1.3 Rhetorical and Figurative Devices
- **Metaphor & Simile:** Direct comparison without or with 'like/as' to bridge conceptual imagery.
- **Irony:** Dramatic (audience knows what characters do not), Situational (outcome defies expectation), and Verbal (sarcasm / subtext).
- **Motif & Symbolism:** Recurring objects, motifs, or colors that embody deeper philosophical themes across a text.`,
        summary: "Literary analysis involves dissecting narrative architecture, narrator perspective, and symbolic subtext to uncover deeper universal themes.",
        keyFormulas: [],
        glossary: [
          { term: "Dénouement", definition: "The final resolution or untangling of plot threads following the climax of a story." },
          { term: "Juxtaposition", definition: "Placing two contrasting concepts, characters, or scenes side-by-side to highlight differences." }
        ]
      }
    ]
  }
];

export const defaultBooks = DEFAULT_TEXTBOOKS;
