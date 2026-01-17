# ✅ Supabase Setup Checklist

Use this checklist to ensure you've completed all steps correctly.

## Setup Phase

- [ ] **Created Supabase account** at https://supabase.com
- [ ] **Created new project** in Supabase
- [ ] **Copied Project URL** from Settings → API
- [ ] **Copied anon/public key** from Settings → API
- [ ] **Opened SQL Editor** in Supabase dashboard
- [ ] **Ran setup-supabase.sql** script successfully
- [ ] **Verified tables created** (teams, levels, progress_history)

## Configuration Phase

- [ ] **Opened supabase-config.js**
- [ ] **Pasted Project URL** into SUPABASE_URL
- [ ] **Pasted anon key** into SUPABASE_ANON_KEY
- [ ] **Saved the file**

## Code Update Phase

Choose ONE option:

### Option A: Fresh Start (Recommended)
- [ ] **Renamed app.js** to app-old.js
- [ ] **Renamed app-supabase.js** to app.js

### Option B: Keep Current
- [ ] **Opened app.js**
- [ ] **Replaced entire content** with app-supabase.js content

## Testing Phase

- [ ] **Opened index.html** in browser
- [ ] **Opened browser console** (F12)
- [ ] **Verified no errors** in console
- [ ] **Saw Supabase connection messages**
- [ ] **Successfully added a test team**
- [ ] **Checked Supabase dashboard** - saw team in "teams" table

## Realtime Testing Phase

- [ ] **Opened index.html** in two browser windows
- [ ] **Added team in window 1**
- [ ] **Saw it appear automatically in window 2** ✨
- [ ] **Tested on mobile device** (optional)
- [ ] **Verified realtime works** across devices

## Data Migration Phase (If you have existing data)

- [ ] **Opened migrate.html** in browser
- [ ] **Clicked "Check LocalStorage"**
- [ ] **Verified data found**
- [ ] **Clicked "Preview Migration"**
- [ ] **Reviewed migration plan**
- [ ] **Clicked "Migrate Data"**
- [ ] **Saw success message**
- [ ] **Clicked "Verify Data"**
- [ ] **Confirmed data in Supabase**

## Production Readiness (Optional)

- [ ] **Set up custom domain** (if using)
- [ ] **Configure authentication** (if needed)
- [ ] **Update RLS policies** for security
- [ ] **Test from different devices**
- [ ] **Share app URL** with team

## Troubleshooting Completed

If you encountered issues, mark what you fixed:

- [ ] **Fixed API key configuration**
- [ ] **Re-ran SQL setup script**
- [ ] **Cleared browser cache**
- [ ] **Enabled realtime in Supabase**
- [ ] **Checked browser console for errors**
- [ ] **Verified table permissions**

---

## 🎉 Success Criteria

Your migration is successful when:

✅ No errors in browser console
✅ Can add teams/levels and see them in Supabase dashboard
✅ Changes appear in real-time across multiple windows
✅ Data persists after page refresh
✅ All team members can access and see the same data

---

**Status: Ready to go!** 🚀

Once all boxes are checked, your scoreboard is running on Supabase with real-time superpowers!

---

**Questions or Issues?**

1. Check [README.md](README.md) for detailed instructions
2. Check [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for comprehensive guide
3. Review browser console for specific error messages
4. Check Supabase dashboard logs
