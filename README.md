# Placement Preparation Tracker

## Getting Started

### Installation
- Backend: `cd server && npm install`
- Frontend: `npm install` (in root)

### Running the App
- **Backend**: `cd server && npm run dev` (runs on port 5000)
- **Frontend**: `npm run dev` (runs on port 5173)

### Stopping the Dev Servers
Always use `Ctrl + C` in the terminal where the server is running to stop it. Do not close the terminal directly, as this can leave orphaned Node.js processes running on ports 5000, 5173, 5174, or 5175.

If you encounter "port already in use" errors, you can kill stray processes with:
- Windows: `netstat -ano | findstr :<port>` to find PID, then `taskkill /F /PID <pid>`
