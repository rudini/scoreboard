// Check-In Page Logic

class CheckInPage {
    constructor() {
        this.teams = StorageManager.loadTeams();
        this.levels = StorageManager.loadLevels();
        this.progressHistory = StorageManager.loadProgressHistory();
        this.selectedTeam = null;
        this.selectedLevel = null;
        this.init();
    }

    init() {
        this.renderTeams();
        this.renderLevels();
        this.updateStats();
        this.updateRecentCheckins();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('checkinBtn').addEventListener('click', () => this.handleCheckIn());
    }

    renderTeams() {
        const teamGrid = document.getElementById('teamGrid');

        if (this.teams.length === 0) {
            teamGrid.innerHTML = '<p class="empty-state">No teams created yet. Go to Dashboard to create teams!</p>';
            return;
        }

        teamGrid.innerHTML = this.teams.map(team => {
            const isSelected = this.selectedTeam?.id === team.id;
            return `
                <div class="team-card ${isSelected ? 'selected' : ''}" data-team-id="${team.id}">
                    <a href="team-checkin.html?teamid=${team.id}" class="team-link-icon" title="Go to ${team.name}'s check-in page">🔗</a>
                    <div class="team-avatar-large">${team.avatar}</div>
                    <div class="team-name">${team.name}</div>
                    <div class="team-level-info">
                        ${team.currentLevel ? `At: ${team.currentLevel}` : 'No level'}
                    </div>
                </div>
            `;
        }).join('');

        // Add click listeners
        document.querySelectorAll('.team-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't select if clicking the link
                if (e.target.closest('.team-link-icon')) {
                    return;
                }
                const teamId = e.currentTarget.dataset.teamId;
                this.selectTeam(teamId);
            });
        });
    }

    renderLevels() {
        const levelGrid = document.getElementById('levelGrid');

        if (this.levels.length === 0) {
            levelGrid.innerHTML = '<p class="empty-state">No levels created yet. Go to Dashboard to create levels!</p>';
            return;
        }

        levelGrid.innerHTML = this.levels.map(level => {
            const isSelected = this.selectedLevel?.id === level.id;
            return `
                <div class="level-card ${isSelected ? 'selected' : ''}" data-level-id="${level.id}">
                    <div class="level-name">${level.name}</div>
                    <div class="level-description">
                        ${level.description || 'Level'}
                    </div>
                </div>
            `;
        }).join('');

        // Add click listeners
        document.querySelectorAll('.level-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const levelId = e.currentTarget.dataset.levelId;
                this.selectLevel(levelId);
            });
        });
    }

    selectTeam(teamId) {
        this.selectedTeam = this.teams.find(t => t.id === teamId);
        this.updateTeamCards();
        this.updateCheckInButton();
    }

    selectLevel(levelId) {
        this.selectedLevel = this.levels.find(l => l.id === levelId);
        this.updateLevelCards();
        this.updateCheckInButton();
    }

    updateTeamCards() {
        document.querySelectorAll('.team-card').forEach(card => {
            const teamId = card.dataset.teamId;
            if (this.selectedTeam?.id === teamId) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    }

    updateLevelCards() {
        document.querySelectorAll('.level-card').forEach(card => {
            const levelId = card.dataset.levelId;
            if (this.selectedLevel?.id === levelId) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    }

    updateCheckInButton() {
        const btn = document.getElementById('checkinBtn');
        const status = document.getElementById('selectionStatus');

        if (this.selectedTeam && this.selectedLevel) {
            btn.disabled = false;
            status.textContent = `Ready to check in ${this.selectedTeam.name} at ${this.selectedLevel.name}`;
            status.classList.add('ready');
        } else {
            btn.disabled = true;
            status.textContent = 'Select both team and level to proceed';
            status.classList.remove('ready');
        }
    }

    handleCheckIn() {
        if (!this.selectedTeam || !this.selectedLevel) {
            alert('Please select both team and level');
            return;
        }

        // Update team's level
        const teamIndex = this.teams.findIndex(t => t.id === this.selectedTeam.id);
        if (teamIndex !== -1) {
            this.teams[teamIndex].currentLevel = this.selectedLevel.name;
            this.teams[teamIndex].currentLevelId = this.selectedLevel.id;
            StorageManager.saveTeams(this.teams);
        }

        // Record in progress history
        StorageManager.addProgressRecord(
            this.selectedTeam.id,
            this.selectedTeam.name,
            this.selectedLevel.id,
            this.selectedLevel.name
        );

        // Show celebration
        showCelebration(`🎉 ${this.selectedTeam.name} reached ${this.selectedLevel.name}! 🎉`);

        // Reload data
        this.teams = StorageManager.loadTeams();
        this.progressHistory = StorageManager.loadProgressHistory();

        // Update UI
        this.renderTeams();
        this.updateStats();
        this.updateRecentCheckins();

        // Reset selection
        this.selectedTeam = null;
        this.selectedLevel = null;
        this.updateTeamCards();
        this.updateLevelCards();
        this.updateCheckInButton();
    }

    updateStats() {
        document.getElementById('teamCount').textContent = this.teams.length;
        document.getElementById('levelCount').textContent = this.levels.length;
    }

    updateRecentCheckins() {
        const container = document.getElementById('recentCheckins');
        const recent = this.progressHistory.slice(-5).reverse();

        if (recent.length === 0) {
            container.innerHTML = '<p class="empty-state">No check-ins yet</p>';
            return;
        }

        container.innerHTML = recent.map(record => {
            const date = new Date(record.timestamp);
            const timeString = date.toLocaleTimeString();
            const dateString = date.toLocaleDateString();

            return `
                <div class="checkin-item">
                    <div class="checkin-team">📍 ${record.teamName}</div>
                    <div class="checkin-level">→ ${record.levelName}</div>
                    <div class="checkin-time">${timeString} ${dateString}</div>
                </div>
            `;
        }).join('');
    }
}

// Initialize page
let checkInPage;
document.addEventListener('DOMContentLoaded', function() {
    checkInPage = new CheckInPage();
});
