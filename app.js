// Updated app.js with Supabase integration
// Data Management with Realtime Support

class ScoreboardApp {
    constructor() {
        this.teams = [];
        this.levels = [];
        this.progressHistory = [];
        this.init();
    }

    // Initialize app
    async init() {
        // Load initial data
        await this.loadData();
        
        // Setup realtime subscriptions
        this.setupRealtimeListeners();
        
        // Setup UI event listeners
        this.setupEventListeners();
        
        // Update UI
        this.updateUI();
    }

    // Load data from Supabase
    async loadData() {
        try {
            this.teams = await supabaseStorage.loadTeams();
            this.levels = await supabaseStorage.loadLevels();
            this.progressHistory = await supabaseStorage.loadProgressHistory();
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Failed to load data. Please check your Supabase configuration.');
        }
    }

    // Setup realtime listeners for live updates
    setupRealtimeListeners() {
        // Listen for team changes
        supabaseStorage.subscribe('teams', (payload) => {
            console.log('Team change detected:', payload);
            this.handleTeamChange(payload);
        });

        // Listen for level changes
        supabaseStorage.subscribe('levels', (payload) => {
            console.log('Level change detected:', payload);
            this.handleLevelChange(payload);
        });

        // Listen for progress history changes
        supabaseStorage.subscribe('progressHistory', (payload) => {
            console.log('Progress change detected:', payload);
            this.handleProgressChange(payload);
        });
    }

    // Handle realtime team changes
    async handleTeamChange(payload) {
        const { eventType, new: newRecord, old: oldRecord } = payload;

        if (eventType === 'INSERT') {
            // Transform database column names to app format
            const team = {
                id: newRecord.id,
                name: newRecord.name,
                avatar: newRecord.avatar,
                currentLevel: newRecord.current_level,
                currentLevelId: newRecord.current_level_id,
                createdAt: newRecord.created_at
            };
            
            // Only add if not already in local array
            if (!this.teams.find(t => t.id === team.id)) {
                this.teams.push(team);
                this.updateUI();
            }
        } else if (eventType === 'UPDATE') {
            const team = {
                id: newRecord.id,
                name: newRecord.name,
                avatar: newRecord.avatar,
                currentLevel: newRecord.current_level,
                currentLevelId: newRecord.current_level_id,
                createdAt: newRecord.created_at
            };
            
            const index = this.teams.findIndex(t => t.id === team.id);
            if (index !== -1) {
                this.teams[index] = team;
                this.updateUI();
            }
        } else if (eventType === 'DELETE') {
            this.teams = this.teams.filter(t => t.id !== oldRecord.id);
            this.updateUI();
        }
    }

    // Handle realtime level changes
    async handleLevelChange(payload) {
        const { eventType, new: newRecord, old: oldRecord } = payload;

        if (eventType === 'INSERT') {
            const level = {
                id: newRecord.id,
                name: newRecord.name,
                description: newRecord.description,
                createdAt: newRecord.created_at
            };
            
            if (!this.levels.find(l => l.id === level.id)) {
                this.levels.push(level);
                this.updateUI();
            }
        } else if (eventType === 'DELETE') {
            this.levels = this.levels.filter(l => l.id !== oldRecord.id);
            this.updateUI();
        }
    }

    // Handle realtime progress changes
    async handleProgressChange(payload) {
        const { eventType, new: newRecord } = payload;

        if (eventType === 'INSERT') {
            const progress = {
                id: newRecord.id,
                teamId: newRecord.team_id,
                teamName: newRecord.team_name,
                levelId: newRecord.level_id,
                levelName: newRecord.level_name,
                timestamp: newRecord.timestamp
            };
            
            if (!this.progressHistory.find(p => p.id === progress.id)) {
                this.progressHistory.unshift(progress);
                // Update the team's current level in the local array
                const team = this.teams.find(t => t.id === progress.teamId);
                if (team) {
                    team.currentLevel = progress.levelName;
                    team.currentLevelId = progress.levelId;
                    this.updateUI();
                }
            }
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(e.target.dataset.tab, e.target);
            });
        });

        // Form submissions
        document.getElementById('addTeamForm').addEventListener('submit', (e) => this.handleAddTeam(e));
        document.getElementById('addLevelForm').addEventListener('submit', (e) => this.handleAddLevel(e));
        document.getElementById('checkInForm').addEventListener('submit', (e) => this.handleCheckIn(e));
    }

    // Tab switching
    switchTab(tabName, targetButton) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Remove active from all buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        const tabElement = document.getElementById(tabName);
        if (tabElement) {
            tabElement.classList.add('active');
        }
        
        if (targetButton) {
            targetButton.classList.add('active');
        }
    }

    // Add team
    async handleAddTeam(e) {
        e.preventDefault();
        const teamName = document.getElementById('teamName').value.trim();
        const avatar = document.getElementById('selectedAvatar').value;

        if (!teamName || !avatar) {
            alert('Please fill in all fields and select an avatar');
            return;
        }

        // Check for duplicate team names
        if (this.teams.some(team => team.name.toLowerCase() === teamName.toLowerCase())) {
            alert('Team already exists!');
            return;
        }

        const newTeam = {
            id: Date.now().toString(),
            name: teamName,
            avatar: avatar,
            currentLevel: null,
            currentLevelId: null,
            createdAt: new Date().toISOString()
        };

        try {
            await supabaseStorage.saveTeam(newTeam);
            // Don't manually update UI - realtime subscription will handle it
            
            document.getElementById('addTeamForm').reset();
            document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));

            alert(`Team "${teamName}" created successfully! 🎉`);
        } catch (error) {
            console.error('Error adding team:', error);
            alert('Failed to add team. Please try again.');
        }
    }

    // Add level
    async handleAddLevel(e) {
        e.preventDefault();
        const levelName = document.getElementById('levelName').value.trim();
        const levelDescription = document.getElementById('levelDescription').value.trim();

        if (!levelName) {
            alert('Please enter a level name');
            return;
        }

        // Check for duplicate level names
        if (this.levels.some(level => level.name.toLowerCase() === levelName.toLowerCase())) {
            alert('Level already exists!');
            return;
        }

        const newLevel = {
            id: Date.now().toString(),
            name: levelName,
            description: levelDescription,
            order: this.levels.length + 1,
            createdAt: new Date().toISOString()
        };

        try {
            await supabaseStorage.saveLevel(newLevel);
            // Don't manually update UI - realtime subscription will handle it

            document.getElementById('addLevelForm').reset();
            alert(`Level "${levelName}" added successfully! 🏆`);
        } catch (error) {
            console.error('Error adding level:', error);
            alert('Failed to add level. Please try again.');
        }
    }

    // Handle team check-in
    async handleCheckIn(e) {
        e.preventDefault();
        const teamId = document.getElementById('selectTeam').value;
        const levelId = document.getElementById('selectLevel').value;

        if (!teamId || !levelId) {
            alert('Please select both team and level');
            return;
        }

        const team = this.teams.find(t => t.id === teamId);
        const level = this.levels.find(l => l.id === levelId);

        if (!team || !level) {
            alert('Invalid team or level');
            return;
        }

        try {
            // Update team's level in Supabase
            await supabaseStorage.updateTeam(teamId, {
                currentLevel: level.name,
                currentLevelId: levelId
            });

            // Record in progress history
            await supabaseStorage.addProgressRecord(teamId, team.name, levelId, level.name);

            // Show celebration animation
            this.showCelebration(team, level);

            document.getElementById('checkInForm').reset();
        } catch (error) {
            console.error('Error checking in:', error);
            alert('Failed to check in. Please try again.');
        }
    }

    // Show celebration animation
    showCelebration(team, level) {
        const celebration = document.getElementById('celebration');
        const celebrationText = document.getElementById('celebrationText');

        celebrationText.textContent = `${team.name} reached ${level.name}! 🎉`;

        celebration.classList.add('active');

        // Create confetti
        createConfetti();
        playSound();

        setTimeout(() => {
            celebration.classList.remove('active');
        }, 2000);
    }

    // Update UI
    updateUI() {
        this.updateDashboard();
        this.updateTeamsList();
        this.updateSelectDropdowns();
    }

    // Update dashboard leaderboard
    updateDashboard() {
        const leaderboard = document.getElementById('leaderboard');

        // Sort teams by level
        const sortedTeams = [...this.teams].sort((a, b) => {
            const levelA = this.levels.findIndex(l => l.id === a.currentLevelId);
            const levelB = this.levels.findIndex(l => l.id === b.currentLevelId);
            return levelB - levelA;
        });

        if (sortedTeams.length === 0) {
            leaderboard.innerHTML = '<p class="empty-state">No teams yet. Add teams in the Management tab!</p>';
            return;
        }

        leaderboard.innerHTML = sortedTeams.map((team, index) => {
            const rank = index + 1;
            const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;

            return `
                <div class="leaderboard-item" onclick="window.location.href='team-checkin.html?teamid=${team.id}'" style="cursor: pointer;">
                    <div class="rank-badge">${rankEmoji}</div>
                    <div class="team-avatar">${team.avatar}</div>
                    <div class="team-info">
                        <div class="team-name">${team.name}</div>
                        <div class="team-level">
                            ${team.currentLevel ? `<span class="level-badge">${team.currentLevel}</span>` : '<span style="color: #999;">No level yet</span>'}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Update teams list in management tab
    updateTeamsList() {
        const teamsList = document.getElementById('teamsList');

        if (this.teams.length === 0) {
            teamsList.innerHTML = '<p class="empty-state">No teams created yet.</p>';
            return;
        }

        teamsList.innerHTML = this.teams.map(team => {
            return `
                <div class="team-item" onclick="window.location.href='team-checkin.html?teamid=${team.id}'" style="cursor: pointer;">
                    <div class="team-item-info">
                        <div class="team-item-avatar">${team.avatar}</div>
                        <div>
                            <div class="team-item-name">${team.name}</div>
                            <div class="team-item-level">
                                ${team.currentLevel ? `Current Level: ${team.currentLevel}` : 'No level'}
                            </div>
                        </div>
                    </div>
                    <div class="team-item-actions">
                        <button class="btn btn-danger" onclick="event.stopPropagation(); app.deleteTeam('${team.id}')">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Delete team
    async deleteTeam(teamId) {
        if (confirm('Are you sure you want to delete this team?')) {
            try {
                await supabaseStorage.deleteTeam(teamId);
                // Realtime subscription will handle UI update
            } catch (error) {
                console.error('Error deleting team:', error);
                alert('Failed to delete team. Please try again.');
            }
        }
    }

    // Update select dropdowns
    updateSelectDropdowns() {
        // Update team select
        const teamSelect = document.getElementById('selectTeam');
        teamSelect.innerHTML = '<option value="">-- Choose a team --</option>';
        this.teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = team.name;
            teamSelect.appendChild(option);
        });

        // Update level select
        const levelSelect = document.getElementById('selectLevel');
        levelSelect.innerHTML = '<option value="">-- Choose a level --</option>';
        this.levels.forEach(level => {
            const option = document.createElement('option');
            option.value = level.id;
            option.textContent = level.name;
            levelSelect.appendChild(option);
        });
    }
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', function() {
    app = new ScoreboardApp();
});
