-- Supabase Database Setup SQL
-- Run these commands in your Supabase SQL Editor

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT NOT NULL,
    current_level TEXT,
    current_level_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create levels table
CREATE TABLE IF NOT EXISTS levels (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create progress_history table
CREATE TABLE IF NOT EXISTS progress_history (
    id BIGSERIAL PRIMARY KEY,
    team_id TEXT NOT NULL,
    team_name TEXT NOT NULL,
    level_id TEXT NOT NULL,
    level_name TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_history ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
-- Teams policies
CREATE POLICY "Enable read access for all users" ON teams
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON teams
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON teams
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON teams
    FOR DELETE USING (true);

-- Levels policies
CREATE POLICY "Enable read access for all users" ON levels
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON levels
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON levels
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON levels
    FOR DELETE USING (true);

-- Progress history policies
CREATE POLICY "Enable read access for all users" ON progress_history
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON progress_history
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable delete access for all users" ON progress_history
    FOR DELETE USING (true);

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE teams;
ALTER PUBLICATION supabase_realtime ADD TABLE levels;
ALTER PUBLICATION supabase_realtime ADD TABLE progress_history;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teams_created_at ON teams(created_at);
CREATE INDEX IF NOT EXISTS idx_levels_created_at ON levels(created_at);
CREATE INDEX IF NOT EXISTS idx_progress_history_timestamp ON progress_history(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_progress_history_team_id ON progress_history(team_id);
