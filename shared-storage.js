// Shared Storage Module
// This module provides shared storage functionality for all pages

const STORAGE_KEYS = {
    teams: 'scoreboard_teams',
    levels: 'scoreboard_levels',
    progressHistory: 'scoreboard_progress'
};

class StorageManager {
    // Teams
    static loadTeams() {
        const data = localStorage.getItem(STORAGE_KEYS.teams);
        return data ? JSON.parse(data) : [];
    }

    static saveTeams(teams) {
        localStorage.setItem(STORAGE_KEYS.teams, JSON.stringify(teams));
    }

    // Levels
    static loadLevels() {
        const data = localStorage.getItem(STORAGE_KEYS.levels);
        return data ? JSON.parse(data) : [];
    }

    static saveLevels(levels) {
        localStorage.setItem(STORAGE_KEYS.levels, JSON.stringify(levels));
    }

    // Progress History
    static loadProgressHistory() {
        const data = localStorage.getItem(STORAGE_KEYS.progressHistory);
        return data ? JSON.parse(data) : [];
    }

    static saveProgressHistory(history) {
        localStorage.setItem(STORAGE_KEYS.progressHistory, JSON.stringify(history));
    }

    static addProgressRecord(teamId, teamName, levelId, levelName) {
        const history = this.loadProgressHistory();
        history.push({
            teamId: teamId,
            teamName: teamName,
            levelId: levelId,
            levelName: levelName,
            timestamp: new Date().toISOString()
        });
        this.saveProgressHistory(history);
        return history[history.length - 1];
    }
}

// Celebration utility
function playSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99]; // C, E, G notes

        notes.forEach((frequency, index) => {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            oscillator.connect(gain);
            gain.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';

            const startTime = audioContext.currentTime + index * 0.1;
            gain.gain.setValueAtTime(0.3, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    } catch (e) {
        console.log('Audio not available');
    }
}

function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    if (!confettiContainer) return;

    confettiContainer.innerHTML = '';

    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#ffd700'];

    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.delay = Math.random() * 0.5 + 's';
        piece.style.width = Math.random() * 10 + 5 + 'px';
        piece.style.height = piece.style.width;
        confettiContainer.appendChild(piece);
    }
}

function showCelebration(message) {
    const celebration = document.getElementById('celebration');
    const celebrationText = document.getElementById('celebrationText');

    if (!celebration) return;

    celebrationText.textContent = message;
    celebration.classList.add('active');

    createConfetti();
    playSound();

    setTimeout(() => {
        celebration.classList.remove('active');
    }, 2000);
}
