let timeLeft = 1800; // 30 minutes in seconds
let timerInterval;
let userAnswers = {};
let testStartTime;

function startTest() {
    // Hide intro, show test
    document.getElementById('introSection').style.display = 'none';
    document.getElementById('timerSection').style.display = 'flex';
    document.getElementById('testSection').style.display = 'block';
    
    // Start timer
    testStartTime = Date.now();
    startTimer();
    
    // Load questions
    loadQuestions();
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function startTimer() {
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        // Warning at 5 minutes
        if (timeLeft === 300) {
            document.getElementById('timerSection').classList.add('warning');
            alert('⚠️ 5 minutes remaining! Speed up!');
        }
        
        // Auto-submit at 0
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            autoSubmit();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function loadQuestions() {
    const testSection = document.getElementById('testSection');
    let html = '';
    
    let currentSection = '';
    
    questions.forEach((q, index) => {
        // Add section header if new section
        if (q.section !== currentSection) {
            currentSection = q.section;
            html += `<div class="section-header">Section ${getSectionLetter(index)}: ${q.section}</div>`;
        }
        
        // Add question
        html += `
            <div class="question">
                <div class="question-text">
                    <strong>Q${q.id}.</strong> ${q.question}
                </div>
                <div class="options">
                    ${q.options.map((option, optIndex) => `
                        <div class="option">
                            <input type="radio" 
                                   id="q${q.id}_${optIndex}" 
                                   name="q${q.id}" 
                                   value="${optIndex}"
                                   onchange="saveAnswer(${q.id}, ${optIndex})">
                            <label for="q${q.id}_${optIndex}">
                                ${String.fromCharCode(97 + optIndex)}) ${option}
                            </label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    html += '<button class="submit-btn" onclick="submitTest()">📝 Submit Test</button>';
    
    testSection.innerHTML = html;
}

function getSectionLetter(index) {
    if (index < 15) return 'A';
    if (index < 30) return 'B';
    if (index < 45) return 'C';
    return 'D';
}

function saveAnswer(questionId, answerIndex) {
    userAnswers[questionId] = answerIndex;
}

function submitTest() {
    const answered = Object.keys(userAnswers).length;
    const unanswered = questions.length - answered;
    
    if (unanswered > 0) {
        const confirm = window.confirm(
            `⚠️ You have ${unanswered} unanswered questions!\n\nAre you sure you want to submit?`
        );
        if (!confirm) return;
    }
    
    clearInterval(timerInterval);
    calculateResults();
}

function autoSubmit() {
    alert('⏰ Time\'s up! Auto-submitting your test...');
    calculateResults();
}

function calculateResults() {
    let totalScore = 0;
    let sectionScores = {
        'Verbal Reasoning': { score: 0, total: 0 },
        'Non-Verbal Reasoning': { score: 0, total: 0 },
        'Numerical Ability': { score: 0, total: 0 },
        'Coding-Decoding': { score: 0, total: 0 }
    };
    let wrongAnswers = [];
    
    questions.forEach(q => {
        sectionScores[q.section].total++;
        
        const userAnswer = userAnswers[q.id];
        
        if (userAnswer === q.correct) {
            totalScore++;
            sectionScores[q.section].score++;
        } else {
            wrongAnswers.push({
                id: q.id,
                question: q.question,
                userAnswer: userAnswer !== undefined ? q.options[userAnswer] : 'Not answered',
                correctAnswer: q.options[q.correct],
                explanation: q.explanation
            });
        }
    });
    
    displayResults(totalScore, sectionScores, wrongAnswers);
}

function displayResults(totalScore, sectionScores, wrongAnswers) {
    // Hide test, show results
    document.getElementById('timerSection').style.display = 'none';
    document.getElementById('testSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    
    const percentage = ((totalScore / questions.length) * 100).toFixed(1);
    const timeTaken = Math.floor((Date.now() - testStartTime) / 1000);
    const minutesTaken = Math.floor(timeTaken / 60);
    const secondsTaken = timeTaken % 60;
    
    let resultHTML = `
        <div class="score-card">
            <h2>🎯 Your Score</h2>
            <div class="score">${totalScore}/50</div>
            <p style="font-size: 1.5em; margin-top: 10px;">${percentage}%</p>
            <p style="margin-top: 10px;">Time Taken: ${minutesTaken}m ${secondsTaken}s</p>
        </div>
        
        <div class="section-scores">
            ${Object.entries(sectionScores).map(([section, data]) => `
                <div class="section-score">
                    <h3>${section}</h3>
                    <div class="score">${data.score}/${data.total}</div>
                    <p>${Math.round((data.score/data.total)*100)}%</p>
                </div>
            `).join('')}
        </div>
        
        <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
            <h2 style="color: #2e7d32; margin-bottom: 10px;">📊 Performance Evaluation</h2>
            <p style="font-size: 1.2em; color: #1b5e20;">
                ${getPerformanceMessage(percentage)}
            </p>
        </div>
    `;
    
    if (wrongAnswers.length > 0) {
        resultHTML += `
            <div class="wrong-answers">
                <h3>❌ Questions to Review (${wrongAnswers.length})</h3>
                ${wrongAnswers.map(wa => `
                    <div class="wrong-answer-item">
                        <p><strong>Q${wa.id}:</strong> ${wa.question}</p>
                        <p><strong>Your Answer:</strong> ${wa.userAnswer}</p>
                        <p><strong>Correct Answer:</strong> ${wa.correctAnswer}</p>
                        <div class="explanation">
                            <strong>💡 Explanation:</strong> ${wa.explanation}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        resultHTML += `
            <div style="background: #4caf50; color: white; padding: 30px; border-radius: 10px; text-align: center;">
                <h2>🏆 PERFECT SCORE!</h2>
                <p style="font-size: 1.3em;">You got all 50 questions correct! Outstanding! 🔥</p>
            </div>
        `;
    }
    
    resultHTML += '<button class="retry-btn" onclick="location.reload()">🔄 Take Another Test</button>';
    
    document.getElementById('resultsSection').innerHTML = resultHTML;
    window.scrollTo(0, 0);
}

function getPerformanceMessage(percentage) {
    if (percentage >= 90) {
        return "🔥 EXCELLENT! You're well-prepared for AFSB OIR! Keep this performance up!";
    } else if (percentage >= 80) {
        return "✅ VERY GOOD! You're above passing standard. Review wrong answers and practice more.";
    } else if (percentage >= 70) {
        return "👍 GOOD! You're on track. Focus on weak areas and practice daily.";
    } else if (percentage >= 60) {
        return "⚠️ AVERAGE! You need more practice. Work on all sections intensively.";
    } else {
        return "🚨 NEEDS IMPROVEMENT! Practice 100+ questions daily. Don't give up!";
    }
}

// Prevent accidental page close during test
window.addEventListener('beforeunload', function (e) {
    if (timerInterval) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});
