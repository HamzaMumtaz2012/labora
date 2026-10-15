# Labora — Laboratory Registration App

A Next.js App Router project with three separate registration pages:

- `/patients` — Patient registration
- `/employees` — Employee registration
- `/services` — Product/service registration

The root route `/` redirects to `/patients`. The application uses a shared sidebar and a responsive form layout; it does not include a dashboard.

## Requirements
- Node.js 20.9 or newer (required by Next.js 16)
- npm

## Run locally

Configure MongoDB before starting the app. Create or update `.env.local` in the project root:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/?retryWrites=true&w=majority
```

Replace the placeholders with the connection string for your MongoDB deployment. Keep `.env.local` private and restart the server after changing it.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Use the sidebar to move between the three pages.

## API

`POST /api/patients` validates patient name, gender, phone number, and registration date, then saves the record to the `Labora.Patients` MongoDB collection. The patient registration form submits to this endpoint. Employee and service registration forms currently only validate in the browser and do not save records.
