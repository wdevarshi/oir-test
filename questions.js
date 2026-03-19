const questions = [
    // SECTION A: VERBAL REASONING (15 Questions)
    {
        section: "Verbal Reasoning",
        id: 1,
        question: "Synonym of <strong>PERSEVERANCE</strong>:",
        options: ["Give up", "Persistence", "Laziness", "Hesitation"],
        correct: 1,
        explanation: "'Perseverance' means continued effort despite difficulties. 'Persistence' has the same meaning."
    },
    {
        section: "Verbal Reasoning",
        id: 2,
        question: "Antonym of <strong>OPTIMISTIC</strong>:",
        options: ["Hopeful", "Pessimistic", "Cheerful", "Positive"],
        correct: 1,
        explanation: "'Optimistic' means hopeful about the future. The opposite is 'Pessimistic' (expecting bad outcomes)."
    },
    {
        section: "Verbal Reasoning",
        id: 3,
        question: "Engineer : Building :: Painter : ?",
        options: ["Brush", "Canvas", "Painting", "Color"],
        correct: 2,
        explanation: "An engineer creates a building. A painter creates a painting."
    },
    {
        section: "Verbal Reasoning",
        id: 4,
        question: "Telescope : Stars :: Microscope : ?",
        options: ["Large", "Cells", "Laboratory", "Scientist"],
        correct: 1,
        explanation: "A telescope is used to see stars. A microscope is used to see cells."
    },
    {
        section: "Verbal Reasoning",
        id: 5,
        question: "Choose odd one: Carrot, Broccoli, Spinach, Apple",
        options: ["Carrot", "Broccoli", "Spinach", "Apple"],
        correct: 3,
        explanation: "Carrot, Broccoli, and Spinach are vegetables. Apple is a fruit."
    },
    {
        section: "Verbal Reasoning",
        id: 6,
        question: "Chef : Kitchen :: Pilot : ?",
        options: ["Airplane", "Cockpit", "Airport", "Sky"],
        correct: 1,
        explanation: "A chef works in a kitchen. A pilot works in a cockpit."
    },
    {
        section: "Verbal Reasoning",
        id: 7,
        question: "Her _____ speech inspired the entire team.",
        options: ["boring", "motivational", "unclear", "confusing"],
        correct: 1,
        explanation: "A 'motivational' speech inspires people. The other options wouldn't inspire anyone."
    },
    {
        section: "Verbal Reasoning",
        id: 8,
        question: "Synonym of <strong>VIGOROUS</strong>:",
        options: ["Weak", "Energetic", "Tired", "Lazy"],
        correct: 1,
        explanation: "'Vigorous' means strong and active. 'Energetic' has the same meaning."
    },
    {
        section: "Verbal Reasoning",
        id: 9,
        question: "Compass : Direction :: Watch : ?",
        options: ["Hand", "Time", "Battery", "Face"],
        correct: 1,
        explanation: "A compass shows direction. A watch shows time."
    },
    {
        section: "Verbal Reasoning",
        id: 10,
        question: "Antonym of <strong>ZENITH</strong>:",
        options: ["Peak", "Summit", "Nadir", "Top"],
        correct: 2,
        explanation: "'Zenith' means the highest point. The opposite is 'Nadir' (the lowest point)."
    },
    {
        section: "Verbal Reasoning",
        id: 11,
        question: "Find correctly spelled word:",
        options: ["Recieve", "Receive", "Receve", "Receeve"],
        correct: 1,
        explanation: "The correct spelling is 'Receive' (i before e except after c rule doesn't apply here)."
    },
    {
        section: "Verbal Reasoning",
        id: 12,
        question: "Broom : Sweep :: Shovel : ?",
        options: ["Dirt", "Dig", "Garden", "Tool"],
        correct: 1,
        explanation: "A broom is used to sweep. A shovel is used to dig."
    },
    {
        section: "Verbal Reasoning",
        id: 13,
        question: "Choose odd: Copper, Silver, Gold, Plastic",
        options: ["Copper", "Silver", "Gold", "Plastic"],
        correct: 3,
        explanation: "Copper, Silver, and Gold are metals. Plastic is not a metal."
    },
    {
        section: "Verbal Reasoning",
        id: 14,
        question: "The new policy was _____ by all employees.",
        options: ["rejected", "welcomed", "ignored", "opposed"],
        correct: 1,
        explanation: "Context suggests positive reception. 'Welcomed' is the positive word that fits best."
    },
    {
        section: "Verbal Reasoning",
        id: 15,
        question: "Synonym of <strong>RESILIENT</strong>:",
        options: ["Fragile", "Tough", "Brittle", "Weak"],
        correct: 1,
        explanation: "'Resilient' means able to recover quickly. 'Tough' conveys similar strength and durability."
    },

    // SECTION B: NON-VERBAL REASONING (15 Questions)
    {
        section: "Non-Verbal Reasoning",
        id: 16,
        question: "Find next: 3, 7, 11, 15, 19, ?",
        options: ["21", "22", "23", "24"],
        correct: 2,
        explanation: "Pattern: +4 each time. 19 + 4 = 23."
    },
    {
        section: "Non-Verbal Reasoning",
        id: 17,
        question: "Pattern: ◆ ◆◆ ◆◆◆ ◆◆◆◆ ?",
        options: ["◆◆◆◆", "◆◆◆◆◆", "◆◆◆", "◆◆◆◆◆◆"],
        correct: 1,
        explanation: "Adding one diamond each time: 1, 2, 3, 4, so next is 5."
    },
    {
        section: "Non-Verbal Reasoning",
        id: 18,
        question: "Which is different: Cube, Sphere, Pyramid, Rectangle",
        options: ["Cube", "Sphere", "Pyramid", "Rectangle"],
        correct: 3,
        explanation: "Cube, Sphere, and Pyramid are 3D shapes. Rectangle is 2D."
    },
    {
        section: "Non-Verbal Reasoning",
        id: 19,
        question: "If Z=26, Y=25, X=24... then T = ?",
        options: ["18", "19", "20", "21"],
        correct: 2,
        explanation: "Z=26, Y=25, X=24, W=23, V=22, U=21, T=20."
    },
    {
        section: "Non-Verbal Reasoning",
        id: 20,
        question: "How many days in February 2026?",
        options: ["28", "29", "30", "31"],
        correct: 0,
        explanation: "2026 is not a leap year (not divisible by 4), so February has 28 days."
    },
    {
        section: "Non-Verbal Reasoning",
        id: 21,
        question: "A paper folded 3 times and one hole punched. Holes when unfolded?",
        options: ["4", "6", "8", "16"],
        correct: 2,
        explanation: "Fold once = 2 layers, twice = 4, three times = 8. One punch = 8 holes."
    },
    {
        section: "Non-Verbal Reasoning",
        id: 22,
        question: "Priya is 9th from top, 18th from bottom. Total students?",
        options: ["26", "27", "25", "28"],
        correct: 0,
        explanation: "Total = Top + Bottom - 1. 9 + 18 - 1 = 26."
    },
    {
        section: "Non-Verbal Reasoning",
        id: 23,
        question: "Find next: 3, 6, 12, 24, ?",
        options: ["36", "40", "48", "50"],
        correct: 2,
        explanation: "Doubling each time: 3, 6, 12, 24, 48."
    },
    {
        section: "Non-Verbal Reasoning",
        id: 24,
        question: "Facing West, turn 90° right, then 90° right again. Final direction?",
        options: ["North", "South", "East", "West"],
        correct: 2,
        explanation: "West → 90° right = North → 90° right = East."
    },
    {
        section: "Non-Verbal Reasoning",
        id: 25,
        question: "Complete series: B, D, F, H, ?",
        options: ["I", "J", "K", "L"],
        correct: 1,
        explanation: "Skipping one letter: B, D (skip C), F (skip E), H (skip G), J (skip I)."
    },
    {
        section: "Non-Verbal Reasoning",
        id: 26,
        question: "Father's sister is your:",
        options: ["Aunt", "Uncle", "Cousin", "Mother"],
        correct: 0,
        explanation: "Father's sister is your aunt."
    },
    {
        section: "Non-Verbal Reasoning",
        id: 27,
        question: "Find odd: 2, 3, 5, 7, 9",
        options: ["2", "3", "5", "9"],
        correct: 3,
        explanation: "2, 3, 5, 7 are prime numbers. 9 is not prime (3 × 3 = 9)."
    },
    {
        section: "Non-Verbal Reasoning",
        id: 28,
        question: "How many rectangles in a 2×2 grid?",
        options: ["4", "6", "8", "9"],
        correct: 3,
        explanation: "4 small (1×1) + 2 horizontal (1×2) + 2 vertical (2×1) + 1 large (2×2) = 9."
    },
    {
        section: "Non-Verbal Reasoning",
        id: 29,
        question: "P is taller than Q. Q is taller than R. Who is shortest?",
        options: ["P", "Q", "R", "Cannot say"],
        correct: 2,
        explanation: "P > Q > R in height. So R is shortest."
    },
    {
        section: "Non-Verbal Reasoning",
        id: 30,
        question: "Clock shows 6:00. Angle between hands?",
        options: ["150°", "160°", "170°", "180°"],
        correct: 3,
        explanation: "At 6:00, hour hand at 6, minute hand at 12. Opposite sides = 180°."
    },

    // SECTION C: NUMERICAL ABILITY (15 Questions)
    {
        section: "Numerical Ability",
        id: 31,
        question: "Find next: 5, 10, 15, 20, ?",
        options: ["22", "24", "25", "30"],
        correct: 2,
        explanation: "Adding 5 each time: 5, 10, 15, 20, 25."
    },
    {
        section: "Numerical Ability",
        id: 32,
        question: "Find next: 3, 9, 27, 81, ?",
        options: ["162", "200", "243", "300"],
        correct: 2,
        explanation: "Multiplying by 3 each time: 3, 9, 27, 81, 243."
    },
    {
        section: "Numerical Ability",
        id: 33,
        question: "What is 40% of 200?",
        options: ["60", "70", "80", "90"],
        correct: 2,
        explanation: "40% of 200 = (40/100) × 200 = 80."
    },
    {
        section: "Numerical Ability",
        id: 34,
        question: "If 25% of X is 75, what is X?",
        options: ["200", "250", "300", "350"],
        correct: 2,
        explanation: "25% of X = 75, so (25/100) × X = 75. X = 75 × 4 = 300."
    },
    {
        section: "Numerical Ability",
        id: 35,
        question: "A bus travels 120 km in 2 hours. Speed?",
        options: ["50 km/hr", "55 km/hr", "60 km/hr", "65 km/hr"],
        correct: 2,
        explanation: "Speed = Distance / Time = 120 / 2 = 60 km/hr."
    },
    {
        section: "Numerical Ability",
        id: 36,
        question: "Find next: 0, 1, 1, 2, 3, 5, 8, ?",
        options: ["11", "12", "13", "14"],
        correct: 2,
        explanation: "Fibonacci: Each number = sum of previous two. 5 + 8 = 13."
    },
    {
        section: "Numerical Ability",
        id: 37,
        question: "If 4 pens cost ₹80, cost of 7 pens?",
        options: ["₹120", "₹140", "₹160", "₹180"],
        correct: 1,
        explanation: "Cost per pen = 80/4 = 20. Cost of 7 = 7 × 20 = 140."
    },
    {
        section: "Numerical Ability",
        id: 38,
        question: "A completes work in 6 days, B in 9 days. Together?",
        options: ["3 days", "3.6 days", "4 days", "4.5 days"],
        correct: 1,
        explanation: "A's 1 day = 1/6, B's = 1/9. Together = 1/6 + 1/9 = 5/18. Days = 18/5 = 3.6."
    },
    {
        section: "Numerical Ability",
        id: 39,
        question: "Average of 10, 15, 20, 25, 30?",
        options: ["18", "19", "20", "21"],
        correct: 2,
        explanation: "Average = (10+15+20+25+30)/5 = 100/5 = 20."
    },
    {
        section: "Numerical Ability",
        id: 40,
        question: "CP = ₹600, SP = ₹750. Profit %?",
        options: ["20%", "25%", "30%", "35%"],
        correct: 1,
        explanation: "Profit = 750 - 600 = 150. Profit% = (150/600) × 100 = 25%."
    },
    {
        section: "Numerical Ability",
        id: 41,
        question: "Find next: 4, 9, 16, 25, ?",
        options: ["30", "34", "36", "40"],
        correct: 2,
        explanation: "Squares: 2², 3², 4², 5², 6² = 36."
    },
    {
        section: "Numerical Ability",
        id: 42,
        question: "Distance = 450 km, Time = 6 hours. Speed?",
        options: ["70 km/hr", "72 km/hr", "75 km/hr", "78 km/hr"],
        correct: 2,
        explanation: "Speed = Distance/Time = 450/6 = 75 km/hr."
    },
    {
        section: "Numerical Ability",
        id: 43,
        question: "If 12 workers build house in 15 days, days for 9 workers?",
        options: ["18 days", "20 days", "22 days", "24 days"],
        correct: 1,
        explanation: "Total work = 12 × 15 = 180 man-days. For 9 workers = 180/9 = 20 days."
    },
    {
        section: "Numerical Ability",
        id: 44,
        question: "Find next: 200, 100, 50, 25, ?",
        options: ["10", "12", "12.5", "15"],
        correct: 2,
        explanation: "Dividing by 2: 200, 100, 50, 25, 12.5."
    },
    {
        section: "Numerical Ability",
        id: 45,
        question: "What is 15% of 300?",
        options: ["40", "45", "50", "55"],
        correct: 1,
        explanation: "15% of 300 = (15/100) × 300 = 45."
    },

    // SECTION D: CODING-DECODING (5 Questions)
    {
        section: "Coding-Decoding",
        id: 46,
        question: "If CAR = 3-1-18, BUS = ?",
        options: ["2-21-19", "2-22-19", "3-21-19", "2-21-20"],
        correct: 0,
        explanation: "Alphabetical position: B=2, U=21, S=19. So BUS = 2-21-19."
    },
    {
        section: "Coding-Decoding",
        id: 47,
        question: "If FISH is coded as GJTI, BIRD is coded as?",
        options: ["CJSE", "CISE", "DJSE", "CJSD"],
        correct: 0,
        explanation: "Each letter shifted +1: F→G, I→J, S→T, H→I. So B→C, I→J, R→S, D→E = CJSE."
    },
    {
        section: "Coding-Decoding",
        id: 48,
        question: "In a code, MANGO is LZMFN. GRAPE is?",
        options: ["FQZOD", "FQZOE", "GQZOD", "FQAPE"],
        correct: 0,
        explanation: "Each letter shifted -1: M→L, A→Z, N→M, G→F, O→N. So G→F, R→Q, A→Z, P→O, E→D = FQZOD."
    },
    {
        section: "Numerical Ability",
        id: 49,
        question: "If 4 + 5 = 20, 6 + 7 = 42, then 8 + 9 = ?",
        options: ["68", "72", "76", "80"],
        correct: 1,
        explanation: "Pattern: (a + b) × a. 4+5=9, 9×4=36 (wait no). Actually: a×b. 4×5=20, 6×7=42, 8×9=72."
    },
    {
        section: "Coding-Decoding",
        id: 50,
        question: "If SISTER has 6 letters, BROTHER has?",
        options: ["6", "7", "8", "9"],
        correct: 1,
        explanation: "BROTHER has 7 letters: B-R-O-T-H-E-R."
    }
];
