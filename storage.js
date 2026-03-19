// storage.js — LocalStorage wrapper for OIR Test Platform

const OIR_STORAGE_KEY = 'oirTestResults';

// Save a test result
function saveTestResult(result) {
    const results = getTestResults();
    results.push(result);
    localStorage.setItem(OIR_STORAGE_KEY, JSON.stringify(results));
}

// Get all test results
function getTestResults() {
    const data = localStorage.getItem(OIR_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Get results for a specific test
function getTestResultsById(testId) {
    return getTestResults().filter(r => r.testId === testId);
}

// Get best score for a test
function getBestScore(testId) {
    const results = getTestResultsById(testId);
    if (results.length === 0) return null;
    return Math.max(...results.map(r => r.score));
}

// Get latest result for a test
function getLatestResult(testId) {
    const results = getTestResultsById(testId);
    if (results.length === 0) return null;
    return results.sort((a, b) => b.timestamp - a.timestamp)[0];
}

// Get overall stats across all tests
function getOverallStats() {
    const results = getTestResults();
    if (results.length === 0) return null;

    const avgScore = results.reduce((sum, r) => sum + r.percentage, 0) / results.length;
    const bestResult = results.reduce((best, r) => r.percentage > best.percentage ? r : best);

    // Aggregate section scores
    const sectionTotals = {};
    results.forEach(r => {
        if (r.sectionScores) {
            Object.entries(r.sectionScores).forEach(([section, data]) => {
                if (!sectionTotals[section]) {
                    sectionTotals[section] = { correct: 0, total: 0 };
                }
                sectionTotals[section].correct += data.score;
                sectionTotals[section].total += data.total;
            });
        }
    });

    // Find weakest section
    let weakest = null;
    let weakestPct = 100;
    Object.entries(sectionTotals).forEach(([section, data]) => {
        const pct = data.total > 0 ? (data.correct / data.total) * 100 : 0;
        if (pct < weakestPct) {
            weakestPct = pct;
            weakest = section;
        }
    });

    return {
        testsTaken: results.length,
        uniqueTests: new Set(results.map(r => r.testId)).size,
        avgScore: parseFloat(avgScore.toFixed(1)),
        bestScore: bestResult.score,
        bestPercentage: bestResult.percentage,
        bestTest: bestResult.testTitle || `Test ${bestResult.testId}`,
        weakestSection: weakest,
        weakestPct: parseFloat(weakestPct.toFixed(1)),
        sectionPerformance: sectionTotals
    };
}

// Get test status for a given testId (for test cards)
function getTestStatus(testId) {
    const results = getTestResultsById(testId);
    if (results.length === 0) {
        return { status: 'not_taken', attempts: 0 };
    }
    const best = Math.max(...results.map(r => r.score));
    const bestPct = Math.max(...results.map(r => r.percentage));
    const latest = results.sort((a, b) => b.timestamp - a.timestamp)[0];
    const total = latest.totalQuestions;
    return {
        status: 'completed',
        attempts: results.length,
        bestScore: best,
        bestPercentage: bestPct,
        totalQuestions: total,
        lastDate: new Date(latest.timestamp).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        })
    };
}

// Clear all progress
function resetAllProgress() {
    if (confirm('⚠️ This will delete ALL your test history and progress!\n\nAre you sure?')) {
        localStorage.removeItem(OIR_STORAGE_KEY);
        return true;
    }
    return false;
}

// Export results as CSV
function exportToCSV() {
    const results = getTestResults();
    if (results.length === 0) {
        alert('No test results to export!');
        return;
    }

    let csv = 'Test,Date,Score,Total,Percentage,Time (sec),Verbal,Non-Verbal,Numerical,Coding-Decoding\n';

    results.forEach(r => {
        const date = new Date(r.timestamp).toLocaleDateString('en-IN');
        const s = r.sectionScores || {};
        const verbal = s['Verbal Reasoning'] ? `${s['Verbal Reasoning'].score}/${s['Verbal Reasoning'].total}` : '-';
        const nonVerbal = s['Non-Verbal Reasoning'] ? `${s['Non-Verbal Reasoning'].score}/${s['Non-Verbal Reasoning'].total}` : '-';
        const numerical = s['Numerical Ability'] ? `${s['Numerical Ability'].score}/${s['Numerical Ability'].total}` : '-';
        const coding = s['Coding-Decoding'] ? `${s['Coding-Decoding'].score}/${s['Coding-Decoding'].total}` : '-';
        csv += `${r.testTitle || 'Test ' + r.testId},${date},${r.score},${r.totalQuestions},${r.percentage}%,${r.timeTaken},${verbal},${nonVerbal},${numerical},${coding}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OIR_Results_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
