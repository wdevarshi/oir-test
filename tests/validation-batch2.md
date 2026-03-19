# Validation: Tests 6-10

## Errors Found

### Test 6, Q46 (Coding-Decoding) — WRONG ANSWER
- Question: "If A=1, B=2, C=3..., what is the sum of letters in 'SUN'?"
- Options: ["52", "53", "54", "55"]
- Marked correct: index 3 = "55"
- Should be: index 2 = "54"
- Reasoning: S=19, U=21, N=14. Sum = 19+21+14 = 54. The explanation itself computes 54 but marks index 3 (55).

### Test 7, Q46 (Coding-Decoding) — WRONG ANSWER
- Question: "If A=1, B=2, C=3..., what is the sum of letters in 'RED'?"
- Options: ["26", "27", "28", "29"]
- Marked correct: index 0 = "26"
- Should be: index 1 = "27"
- Reasoning: R=18, E=5, D=4. Sum = 18+5+4 = 27. Explanation even says 27.

### Test 8, Q41 (Coding-Decoding) — WRONG ANSWER + BAD STEM
- Question: "If BALL = 2112, then GOAL = ?"
- Options: ["71512", "715112", "7151", "71415"]
- Marked correct: index 0 = "71512"
- Should be: index 1 = "715112"
- Reasoning: G=7, O=15, A=1, L=12 → concatenated = "7"+"15"+"1"+"12" = "715112". The stem is also broken: BALL should be B(2)+A(1)+L(12)+L(12) = "211212", not "2112".

### Test 8, Q46 (Coding-Decoding) — NO CORRECT OPTION
- Question: "If A=1, B=2, C=3..., what is the sum of letters in 'WIN'?"
- Options: ["48", "49", "50", "51"]
- Marked correct: index 2 = "50"
- Actual answer: **46** (W=23, I=9, N=14 → 23+9+14 = 46)
- **None of the four options equals 46.** Question needs new options.

### Test 9, Q46 (Coding-Decoding) — WRONG ANSWER
- Question: "If A=1, B=2, C=3..., what is the sum of letters in 'BOX'?"
- Options: ["40", "41", "42", "43"]
- Marked correct: index 2 = "42"
- Should be: index 1 = "41"
- Reasoning: B=2, O=15, X=24. Sum = 2+15+24 = 41.

### Test 9, Q48 (Coding-Decoding) — NO CORRECT OPTION
- Question: "In a code, MIST = NJTU. What is HAZE?"
- Options: ["IBZF", "HAZF", "IBZE", "ICZF"]
- Marked correct: index 0 = "IBZF"
- Pattern is +1 shift: M→N, I→J, S→T, T→U
- Correct answer: H→I, A→B, Z→A (wraps), E→F = **IBAF**
- **None of the options are correct.** "IBZF" incorrectly leaves Z unshifted. Either avoid Z in the word, or add the wrapping option.

### Test 10, Q41 (Coding-Decoding) — WRONG ANSWER
- Question: "If TREE = 201855, then LEAF = ?"
- Options: ["12516", "125116", "1251", "125151"]
- Marked correct: index 1 = "125116"
- Should be: index 0 = "12516"
- Reasoning: L=12, E=5, A=1, F=6. Concatenated: "12"+"5"+"1"+"6" = "12516". Stem checks out: TREE = T(20)+R(18)+E(5)+E(5) = "201855" ✓.

### Test 10, Q46 (Coding-Decoding) — WRONG ANSWER
- Question: "If A=1, B=2, C=3..., what is the sum of letters in 'CAR'?"
- Options: ["20", "21", "22", "23"]
- Marked correct: index 1 = "21"
- Should be: index 2 = "22"
- Reasoning: C=3, A=1, R=18. Sum = 3+1+18 = 22.

---

## Question Stem Bugs (answer still correct)

### Test 6, Q41 — Stem concatenation wrong
- States: SUN = 191421 (would imply S=19, N=14, U=21 — letter order wrong)
- Should be: SUN = 192114 (S=19, U=21, N=14)
- Answer for SKY = 191125 (S=19, K=11, Y=25) is still correct ✓

### Test 7, Q41 — Stem concatenation incomplete
- States: DESK = 4519 (missing K=11 → only covers D=4, E=5, S=19)
- Should be: DESK = 451911
- Answer for CHAIR = 381918 (C=3, H=8, A=1, I=9, R=18) is correct ✓

### Test 9, Q41 — Stem digits scrambled
- States: PEN = 161405 (digits don't match P=16, E=5, N=14 in order)
- Should be: PEN = 16514
- Answer for INK = 91411 (I=9, N=14, K=11) is correct ✓

---

## Ambiguous Questions

### Test 10, Q24 (Non-Verbal Reasoning) — Two correct answers
- Question: "Which 3D shape has 5 faces?"
- Options: [Cube, Triangular prism, Square pyramid, Octahedron]
- Marked correct: index 2 = "Square pyramid" (1 square + 4 triangles = 5) ✓
- **Also correct:** index 1 = "Triangular prism" (2 triangles + 3 rectangles = 5)
- Both have exactly 5 faces. A student picking "Triangular prism" would be marked wrong unfairly.

---

## Systematic Bug: Q46 "Letter Sum" Wrong in ALL 5 Tests

Every test (6-10) has a Q46 letter-sum question with the **wrong answer index**:

| Test | Word | Correct Sum | Marked | Correct Option |
|------|------|-------------|--------|----------------|
| 6 | SUN | 54 | 55 (idx 3) | 54 (idx 2) |
| 7 | RED | 27 | 26 (idx 0) | 27 (idx 1) |
| 8 | WIN | 46 | 50 (idx 2) | **No valid option** |
| 9 | BOX | 41 | 42 (idx 2) | 41 (idx 1) |
| 10 | CAR | 22 | 21 (idx 1) | 22 (idx 2) |

This is a **systematic generation bug** — the letter-sum calculation is consistently off-by-one or more.

---

## Sections Fully Verified ✓

- **Numerical Ability (Q31-Q40, all 5 tests = 50 questions):** All correct. Percentages, equations, series, speed/distance, roots all verified.
- **Verbal Reasoning (Q1-Q15, all 5 tests = 75 questions):** All correct.
- **Non-Verbal Reasoning (Q16-Q30, all 5 tests = 75 questions):** All correct (1 ambiguity noted).
- **Coding-Decoding (Q41-Q50, all 5 tests = 50 questions):** 8 errors found, 3 stem issues.

---

## Summary
- **Questions checked: 250/250**
- **Hard errors (wrong correct index): 8**
  - Test 6: Q46
  - Test 7: Q46
  - Test 8: Q41, Q46
  - Test 9: Q46, Q48
  - Test 10: Q41, Q46
- **Question stem bugs (answer still correct): 3** — T6-Q41, T7-Q41, T9-Q41
- **Ambiguous (multiple valid answers): 1** — T10-Q24
- **Systematic pattern: Q46 letter-sum is wrong in ALL 5 tests** — likely a generator bug
- **All errors are in Coding-Decoding section** — Numerical, Verbal, and Non-Verbal sections are clean.
