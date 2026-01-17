# Supabase Setup Guide

This guide will help you set up Supabase for your Scoreboard application with realtime features.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project Name**: scoreboard (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to your users
5. Click "Create new project"

## Step 2: Get Your Project Credentials

1. In your Supabase project dashboard, click on the **Settings** (gear icon)
2. Click on **API**
3. Copy the following:
   - **Project URL**: (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key**: (starts with `eyJ...`)

## Step 3: Set Up Database Tables

1. In your Supabase dashboard, click on the **SQL Editor** (in the left sidebar)
2. Click **New Query**
3. Copy and paste the entire contents of `setup-supabase.sql`
4. Click **Run** to execute the SQL

This will create:
- `teams` table
- `levels` table
- `progress_history` table
- Row Level Security policies (allowing public access)
- Realtime subscriptions
- Performance indexes

## Step 4: Configure Your Application

1. Open `supabase-config.js`
2. Replace the placeholder values:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Replace with your Project URL
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your anon key
   ```

## Step 5: Add Supabase to Your HTML Files

Add these script tags **before** your existing scripts in each HTML file:

### For index.html:
```html
<!-- Supabase Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>
<script src="supabase-storage.js"></script>
```

### For checkin.html and team-checkin.html:
```html
<!-- Supabase Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>
<script src="supabase-storage.js"></script>
```

## Step 6: Update Your Application Code

The application code needs to be updated to use async/await since Supabase operations are asynchronous. The key changes needed:

1. **app.js**: Update to use `supabaseStorage` instead of `StorageManager`
2. **checkin.js**: Update to use async methods
3. **team-checkin.js**: Update to use async methods

## Step 7: Enable Realtime

The realtime feature is automatically enabled with the setup. Your application will now:

- **Auto-update** when any user adds a team
- **Auto-update** when any user adds a level
- **Auto-update** when any user checks in
- Show changes **instantly** across all open browser windows

## Step 8: Test the Setup

1. Open your application in two different browser windows
2. In one window, add a team
3. Watch it appear in the other window in real-time!

## Security Considerations

The current setup uses **public access policies** (anyone can read/write). For production, you should:

1. Enable Supabase Authentication
2. Update RLS policies to restrict access based on user authentication
3. Consider implementing team ownership or admin roles

## Troubleshooting

### Data not showing up?
- Check browser console for errors
- Verify your Supabase URL and anon key are correct
- Ensure the SQL tables were created successfully

### Realtime not working?
- Check that you ran the `ALTER PUBLICATION` commands in the SQL
- Verify your browser console for WebSocket connection errors
- Make sure you're using the latest version of Supabase JS client

### Need to migrate existing data?
The old localStorage data won't be automatically migrated. You can:
1. Keep using localStorage as a fallback
2. Manually export and import data
3. Create a migration script

## Next Steps

- Set up authentication for your users
- Add team ownership/permissions
- Deploy your application to a hosting service
- Configure environment variables for production
