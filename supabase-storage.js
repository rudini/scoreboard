// Supabase Storage Module
// This module provides Supabase storage functionality with realtime support

class SupabaseStorageManager {
    constructor() {
        this.subscribers = {
            teams: [],
            levels: [],
            progressHistory: []
        };
        this.setupRealtimeSubscriptions();
    }

    // Setup realtime subscriptions
    setupRealtimeSubscriptions() {
        // Subscribe to teams changes
        supabaseClient
            .channel('teams-channel')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'teams' },
                (payload) => {
                    console.log('Teams change received!', payload);
                    this.notifySubscribers('teams', payload);
                }
            )
            .subscribe();

        // Subscribe to levels changes
        supabaseClient
            .channel('levels-channel')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'levels' },
                (payload) => {
                    console.log('Levels change received!', payload);
                    this.notifySubscribers('levels', payload);
                }
            )
            .subscribe();

        // Subscribe to progress history changes
        supabaseClient
            .channel('progress-channel')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'progress_history' },
                (payload) => {
                    console.log('Progress change received!', payload);
                    this.notifySubscribers('progressHistory', payload);
                }
            )
            .subscribe();
    }

    // Subscribe to changes
    subscribe(type, callback) {
        if (this.subscribers[type]) {
            this.subscribers[type].push(callback);
        }
    }

    // Unsubscribe from changes
    unsubscribe(type, callback) {
        if (this.subscribers[type]) {
            this.subscribers[type] = this.subscribers[type].filter(cb => cb !== callback);
        }
    }

    // Notify subscribers
    notifySubscribers(type, payload) {
        if (this.subscribers[type]) {
            this.subscribers[type].forEach(callback => callback(payload));
        }
    }

    // Teams
    async loadTeams() {
        try {
            const { data, error } = await supabaseClient
                .from('teams')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;
            
            // Transform column names to match existing format
            return (data || []).map(team => ({
                id: team.id,
                name: team.name,
                avatar: team.avatar,
                currentLevel: team.current_level,
                currentLevelId: team.current_level_id,
                createdAt: team.created_at
            }));
        } catch (error) {
            console.error('Error loading teams:', error);
            return [];
        }
    }

    async saveTeam(team) {
        try {
            const { data, error } = await supabaseClient
                .from('teams')
                .insert([{
                    id: team.id,
                    name: team.name,
                    avatar: team.avatar,
                    current_level: team.currentLevel,
                    current_level_id: team.currentLevelId,
                    created_at: team.createdAt
                }])
                .select();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error saving team:', error);
            throw error;
        }
    }

    async updateTeam(teamId, updates) {
        try {
            const updateData = {};
            if (updates.name !== undefined) updateData.name = updates.name;
            if (updates.avatar !== undefined) updateData.avatar = updates.avatar;
            if (updates.currentLevel !== undefined) updateData.current_level = updates.currentLevel;
            if (updates.currentLevelId !== undefined) updateData.current_level_id = updates.currentLevelId;

            const { data, error } = await supabaseClient
                .from('teams')
                .update(updateData)
                .eq('id', teamId)
                .select();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating team:', error);
            throw error;
        }
    }

    async deleteTeam(teamId) {
        try {
            const { error } = await supabaseClient
                .from('teams')
                .delete()
                .eq('id', teamId);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting team:', error);
            throw error;
        }
    }

    // Levels
    async loadLevels() {
        try {
            const { data, error } = await supabaseClient
                .from('levels')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error loading levels:', error);
            return [];
        }
    }

    async saveLevel(level) {
        try {
            const { data, error } = await supabaseClient
                .from('levels')
                .insert([{
                    id: level.id,
                    name: level.name,
                    description: level.description,
                    created_at: level.createdAt
                }])
                .select();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error saving level:', error);
            throw error;
        }
    }

    async deleteLevel(levelId) {
        try {
            const { error } = await supabaseClient
                .from('levels')
                .delete()
                .eq('id', levelId);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting level:', error);
            throw error;
        }
    }

    // Progress History
    async loadProgressHistory() {
        try {
            const { data, error } = await supabaseClient
                .from('progress_history')
                .select('*')
                .order('timestamp', { ascending: false });

            if (error) throw error;
            
            // Transform column names to match existing format
            return (data || []).map(record => ({
                id: record.id,
                teamId: record.team_id,
                teamName: record.team_name,
                levelId: record.level_id,
                levelName: record.level_name,
                timestamp: record.timestamp
            }));
        } catch (error) {
            console.error('Error loading progress history:', error);
            return [];
        }
    }

    async addProgressRecord(teamId, teamName, levelId, levelName) {
        try {
            const { data, error } = await supabaseClient
                .from('progress_history')
                .insert([{
                    team_id: teamId,
                    team_name: teamName,
                    level_id: levelId,
                    level_name: levelName,
                    timestamp: new Date().toISOString()
                }])
                .select();

            if (error) throw error;
            
            // Transform to match existing format
            const record = data[0];
            return {
                id: record.id,
                teamId: record.team_id,
                teamName: record.team_name,
                levelId: record.level_id,
                levelName: record.level_name,
                timestamp: record.timestamp
            };
        } catch (error) {
            console.error('Error adding progress record:', error);
            throw error;
        }
    }
}

// Initialize storage manager
const supabaseStorage = new SupabaseStorageManager();

// Export for use in other modules
window.supabaseStorage = supabaseStorage;
