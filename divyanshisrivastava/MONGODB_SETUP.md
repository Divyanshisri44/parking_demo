# MongoDB Setup Guide

## Option 1: Start Local MongoDB (Windows)

### Check if MongoDB is installed:
```powershell
mongod --version
```

### If MongoDB is installed, start it:
```powershell
# Method 1: Start MongoDB Service
net start MongoDB

# Method 2: Run MongoDB manually
mongod --dbpath "C:\data\db"
```

### If MongoDB is NOT installed:

1. **Download MongoDB Community Server:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select Windows version
   - Download and install

2. **Create data directory:**
   ```powershell
   mkdir C:\data\db
   ```

3. **Start MongoDB:**
   ```powershell
   mongod --dbpath "C:\data\db"
   ```

---

## Option 2: Use MongoDB Atlas (Cloud - Recommended)

### Step 1: Create Free Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account

### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose FREE tier (M0)
3. Select a cloud provider and region
4. Click "Create"

### Step 3: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Step 4: Update .env file
1. Open `server/.env`
2. Replace `MONGODB_URI` with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/parkingapp?retryWrites=true&w=majority
   ```
   - Replace `username` and `password` with your database user credentials
   - Replace `parkingapp` with your database name (or keep it)

### Step 5: Whitelist IP Address
1. In Atlas dashboard, go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   OR add your current IP address

---

## Quick Fix for Current Error

**If you want to use local MongoDB:**

1. **Start MongoDB service:**
   ```powershell
   net start MongoDB
   ```

2. **If service doesn't exist, install MongoDB first** (see Option 1 above)

**OR use MongoDB Atlas** (easier, no installation needed):
- Follow Option 2 steps above
- Update `server/.env` with Atlas connection string
- Restart server: `npm run dev`

---

## Verify MongoDB Connection

After starting MongoDB, restart your server:
```powershell
# Stop current server (Ctrl+C)
# Then restart:
cd server
npm run dev
```

You should see: `✅ MongoDB Connected`

