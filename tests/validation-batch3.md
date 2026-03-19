# Validation: Tests 11-15

## Errors Found

### Test 12, Q6 (Verbal Reasoning - Coding)
- Question: "If SILVER is coded as TJMWFS, then GOLDEN is coded as:"
- Marked correct: index 0 = "HPMEFS"
- Should be: "HPMEFO" (not among options — **broken question**)
- Reasoning: SILVER→TJMWFS is a consistent +1 shift. Applying +1 to GOLDEN: G→H, O→P, L→M, D→E, E→F, N→**O** = HPMEFO. The marked answer HPMEFS has 'S' as the last letter, which is wrong. The correct answer HPMEFO doesn't exist in any option. The explanation itself acknowledges this: "N→O = HPMEFO. Hmm, the option says HPMEFS."

### Test 14, Q46 (Coding-Decoding)
- Question: "If A=1, B=2..., what is the average of letters in 'BAG'?"
- Marked correct: index 1 = "3.67"
- Should be: ~3.33 (not among options — **broken question**)
- Reasoning: B=2, A=1, G=7. Sum = 10. Average = 10/3 ≈ 3.333. The marked answer 3.67 is wrong. The explanation even admits: "10/3=3.33, not 3.67" but still selects 3.67. None of the options (3, 3.67, 4, 4.33) matches 3.33 exactly, but 3.67 is definitively incorrect.

### Test 11, Q6 (Verbal Reasoning - Coding) — Minor: Flawed Premise
- Question: "If PLANET is coded as QMBOFS, then GALAXY is coded as:"
- Marked correct: index 0 = "HBMBYZ" — **answer is correct**
- Issue: The premise is inconsistent. With +1 shift, PLANET should encode to QMBOFU (T→U), not QMBOFS (T→S). The last letter in the premise is wrong. The answer HBMBYZ for GALAXY with +1 shift is correct, so the answer key is fine — just the question text has a typo.

## Summary
- Questions checked: 250/250
- Errors: **2 definitive errors** (Test 12 Q6, Test 14 Q46) — both are broken questions where the correct answer is not among the options
- Minor issues: 1 (Test 11 Q6 has a flawed premise but correct answer)
- All numerical ability questions (50 total): ✓ correct
- All coding-decoding questions (50 total): 1 error (T14 Q46)
- All non-verbal reasoning (75 total): ✓ correct
- All verbal reasoning (75 total): 1 error (T12 Q6), 1 minor (T11 Q6)
