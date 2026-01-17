// Team Check-In Page Logic

class TeamCheckInPage {
    constructor() {
        this.teams = [];
        this.levels = [];
        this.progressHistory = [];
        this.team = null;
        this.selectedLevel = null;
        this.init();
    }

    async init() {
        const teamId = this.getTeamIdFromURL();

        if (!teamId) {
            this.showError('No team ID provided', 'Please access this page with a valid team ID in the URL.');
            return;
        }

        // Load data from Supabase
        try {
            this.teams = await supabaseStorage.loadTeams();
            this.levels = await supabaseStorage.loadLevels();
            this.progressHistory = await supabaseStorage.loadProgressHistory();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Error Loading Data', 'Failed to load data from the server. Please try again.');
            return;
        }

        this.team = this.teams.find(t => t.id === teamId);

        if (!this.team) {
            this.showError('Team Not Found', 'The team you\'re looking for does not exist.');
            return;
        }

        this.renderTeamInfo();
        this.renderLevels();
        this.setupEventListeners();
    }

    getTeamIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('teamid');
    }

    renderTeamInfo() {
        document.getElementById('teamAvatar').textContent = this.team.avatar;
        document.getElementById('teamName').textContent = this.team.name;

        if (this.team.currentLevel) {
            document.getElementById('teamStatus').textContent = `Current Level: ${this.team.currentLevel}`;
            document.getElementById('currentLevelInfo').textContent = this.team.currentLevel;
        } else {
            document.getElementById('teamStatus').textContent = 'No levels completed yet';
            document.getElementById('currentLevelInfo').textContent = 'None - Ready to start!';
        }

        this.updateNextLevelHint();
    }

    updateNextLevelHint() {
        const nextLevelContainer = document.getElementById('nextLevelInfo');

        if (this.team.currentLevelId) {
            const currentLevelIndex = this.levels.findIndex(l => l.id === this.team.currentLevelId);
            if (currentLevelIndex >= 0 && currentLevelIndex < this.levels.length - 1) {
                const nextLevel = this.levels[currentLevelIndex + 1];
                nextLevelContainer.innerHTML = `
                    <p class="info-row" style="background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #333;">
                        <span class="info-label">Next Level:</span>
                        <span class="info-value" style="background: #333; color: white;">${nextLevel.name}</span>
                    </p>
                `;
            }
        } else if (this.levels.length > 0) {
            const firstLevel = this.levels[0];
            nextLevelContainer.innerHTML = `
                <p class="info-row" style="background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #333;">
                    <span class="info-label">First Level:</span>
                    <span class="info-value" style="background: #333; color: white;">${firstLevel.name}</span>
                </p>
            `;
        }
    }

    renderLevels() {
        const levelGrid = document.getElementById('levelGrid');

        if (this.levels.length === 0) {
            levelGrid.innerHTML = '<p class="empty-state">No levels available yet.</p>';
            return;
        }

        levelGrid.innerHTML = this.levels.map(level => {
            const isSelected = this.selectedLevel?.id === level.id;
            return `
                <div class="level-card-team ${isSelected ? 'selected' : ''}" data-level-id="${level.id}">
                    <div class="level-name-team">${level.name}</div>
                    <div class="level-description-team">${level.description || '🎯'}</div>
                </div>
            `;
        }).join('');

        // Add click listeners
        document.querySelectorAll('.level-card-team').forEach(card => {
            card.addEventListener('click', (e) => {
                const levelId = e.currentTarget.dataset.levelId;
                this.selectLevel(levelId);
            });
        });
    }

    selectLevel(levelId) {
        this.selectedLevel = this.levels.find(l => l.id === levelId);
        this.updateLevelCards();
        this.updateCheckInButton();
    }

    updateLevelCards() {
        document.querySelectorAll('.level-card-team').forEach(card => {
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

        if (this.selectedLevel) {
            btn.disabled = false;
            status.textContent = `Ready to check in to ${this.selectedLevel.name}!`;
            status.classList.add('ready');
        } else {
            btn.disabled = true;
            status.textContent = 'Select a level to proceed';
            status.classList.remove('ready');
        }
    }

    setupEventListeners() {
        document.getElementById('checkinBtn').addEventListener('click', () => this.handleCheckIn());
    }

    async handleCheckIn() {
        if (!this.selectedLevel || !this.team) {
            alert('Please select a level');
            return;
        }

        try {
            // Update team's level in Supabase
            await supabaseStorage.updateTeam(this.team.id, {
                currentLevel: this.selectedLevel.name,
                currentLevelId: this.selectedLevel.id
            });

            // Record in progress history
            await supabaseStorage.addProgressRecord(
                this.team.id,
                this.team.name,
                this.selectedLevel.id,
                this.selectedLevel.name
            );

            // Show celebration
            showCelebration(`🎉 ${this.team.name} reached ${this.selectedLevel.name}! 🎉`);

            // Reload team data from Supabase
            this.teams = await supabaseStorage.loadTeams();
            this.team = this.teams.find(t => t.id === this.team.id);

            // Update UI
            this.renderTeamInfo();
            this.selectedLevel = null;
            this.updateLevelCards();
            this.updateCheckInButton();

            // Celebration effect timing
            setTimeout(() => {
                // Optional: Could add a confetti animation here as well
            }, 2000);
        } catch (error) {
            console.error('Error during check-in:', error);
            alert('Failed to save check-in. Please try again.');
        }
    }

    showError(title, message) {
        const container = document.querySelector('.team-checkin-main');
        const html = `
            <div class="error-container">
                <div class="error-icon">❌</div>
                <h2>${title}</h2>
                <p>${message}</p>
                <a href="checkin.html" class="btn btn-primary" style="display: inline-block;">← Go Back</a>
            </div>
        `;
        container.innerHTML = html;
        container.style.display = 'block';
    }
}

// Make showError accessible
TeamCheckInPage.prototype.showError = function(title, message) {
    const container = document.querySelector('.container');
    const html = `
        <div class="error-container">
            <div class="error-icon">❌</div>
            <h2>${title}</h2>
            <p>${message}</p>
            <a href="checkin.html" class="btn btn-primary" style="display: inline-block; margin-top: 20px;">← Go Back</a>
        </div>
    `;
    // Replace the entire content
    const header = document.querySelector('.header');
    const main = document.querySelector('.team-checkin-main');
    const info = document.querySelector('.info-card');

    if (main) main.remove();
    if (info) info.remove();
    if (header) header.remove();

    const newDiv = document.createElement('div');
    newDiv.innerHTML = html;
    container.appendChild(newDiv.firstElementChild);
};

// Initialize page
let teamCheckInPage;
document.addEventListener('DOMContentLoaded', function() {
    teamCheckInPage = new TeamCheckInPage();
});
