# 🚀 Quick Start - Supabase Integration

**Get your scoreboard running with realtime features in 5 minutes!**

## What You Need

1. A free Supabase account
2. These files (already created ✅):
   - `supabase-config.js` - Your config file
   - `supabase-storage.js` - Storage layer
   - `setup-supabase.sql` - Database setup
   - `app-supabase.js` - Updated app logic

## 3-Step Setup

### 1️⃣ Create Supabase Project (2 min)

```
1. Go to: https://supabase.com
2. Click: "New Project"
3. Name: "scoreboard"
4. Set a database password
5. Click: "Create new project"
```

### 2️⃣ Setup Database (1 min)

```
1. In Supabase: Click "SQL Editor"
2. Click "New Query"
3. Copy ALL content from: setup-supabase.sql
4. Paste and click "Run"
5. Should see: "Success" ✅
```

### 3️⃣ Configure App (2 min)

```
1. In Supabase: Settings → API
2. Copy your "Project URL"
3. Copy your "anon public key"
4. Open: supabase-config.js
5. Paste both values
6. Save file
7. Rename: app.js → app-old.js
8. Rename: app-supabase.js → app.js
```

## ✅ Test It

```
1. Open: index.html (in browser)
2. Add a team
3. Check: Supabase Dashboard → Table Editor → teams
4. Should see your team! 🎉
```

## 🔥 Test Realtime

```
1. Open: index.html in TWO browser windows
2. Window 1: Add a team
3. Window 2: Watch it appear instantly! ✨
```

## 📝 Files Overview

| File | Purpose |
|------|---------|
| `supabase-config.js` | Your credentials (UPDATE THIS!) |
| `supabase-storage.js` | Handles database operations |
| `setup-supabase.sql` | Creates database tables |
| `app-supabase.js` | Updated app with Supabase |
| `migrate.html` | Optional: Migrate old data |
| `README.md` | Full documentation |
| `CHECKLIST.md` | Step-by-step checklist |

## 🆘 Problems?

**Can't connect?**
- Check `supabase-config.js` has correct URL and key
- Open browser console (F12) for error messages

**Tables not created?**
- Re-run the SQL in Supabase SQL Editor
- Check for error messages

**Realtime not working?**
- Verify SQL ran successfully
- Check browser console for WebSocket errors

## 🎯 Next Steps

- [ ] Set up authentication
- [ ] Deploy to hosting (Vercel, Netlify, etc.)
- [ ] Share with your team
- [ ] Customize for your needs

## 📚 More Help

- **Full Guide**: See [README.md](README.md)
- **Detailed Setup**: See [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
- **Checklist**: See [CHECKLIST.md](CHECKLIST.md)
- **Migration**: Open [migrate.html](migrate.html)

---

**That's it! You now have a realtime scoreboard! 🏆**
