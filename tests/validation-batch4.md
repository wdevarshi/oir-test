# Validation: Tests 16-20

## Errors Found

### Test 16, Q46 (Coding-Decoding)
- Question: "If A=1, B=2..., what is the sum of all vowels (A,E,I,O,U)?"
- Marked correct: index 1 = "55"
- Should be: index 0 = "51"
- Reasoning: A=1, E=5, I=9, O=15, U=21. Sum = 1+5+9+15+21 = **51**. The explanation itself computes 51 but the `correct` index points to 55.

### Test 17, Q32 (Numerical Ability) — Broken Question
- Question: "If x³ + 3 = 130, what is x?"
- Marked correct: index 1 = "5"
- Issue: x³ = 127, which is NOT a perfect cube (5³=125). No integer answer exists. Likely intended equation: x³ + 5 = 130 (giving x=5). The answer 5 is correct for the intended question but the equation as written has no clean solution.

### Test 18, Q6 (Verbal Reasoning) — Typo in Question Encoding
- Question: "If CAPTAIN is coded as DBRUBJO, then GENERAL is coded as:"
- Marked correct: index 0 = "HFOFSBM"
- Issue: CAPTAIN with +1 cipher = DBQUBJO (P→Q), but the question gives DBRUBJO (P→R, which is +2 for that one letter). The example encoding has a typo. The answer HFOFSBM for GENERAL is correct for a consistent +1 cipher.

### Test 18, Q45 (Coding-Decoding)
- Question: "Double code: first shift +2, then reverse the word. HELP → ?"
- Marked correct: index 1 = "JGNR"
- Should be: index 0 = "RNGJ"
- Reasoning: Step 1 — shift +2: H→J, E→G, L→N, P→R = JGNR. Step 2 — reverse: JGNR → **RNGJ**. The marked answer only does step 1 and skips the reversal. The explanation itself notes "JGNR→RNGJ=option 0" but selects option 1.

### Test 19, Q45 (Coding-Decoding) — Broken Question
- Question: "Triple code: shift +1, +2, +1, +2... alternating. CAT = ?"
- Marked correct: index 2 = "DBU"
- Issue: Applying alternating shifts: C(+1)=D, A(+2)=C, T(+1)=U → **DCU**, not in any option. DBU = all +1 (D,B,U), ignoring the stated alternation. None of the options match the stated rule.

### Test 19, Q46 (Coding-Decoding) — Broken Question
- Question: "If A=1, B=2..., sum of letters in 'INDIA'?"
- Marked correct: index 1 = "38"
- Actual answer: **37** (not in any option)
- Reasoning: I=9 + N=14 + D=4 + I=9 + A=1 = **37**. Options are 36, 38, 40, 42 — none correct.

### Test 20, Q26 (Non-Verbal Reasoning) — Broken Question
- Question: "The angle at 1:40 between clock hands is:"
- Marked correct: index 2 = "185°"
- Actual answer: **170°** (not in any option)
- Reasoning: Hour hand at 1:40 = (1×30)+(40×0.5) = 50°. Minute hand at 40×6 = 240°. Difference = 190°. Smaller angle = 360−190 = **170°**. Options are 175°, 180°, 185°, 190° — none correct.

### Test 20, Q27 (Non-Verbal Reasoning)
- Question: "How many cubes visible from outside in a 6×6×6?"
- Marked correct: index 2 = "176"
- Should be: index 0 = "152"
- Reasoning: Total = 216. Interior = (6−2)³ = 64. Visible = 216−64 = **152**. The explanation itself calculates 152 and notes "that's option 0" but `correct` is set to index 2.

### Test 20, Q45 (Coding-Decoding) — Broken Question
- Question: "Complex code: odd positions +1, even positions +2. BEST = ?"
- Marked correct: index 0 = "CGTU"
- Actual answer: **CGTV** (not in any option)
- Reasoning: B(pos1,+1)=C, E(pos2,+2)=G, S(pos3,+1)=T, T(pos4,+2)=**V** (T=20, +2=22=V, not U=21). None of the options match.

### Test 20, Q46 (Coding-Decoding) — Broken Question
- Question: "If A=1, B=2..., sum of letters in 'FORCE'?"
- Marked correct: index 2 = "42"
- Actual answer: **47** (not in any option)
- Reasoning: F=6 + O=15 + R=18 + C=3 + E=5 = **47**. Options are 38, 40, 42, 44 — none correct.

## Summary
- **Questions checked: 250/250**
- **Errors found: 10**

### By Error Type
| Type | Count | Questions |
|------|-------|-----------|
| Wrong answer index (correct answer exists in options) | 3 | T16-Q46, T18-Q45, T20-Q27 |
| Broken question (no valid option / bad equation) | 7 | T17-Q32, T18-Q6, T19-Q45, T19-Q46, T20-Q26, T20-Q45, T20-Q46 |

### By Section
| Section | Errors |
|---------|--------|
| Coding-Decoding | 6 (T16-Q46, T18-Q45, T19-Q45, T19-Q46, T20-Q45, T20-Q46) |
| Numerical Ability | 1 (T17-Q32) |
| Non-Verbal Reasoning | 2 (T20-Q26, T20-Q27) |
| Verbal Reasoning | 1 (T18-Q6) |

### By Test
| Test | Errors |
|------|--------|
| Test 16 | 1 |
| Test 17 | 1 |
| Test 18 | 2 |
| Test 19 | 2 |
| Test 20 | 4 |
