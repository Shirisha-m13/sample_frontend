# Frontend

React + Vite frontend for real-time feedback.

## Local run

1. Install dependencies:
   npm install
2. Start dev server:
   npm run dev

By default this app calls backend at `http://localhost:4000`.

## Environment variables

- `VITE_API_BASE_URL` (default: `http://localhost:4000`)

## Production build

- Build: `npm run build`
- Run built app (Azure/App Service): `npm start`

## Azure hosting

1. Create an Azure App Service (Node.js) or Azure Static Web Apps.
2. For App Service deployment, deploy this `frontend` folder.
3. Set App Setting:
   - `VITE_API_BASE_URL` to backend URL before building.
4. Startup command: default (`npm start`) after build artifacts exist.