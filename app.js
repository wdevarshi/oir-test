var timeLimit = 1800; // default 30 minutes, overridden by test JSON
var timeLeft = 1800;
var timerInterval = null;
var userAnswers = {};
var testStartTime;
var testEndTime;
var currentTest = null;
var warningShown = false;
var testSubmitted = false;
var visibilityHandler = null;
var beforeUnloadHandler = null;

// Escape plain-text values for safe innerHTML insertion
function escapeHTML(str) {
    if (typeof str !== 'string') return String(str);
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Sanitize HTML: allow only safe formatting tags (strong, em, sub, sup, br)
// Uses DOMParser to parse then reconstructs with whitelisted tags only — no attributes copied
function sanitizeHTML(str) {
    if (typeof str !== 'string') return escapeHTML(str);
    var doc = new DOMParser().parseFromString(str, 'text/html');
    var allowed = ['STRONG', 'EM', 'SUB', 'SUP', 'BR'];
    function walk(node) {
        var out = '';
        for (var i = 0; i < node.childNodes.length; i++) {
            var child = node.childNodes[i];
            if (child.nodeType === 3) {
                out += escapeHTML(child.textContent);
            } else if (child.nodeType === 1 && allowed.indexOf(child.tagName) !== -1) {
                var tag = child.tagName.toLowerCase();
                if (tag === 'br') {
                    out += '<br>';
                } else {
                    out += '<' + tag + '>' + walk(child) + '</' + tag + '>';
                }
            } else if (child.nodeType === 1) {
                // Unknown tag — keep text content but strip the tag itself
                out += walk(child);
            }
        }
        return out;
    }
    return walk(doc.body);
}

// Get test ID from URL parameter
function getTestId() {
    var params = new URLSearchParams(window.location.search);
    return parseInt(params.get('testId')) || 1;
}

// Show a visible error in the page
function showError(message) {
    var errorEl = document.getElementById('errorSection');
    if (errorEl) {
        errorEl.style.display = 'block';
        errorEl.innerHTML =
            '<div style="background:#fff3f3;border:1px solid #e57373;border-radius:10px;padding:24px;text-align:center;margin:20px 0;" role="alert">' +
            '<h3 style="color:#c62828;margin:0 0 8px;">⚠️ Something went wrong</h3>' +
            '<p style="color:#444;margin:0 0 16px;">' + escapeHTML(message) + '</p>' +
            '<a href="index.html" style="display:inline-block;padding:10px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;">← Back to Home</a>' +
            '</div>';
    }
    var introEl = document.getElementById('introSection');
    if (introEl) introEl.style.display = 'none';
}

// Load test data from JSON file
async function loadTestData() {
    var testId = getTestId();

    try {
        var response = await fetch('tests/test' + testId + '.json');

        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }

        currentTest = await response.json();

        if (!currentTest || !Array.isArray(currentTest.questions) || currentTest.questions.length === 0) {
            throw new Error('Test has no questions');
        }

        document.getElementById('testTitle').textContent = '\uD83C\uDFAF ' + currentTest.title;

        // Use timeLimit from JSON if available, else default 1800s
        timeLimit = currentTest.timeLimit || 1800;
        timeLeft = timeLimit;

    } catch (error) {
        showError('Could not load Test ' + testId + '. Please go back and try another test.');
    }
}

// Initialize page
window.addEventListener('DOMContentLoaded', async function () {
    await loadTestData();
});

function startTest() {
    // Guard: don't start if test data hasn't loaded
    if (!currentTest || !currentTest.questions) {
        showError('Test data failed to load. Please go back and try again.');
        return;
    }

    // Hide intro, show test
    document.getElementById('introSection').style.display = 'none';
    document.getElementById('timerSection').style.display = 'flex';
    document.getElementById('testSection').style.display = 'block';

    testSubmitted = false;

    // Start timer using wall-clock deadline
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

    timerInterval = setInterval(function () {
        // Wall-clock time: resilient to background-tab throttling
        var now = Date.now();
        timeLeft = Math.max(0, Math.ceil((testEndTime - now) / 1000));
        updateTimerDisplay();

        // Warning at 5 minutes (use flag since wall-clock may skip exact 300)
        if (timeLeft <= 300 && !warningShown) {
            warningShown = true;
            var timerSection = document.getElementById('timerSection');
            timerSection.classList.add('warning');
            timerSection.setAttribute('aria-live', 'assertive');
            alert('\u26A0\uFE0F 5 minutes remaining! Speed up!');
        }

        // Auto-submit at 0
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            autoSubmit();
        }
    }, 1000);
}

// When user returns to tab, immediately sync timer (catches background throttle)
visibilityHandler = function () {
    if (!document.hidden && timerInterval && !testSubmitted) {
        var now = Date.now();
        timeLeft = Math.max(0, Math.ceil((testEndTime - now) / 1000));
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            autoSubmit();
        }
    }
};
document.addEventListener('visibilitychange', visibilityHandler);

function updateTimerDisplay() {
    var minutes = Math.floor(timeLeft / 60);
    var seconds = timeLeft % 60;
    var display = (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    var timerEl = document.getElementById('timer');
    if (timerEl) timerEl.textContent = display;
}

function loadQuestions() {
    var testSection = document.getElementById('testSection');
    var html = '';
    var currentSection = '';

    currentTest.questions.forEach(function (q, index) {
        var qId = parseInt(q.id);
        if (isNaN(qId)) qId = index + 1;

        // Add section header if new section
        if (q.section !== currentSection) {
            currentSection = q.section;
            var firstInSection = currentTest.questions.findIndex(function (ques) { return ques.section === currentSection; });
            var sectionLetter = getSectionLetter(firstInSection);
            html += '<h2 class="section-header">Section ' + sectionLetter + ': ' + escapeHTML(currentSection) + '</h2>';
        }

        html += '<div class="question" role="group" aria-labelledby="q' + qId + '_label">';
        html += '<div class="question-text" id="q' + qId + '_label"><strong>Q' + qId + '.</strong> ' + sanitizeHTML(q.question) + '</div>';
        html += '<div class="options" role="radiogroup" aria-labelledby="q' + qId + '_label">';

        q.options.forEach(function (option, optIndex) {
            var letter = String.fromCharCode(97 + optIndex);
            html += '<div class="option">';
            html += '<input type="radio" id="q' + qId + '_' + optIndex + '" name="q' + qId + '" value="' + optIndex + '"';
            html += ' onchange="saveAnswer(' + qId + ', ' + optIndex + ')"';
            html += ' aria-label="Option ' + letter + ': ' + escapeHTML(option) + '">';
            html += '<label for="q' + qId + '_' + optIndex + '">' + letter + ') ' + sanitizeHTML(option) + '</label>';
            html += '</div>';
        });

        html += '</div></div>';
    });

    html += '<button class="submit-btn" onclick="submitTest()" aria-label="Submit test">\uD83D\uDCDD Submit Test</button>';
    testSection.innerHTML = html;
}

function getSectionLetter(index) {
    if (!currentTest || !currentTest.sections) return 'A';
    var sections = currentTest.sections;
    var cumulative = 0;
    for (var i = 0; i < sections.length; i++) {
        cumulative += sections[i].questionsCount;
        if (index < cumulative) return String.fromCharCode(65 + i);
    }
    return String.fromCharCode(65 + sections.length - 1);
}

function saveAnswer(questionId, answerIndex) {
    userAnswers[questionId] = answerIndex;
}

function submitTest() {
    if (testSubmitted) return;

    // Set flag FIRST to prevent race with autoSubmit during confirm() dialog
    testSubmitted = true;

    var answered = Object.keys(userAnswers).length;
    var unanswered = currentTest.questions.length - answered;

    if (unanswered > 0) {
        var proceed = window.confirm(
            '\u26A0\uFE0F You have ' + unanswered + ' unanswered questions!\n\nAre you sure you want to submit?'
        );
        if (!proceed) {
            testSubmitted = false;
            return;
        }
    }

    clearInterval(timerInterval);
    timerInterval = null;
    calculateResults();
}

function autoSubmit() {
    if (testSubmitted) return;
    testSubmitted = true;
    alert('\u23F0 Time\u2019s up! Auto-submitting your test...');
    calculateResults();
}

function calculateResults() {
    if (!currentTest || !currentTest.questions) return;

    var totalScore = 0;
    var sectionScores = {};
    var wrongAnswers = [];

    // Initialize section scores
    if (currentTest.sections) {
        currentTest.sections.forEach(function (section) {
            sectionScores[section.name] = { score: 0, total: 0 };
        });
    }

    currentTest.questions.forEach(function (q) {
        if (sectionScores[q.section]) {
            sectionScores[q.section].total++;
        }

        var userAnswer = userAnswers[q.id];

        if (userAnswer === q.correct) {
            totalScore++;
            if (sectionScores[q.section]) sectionScores[q.section].score++;
        } else {
            wrongAnswers.push({
                id: q.id,
                question: q.question,
                userAnswer: userAnswer !== undefined ? q.options[userAnswer] : 'Not answered',
                correctAnswer: q.options[q.correct],
                explanation: q.explanation || ''
            });
        }
    });

    var timeTaken = Math.floor((Date.now() - testStartTime) / 1000);
    var totalQuestions = currentTest.questions.length;
    var percentage = ((totalScore / totalQuestions) * 100).toFixed(1);

    var result = {
        testId: currentTest.testId,
        testTitle: currentTest.title,
        timestamp: Date.now(),
        score: totalScore,
        totalQuestions: totalQuestions,
        percentage: parseFloat(percentage),
        timeTaken: timeTaken,
        sectionScores: sectionScores
    };

    saveTestResult(result);
    displayResults(totalScore, sectionScores, wrongAnswers, percentage, timeTaken);

    // Clean up event listeners after test is complete
    if (visibilityHandler) {
        document.removeEventListener('visibilitychange', visibilityHandler);
        visibilityHandler = null;
    }
    if (beforeUnloadHandler) {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
        beforeUnloadHandler = null;
    }
}

function displayResults(totalScore, sectionScores, wrongAnswers, percentage, timeTaken) {
    document.getElementById('timerSection').style.display = 'none';
    document.getElementById('testSection').style.display = 'none';
    var progressBar = document.getElementById('progressBar');
    if (progressBar) progressBar.style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';

    var minutesTaken = Math.floor(timeTaken / 60);
    var secondsTaken = timeTaken % 60;
    var totalQuestions = currentTest.questions.length;

    var html = '<div class="score-card">' +
        '<h2>\uD83C\uDFAF Your Score</h2>' +
        '<div class="score">' + totalScore + '/' + totalQuestions + '</div>' +
        '<p style="font-size: 1.5em; margin-top: 10px;">' + escapeHTML(percentage) + '%</p>' +
        '<p style="margin-top: 10px;">Time Taken: ' + minutesTaken + 'm ' + secondsTaken + 's</p>' +
        '</div>';

    html += '<div class="section-scores">';
    Object.entries(sectionScores).forEach(function (entry) {
        var section = entry[0];
        var data = entry[1];
        var pct = data.total > 0 ? Math.round((data.score / data.total) * 100) : 0;
        html += '<div class="section-score">' +
            '<h3>' + escapeHTML(section) + '</h3>' +
            '<div class="score">' + data.score + '/' + data.total + '</div>' +
            '<p>' + pct + '%</p>' +
            '</div>';
    });
    html += '</div>';

    html += '<div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">' +
        '<h2 style="color: #2e7d32; margin-bottom: 10px;">\uD83D\uDCCA Performance Evaluation</h2>' +
        '<p style="font-size: 1.2em; color: #1b5e20;">' + getPerformanceMessage(parseFloat(percentage)) + '</p>' +
        '</div>';

    if (wrongAnswers.length > 0) {
        html += '<div class="wrong-answers">' +
            '<h3>\u274C Questions to Review (' + wrongAnswers.length + ')</h3>';
        wrongAnswers.forEach(function (wa) {
            html += '<div class="wrong-answer-item">' +
                '<p><strong>Q' + escapeHTML(wa.id) + ':</strong> ' + sanitizeHTML(wa.question) + '</p>' +
                '<p><strong>Your Answer:</strong> ' + sanitizeHTML(wa.userAnswer) + '</p>' +
                '<p><strong>Correct Answer:</strong> ' + sanitizeHTML(wa.correctAnswer) + '</p>' +
                '<div class="explanation"><strong>\uD83D\uDCA1 Explanation:</strong> ' + sanitizeHTML(wa.explanation) + '</div>' +
                '</div>';
        });
        html += '</div>';
    } else {
        html += '<div style="background: #4caf50; color: white; padding: 30px; border-radius: 10px; text-align: center;">' +
            '<h2>\uD83C\uDFC6 PERFECT SCORE!</h2>' +
            '<p style="font-size: 1.3em;">You got all ' + totalQuestions + ' questions correct! Outstanding! \uD83D\uDD25</p>' +
            '</div>';
    }

    html += '<div class="result-actions">' +
        '<button class="btn-primary" onclick="location.href=\'index.html\'" aria-label="Back to home">\uD83C\uDFE0 Back to Home</button>' +
        '<button class="btn-secondary" onclick="location.href=\'dashboard.html\'" aria-label="View dashboard">\uD83D\uDCCA View Dashboard</button>' +
        '<button class="retry-btn" onclick="location.reload()" aria-label="Retake this test">\uD83D\uDD04 Retake This Test</button>' +
        '</div>';

    document.getElementById('resultsSection').innerHTML = html;
    window.scrollTo(0, 0);
}

function getPerformanceMessage(percentage) {
    if (percentage >= 90) {
        return "\uD83D\uDD25 EXCELLENT! You're well-prepared for AFSB OIR! Keep this performance up!";
    } else if (percentage >= 80) {
        return "\u2705 VERY GOOD! You're above passing standard. Review wrong answers and practice more.";
    } else if (percentage >= 70) {
        return "\uD83D\uDC4D GOOD! You're on track. Focus on weak areas and practice daily.";
    } else if (percentage >= 60) {
        return "\u26A0\uFE0F AVERAGE! You need more practice. Work on all sections intensively.";
    } else {
        return "\uD83D\uDEA8 NEEDS IMPROVEMENT! Practice 100+ questions daily. Don't give up!";
    }
}

// Prevent accidental page close during active test
beforeUnloadHandler = function (e) {
    if (timerInterval && !testSubmitted) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
};
window.addEventListener('beforeunload', beforeUnloadHandler);
