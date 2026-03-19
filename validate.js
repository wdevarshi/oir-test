// Validation script for OIR test questions
const fs = require('fs');
const path = require('path');

const testsDir = path.join(__dirname, 'tests');
const errors = [];
let totalChecked = 0;

// Helper: letter to position (A=1, B=2, ...)
function letterPos(ch) {
  return ch.toUpperCase().charCodeAt(0) - 64;
}

// Helper: position to letter
function posToLetter(n) {
  while (n < 1) n += 26;
  return String.fromCharCode(((n - 1) % 26) + 65);
}

function addError(testId, q, issue, correctShouldBe, reasoning) {
  errors.push({
    testId,
    questionId: q.id,
    section: q.section,
    question: q.question,
    options: q.options,
    markedCorrect: q.correct,
    markedAnswer: q.options[q.correct],
    correctShouldBe,
    reasoning,
    issue
  });
}

// Check for duplicate options
function checkDuplicateOptions(testId, q) {
  const opts = q.options.map(o => String(o).trim().toLowerCase());
  const seen = new Set();
  for (const o of opts) {
    if (seen.has(o)) {
      addError(testId, q, 'Duplicate option', null, `Duplicate option found: "${o}"`);
      return;
    }
    seen.add(o);
  }
}

// Check numerical questions where we can parse and compute
function checkNumerical(testId, q) {
  const text = q.question;
  
  // Percentage questions: "What is X% of Y?"
  let m = text.match(/What is (\d+(?:\.\d+)?)% of (\d+(?:\.\d+)?)\??/i);
  if (m) {
    const pct = parseFloat(m[1]);
    const val = parseFloat(m[2]);
    const expected = (pct / 100) * val;
    // Find which option matches
    for (let i = 0; i < q.options.length; i++) {
      const optVal = parseFloat(String(q.options[i]).replace(/[₹,\s]/g, ''));
      if (Math.abs(optVal - expected) < 0.01) {
        if (q.correct !== i) {
          addError(testId, q, 'Wrong answer', `Option ${i} (${q.options[i]})`,
            `${pct}% of ${val} = ${expected}, which matches option ${i} (${q.options[i]}), not option ${q.correct} (${q.options[q.correct]})`);
        }
        return;
      }
    }
  }

  // Square root: "What is the square root of X?"
  m = text.match(/square root of (\d+)/i);
  if (m) {
    const val = parseInt(m[1]);
    const expected = Math.sqrt(val);
    if (Number.isInteger(expected)) {
      for (let i = 0; i < q.options.length; i++) {
        const optVal = parseFloat(String(q.options[i]).replace(/[₹,\s]/g, ''));
        if (Math.abs(optVal - expected) < 0.01) {
          if (q.correct !== i) {
            addError(testId, q, 'Wrong answer', `Option ${i} (${q.options[i]})`,
              `√${val} = ${expected}, which matches option ${i}`);
          }
          return;
        }
      }
    }
  }

  // Multiplication: "What is A × B?" or "What is A * B?"
  m = text.match(/What is (\d+)\s*[×x\*]\s*(\d+)/i);
  if (m) {
    const a = parseInt(m[1]), b = parseInt(m[2]);
    const expected = a * b;
    for (let i = 0; i < q.options.length; i++) {
      const optVal = parseFloat(String(q.options[i]).replace(/[₹,\s]/g, ''));
      if (Math.abs(optVal - expected) < 0.01) {
        if (q.correct !== i) {
          addError(testId, q, 'Wrong answer', `Option ${i} (${q.options[i]})`,
            `${a} × ${b} = ${expected}`);
        }
        return;
      }
    }
  }

  // Linear equation: "If Ax + B = C" or "If Ax = C"
  m = text.match(/If (\d+)x\s*=\s*(\d+)/i);
  if (m && !text.includes('+') && !text.includes('-')) {
    const a = parseInt(m[1]), c = parseInt(m[2]);
    const expected = c / a;
    if (Number.isInteger(expected)) {
      for (let i = 0; i < q.options.length; i++) {
        const optVal = parseFloat(String(q.options[i]));
        if (Math.abs(optVal - expected) < 0.01) {
          if (q.correct !== i) {
            addError(testId, q, 'Wrong answer', `Option ${i} (${q.options[i]})`,
              `${a}x = ${c} → x = ${expected}`);
          }
          return;
        }
      }
    }
  }

  m = text.match(/If (\d+)x\s*\+\s*(\d+)\s*=\s*(\d+)/i);
  if (m) {
    const a = parseInt(m[1]), b = parseInt(m[2]), c = parseInt(m[3]);
    const expected = (c - b) / a;
    if (Number.isInteger(expected)) {
      for (let i = 0; i < q.options.length; i++) {
        const optVal = parseFloat(String(q.options[i]));
        if (Math.abs(optVal - expected) < 0.01) {
          if (q.correct !== i) {
            addError(testId, q, 'Wrong answer', `Option ${i} (${q.options[i]})`,
              `${a}x + ${b} = ${c} → x = ${expected}`);
          }
          return;
        }
      }
    }
  }

  m = text.match(/If (\d+)x\s*-\s*(\d+)\s*=\s*(\d+)/i);
  if (m) {
    const a = parseInt(m[1]), b = parseInt(m[2]), c = parseInt(m[3]);
    const expected = (c + b) / a;
    if (Number.isInteger(expected)) {
      for (let i = 0; i < q.options.length; i++) {
        const optVal = parseFloat(String(q.options[i]));
        if (Math.abs(optVal - expected) < 0.01) {
          if (q.correct !== i) {
            addError(testId, q, 'Wrong answer', `Option ${i} (${q.options[i]})`,
              `${a}x - ${b} = ${c} → x = ${expected}`);
          }
          return;
        }
      }
    }
  }
}

// Check letter-position coding questions (LION = 12-9-15-14 type)
function checkLetterPositionCoding(testId, q) {
  const text = q.question;
  
  // Pattern: WORD = num-num-num..., then OTHERWORD = ?
  const m = text.match(/([A-Z]+)\s*(?:=|is written as|is coded as)\s*([\d]+-[\d]+(?:-[\d]+)*)/i);
  if (!m) return;
  
  // Find the word to encode in the question
  const m2 = text.match(/then\s+([A-Z]+)\s*(?:=|is written as|is coded as)/i);
  if (!m2) return;
  
  const targetWord = m2[1].toUpperCase();
  const expected = targetWord.split('').map(c => letterPos(c)).join('-');
  
  // Find matching option
  for (let i = 0; i < q.options.length; i++) {
    if (q.options[i] === expected) {
      if (q.correct !== i) {
        addError(testId, q, 'Wrong answer', `Option ${i} (${q.options[i]})`,
          `${targetWord} = ${expected} using letter positions`);
      }
      return;
    }
  }
}

// Check +1/-1 shift coding questions (BLUE → CMVF type)
function checkShiftCoding(testId, q) {
  const text = q.question;
  
  // Pattern: WORD is coded as CODED... How is OTHERWORD written?
  const m = text.match(/([A-Z]+)\s+is\s+(?:coded|written)\s+as\s+([A-Z]+)/i);
  if (!m) return;
  
  const original = m[1].toUpperCase();
  const coded = m[2].toUpperCase();
  
  if (original.length !== coded.length) return;
  
  // Determine shift per position
  const shifts = [];
  let consistent = true;
  for (let i = 0; i < original.length; i++) {
    const shift = (coded.charCodeAt(i) - original.charCodeAt(i) + 26) % 26;
    shifts.push(shift);
  }
  
  // Check if all shifts are the same
  const allSame = shifts.every(s => s === shifts[0]);
  if (!allSame) return; // Complex/inconsistent pattern, skip automated check
  
  const shift = shifts[0];
  
  // Find target word
  const m2 = text.match(/(?:How is|then)\s+([A-Z]+)\s+(?:written|coded)/i);
  if (!m2) return;
  
  const target = m2[1].toUpperCase();
  const expectedCoded = target.split('').map(c => {
    return String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26) + 65);
  }).join('');
  
  for (let i = 0; i < q.options.length; i++) {
    if (q.options[i] === expectedCoded) {
      if (q.correct !== i) {
        addError(testId, q, 'Wrong answer', `Option ${i} (${q.options[i]})`,
          `Using shift +${shift}: ${target} → ${expectedCoded}`);
      }
      return;
    }
  }
}

// Check CAT = 3120 style concatenation coding
function checkConcatCoding(testId, q) {
  const text = q.question;
  
  const m = text.match(/([A-Z]+)\s*=\s*(\d+),?\s*then\s+([A-Z]+)\s*=\s*\?/i);
  if (!m) return;
  
  const word1 = m[1].toUpperCase();
  const code1 = m[2];
  const word2 = m[3].toUpperCase();
  
  // Verify the encoding by checking if word1 encodes to code1 via concatenation
  const expected1 = word1.split('').map(c => letterPos(c)).join('');
  if (expected1 !== code1) return; // Different encoding scheme
  
  const expected2 = word2.split('').map(c => letterPos(c)).join('');
  
  for (let i = 0; i < q.options.length; i++) {
    const optClean = String(q.options[i]).replace(/\s/g, '');
    if (optClean === expected2) {
      if (q.correct !== i) {
        addError(testId, q, 'Wrong answer', `Option ${i} (${q.options[i]})`,
          `${word2} position values concatenated = ${expected2}`);
      }
      return;
    }
  }
  
  // If expected answer not in options, that's also a problem
  const optionValues = q.options.map(o => String(o).replace(/\s/g, ''));
  if (!optionValues.includes(expected2)) {
    // Check if the marked answer is different from expected
    addError(testId, q, 'Wrong answer or missing correct option', `Expected ${expected2}`,
      `${word2} = ${word2.split('').map(c => c + '=' + letterPos(c)).join(', ')} → concatenated: ${expected2}. Marked answer: ${q.options[q.correct]}`);
  }
}

// Check alphabet position questions ("what letter is N?")
function checkAlphabetPosition(testId, q) {
  const text = q.question;
  const m = text.match(/what letter is (\d+)/i);
  if (!m) return;
  
  const pos = parseInt(m[1]);
  if (pos < 1 || pos > 26) return;
  
  const expected = String.fromCharCode(64 + pos);
  for (let i = 0; i < q.options.length; i++) {
    if (q.options[i].toUpperCase() === expected) {
      if (q.correct !== i) {
        addError(testId, q, 'Wrong answer', `Option ${i} (${q.options[i]})`,
          `Position ${pos} in alphabet = ${expected}`);
      }
      return;
    }
  }
}

// Check sum of letter positions
function checkLetterSum(testId, q) {
  const text = q.question;
  const m = text.match(/sum of (?:the )?(?:letters|values) (?:in|of)\s+['']([A-Z]+)['']/i);
  if (!m) return;
  
  const word = m[1].toUpperCase();
  const sum = word.split('').reduce((acc, c) => acc + letterPos(c), 0);
  
  for (let i = 0; i < q.options.length; i++) {
    const optVal = parseInt(q.options[i]);
    if (optVal === sum) {
      if (q.correct !== i) {
        addError(testId, q, 'Wrong answer', `Option ${i} (${q.options[i]})`,
          `${word} = ${word.split('').map(c => c + '=' + letterPos(c)).join(' + ')} = ${sum}`);
      }
      return;
    }
  }
}

// Check cube/geometry facts
function checkGeometryFacts(testId, q) {
  const text = q.question.toLowerCase();
  
  if (text.includes('cube') && text.includes('faces')) {
    const expected = 6;
    for (let i = 0; i < q.options.length; i++) {
      if (parseInt(q.options[i]) === expected && q.correct !== i) {
        addError(testId, q, 'Wrong answer', `Option ${i} (${q.options[i]})`, `A cube has 6 faces`);
        return;
      }
    }
  }
  
  if (text.includes('cube') && text.includes('edges')) {
    const expected = 12;
    for (let i = 0; i < q.options.length; i++) {
      if (parseInt(q.options[i]) === expected && q.correct !== i) {
        addError(testId, q, 'Wrong answer', `Option ${i} (${q.options[i]})`, `A cube has 12 edges`);
        return;
      }
    }
  }
  
  if (text.includes('cube') && text.includes('vertices')) {
    const expected = 8;
    for (let i = 0; i < q.options.length; i++) {
      if (parseInt(q.options[i]) === expected && q.correct !== i) {
        addError(testId, q, 'Wrong answer', `Option ${i} (${q.options[i]})`, `A cube has 8 vertices`);
        return;
      }
    }
  }
  
  if (text.includes('right angle') && text.includes('square')) {
    const expected = 4;
    for (let i = 0; i < q.options.length; i++) {
      if (parseInt(q.options[i]) === expected && q.correct !== i) {
        addError(testId, q, 'Wrong answer', `Option ${i} (${q.options[i]})`, `A square has 4 right angles`);
        return;
      }
    }
  }
}

// Check discount questions
function checkDiscount(testId, q) {
  const text = q.question;
  const m = text.match(/costs?\s*₹?(\d+(?:\.\d+)?)\s+.*?(?:discount(?:ed)?|off)\s+(\d+(?:\.\d+)?)%/i);
  if (!m) return;
  
  const price = parseFloat(m[1]);
  const discount = parseFloat(m[2]);
  const finalPrice = price * (1 - discount / 100);
  
  for (let i = 0; i < q.options.length; i++) {
    const optVal = parseFloat(String(q.options[i]).replace(/[₹,\s]/g, ''));
    if (Math.abs(optVal - finalPrice) < 0.01) {
      if (q.correct !== i) {
        addError(testId, q, 'Wrong answer', `Option ${i} (${q.options[i]})`,
          `${price} - ${discount}% = ${finalPrice}`);
      }
      return;
    }
  }
}

// Check speed-distance-time questions
function checkSpeedDistance(testId, q) {
  const text = q.question;
  
  // "travels X km in Y hour(s), how far in Z hours?"
  const m = text.match(/travels?\s+(\d+)\s*km\s+in\s+(\d+)\s*hours?\s*.*?(?:how far|distance)\s+(?:in\s+)?(\d+)\s*hours?/i);
  if (!m) return;
  
  const dist = parseFloat(m[1]);
  const time1 = parseFloat(m[2]);
  const time2 = parseFloat(m[3]);
  const speed = dist / time1;
  const expected = speed * time2;
  
  for (let i = 0; i < q.options.length; i++) {
    const optVal = parseFloat(String(q.options[i]).replace(/[₹,\skm]/g, ''));
    if (Math.abs(optVal - expected) < 0.01) {
      if (q.correct !== i) {
        addError(testId, q, 'Wrong answer', `Option ${i} (${q.options[i]})`,
          `Speed = ${speed} km/h, distance in ${time2}h = ${expected} km`);
      }
      return;
    }
  }
}

// Main processing
for (let t = 1; t <= 20; t++) {
  const filePath = path.join(testsDir, `test${t}.json`);
  let data;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading test${t}.json: ${e.message}`);
    continue;
  }
  
  for (const q of data.questions) {
    totalChecked++;
    
    // Basic checks
    if (q.correct < 0 || q.correct >= q.options.length) {
      addError(t, q, 'Invalid correct index', null, `correct=${q.correct} but only ${q.options.length} options`);
      continue;
    }
    
    checkDuplicateOptions(t, q);
    
    // Section-specific checks
    if (q.section === 'Numerical Ability') {
      checkNumerical(t, q);
      checkDiscount(t, q);
      checkSpeedDistance(t, q);
    }
    
    if (q.section === 'Coding-Decoding') {
      checkLetterPositionCoding(t, q);
      checkShiftCoding(t, q);
      checkConcatCoding(t, q);
      checkAlphabetPosition(t, q);
      checkLetterSum(t, q);
    }
    
    checkGeometryFacts(t, q);
  }
}

console.log(`Total questions checked: ${totalChecked}`);
console.log(`Automated errors found: ${errors.length}`);
console.log('\n--- ERRORS ---');
for (const e of errors) {
  console.log(`\nTest ${e.testId}, Q${e.questionId} (${e.section})`);
  console.log(`  Question: ${e.question}`);
  console.log(`  Options: ${JSON.stringify(e.options)}`);
  console.log(`  Marked correct: ${e.markedCorrect} (${e.markedAnswer})`);
  console.log(`  Issue: ${e.issue}`);
  console.log(`  Should be: ${e.correctShouldBe}`);
  console.log(`  Reasoning: ${e.reasoning}`);
}

// Also dump all questions for manual review
console.log('\n\n=== ALL QUESTIONS FOR MANUAL REVIEW ===');
for (let t = 1; t <= 20; t++) {
  const filePath = path.join(testsDir, `test${t}.json`);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) { continue; }
  
  console.log(`\n### TEST ${t} ###`);
  for (const q of data.questions) {
    console.log(`Q${q.id} [${q.section}] correct=${q.correct}: ${q.question}`);
    console.log(`  Options: ${JSON.stringify(q.options)} → Answer: ${q.options[q.correct]}`);
  }
}
