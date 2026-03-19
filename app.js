var timeLimit = 1800; // default 30 minutes, overridden by test JSON
var timeLeft = 1800;
var timerInterval = null;
var userAnswers = {};
var testStartTime;
var testEndTime;
var currentTest = null;
var warningShown = false;

// Escape plain-text values for safe innerHTML insertion
function escapeHTML(str) {
    if (typeof str !== 'string') return String(str);
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Get test ID from URL parameter
function getTestId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('testId')) || 1;
}

// Load test data from JSON file
async function loadTestData() {
    const testId = getTestId();
    
    try {
        const response = await fetch(`tests/test${testId}.json`);
        
        if (!response.ok) {
            throw new Error(`Test ${testId} not found`);
        }
        
        currentTest = await response.json();
        document.getElementById('testTitle').textContent = `🎯 ${currentTest.title}`;
        
        // Use timeLimit from JSON if available, else default 1800s
        timeLimit = currentTest.timeLimit || 1800;
        timeLeft = timeLimit;
        
    } catch (error) {
        console.error('Error loading test:', error);
        alert(`Error: Could not load Test ${testId}. Redirecting to home...`);
        window.location.href = 'index.html';
    }
}

// Initialize page
window.addEventListener('DOMContentLoaded', async function() {
    await loadTestData();
});

function startTest() {
    // Guard: don't start if test data hasn't loaded yet
    if (!currentTest || !currentTest.questions) {
        alert('Test data is still loading. Please wait a moment and try again.');
        return;
    }
    
    // Hide intro, show test
    document.getElementById('introSection').style.display = 'none';
    document.getElementById('timerSection').style.display = 'flex';
    document.getElementById('testSection').style.display = 'block';
    
    // Start timer using wall-clock deadline (resilient to throttled intervals)
    testStartTime = Date.now();
    testEndTime = testStartTime + (timeLimit * 1000);
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
    
    currentTest.questions.forEach((q, index) => {
        // Add section header if new section
        if (q.section !== currentSection) {
            currentSection = q.section;
            const sectionLetter = getSectionLetter(currentTest.questions.findIndex(ques => ques.section === currentSection));
            html += `<div class="section-header">Section ${sectionLetter}: ${q.section}</div>`;
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
    // Dynamically determine section letter based on the test's section definitions
    var sections = currentTest.sections;
    var cumulative = 0;
    for (var i = 0; i < sections.length; i++) {
        cumulative += sections[i].questionsCount;
        if (index < cumulative) return String.fromCharCode(65 + i); // A, B, C, D...
    }
    return String.fromCharCode(65 + sections.length - 1);
}

function saveAnswer(questionId, answerIndex) {
    userAnswers[questionId] = answerIndex;
}

function submitTest() {
    const answered = Object.keys(userAnswers).length;
    const unanswered = currentTest.questions.length - answered;
    
    if (unanswered > 0) {
        var proceed = window.confirm(
            '⚠️ You have ' + unanswered + ' unanswered questions!\n\nAre you sure you want to submit?'
        );
        if (!proceed) return;
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
    let sectionScores = {};
    let wrongAnswers = [];
    
    // Initialize section scores
    currentTest.sections.forEach(section => {
        sectionScores[section.name] = { score: 0, total: 0 };
    });
    
    currentTest.questions.forEach(q => {
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
    
    // Calculate time taken
    const timeTaken = Math.floor((Date.now() - testStartTime) / 1000);
    const percentage = ((totalScore / currentTest.questions.length) * 100).toFixed(1);
    
    // Save result to LocalStorage (omit wrongAnswers to save space)
    const result = {
        testId: currentTest.testId,
        testTitle: currentTest.title,
        timestamp: Date.now(),
        score: totalScore,
        totalQuestions: currentTest.questions.length,
        percentage: parseFloat(percentage),
        timeTaken: timeTaken,
        sectionScores: sectionScores
    };
    
    saveTestResult(result);
    
    // Display results
    displayResults(totalScore, sectionScores, wrongAnswers, percentage, timeTaken);
}

function displayResults(totalScore, sectionScores, wrongAnswers, percentage, timeTaken) {
    // Hide test, show results
    document.getElementById('timerSection').style.display = 'none';
    document.getElementById('testSection').style.display = 'none';
    var progressBar = document.getElementById('progressBar');
    if (progressBar) progressBar.style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    
    const minutesTaken = Math.floor(timeTaken / 60);
    const secondsTaken = timeTaken % 60;
    
    let resultHTML = `
        <div class="score-card">
            <h2>🎯 Your Score</h2>
            <div class="score">${totalScore}/${currentTest.questions.length}</div>
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
                ${getPerformanceMessage(parseFloat(percentage))}
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
                <p style="font-size: 1.3em;">You got all ${currentTest.questions.length} questions correct! Outstanding! 🔥</p>
            </div>
        `;
    }
    
    resultHTML += `
        <div class="result-actions">
            <button class="btn-primary" onclick="location.href='index.html'">🏠 Back to Home</button>
            <button class="btn-secondary" onclick="location.href='dashboard.html'">📊 View Dashboard</button>
            <button class="retry-btn" onclick="location.reload()">🔄 Retake This Test</button>
        </div>
    `;
    
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
