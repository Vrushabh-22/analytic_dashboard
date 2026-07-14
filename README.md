# Analytics Dashboard

Quick guide on getting this analytics dashboard up and running.

## Project Setup

You'll need Python 3.10+, Node.js 18+, and PostgreSQL installed.

**Backend (Django):**
1. Move into the backend folder: `cd backend`
2. Spin up a virtual env: `python -m venv venv && source venv/bin/activate`
3. Install the requirements: `pip install -r requirements.txt`
4. Make sure Postgres is running and update `.env` with your db credentials.
5. Apply migrations: `python manage.py migrate`
6. Seed the db (this dumps ~50k records in): `python manage.py populate_db`
7. Start it up: `python manage.py runserver`

**Frontend (React/Vite):**
1. Move into the frontend folder: `cd frontend`
2. Install packages: `npm install`
3. Run the dev server: `npm run dev`

---

## Architecture Decisions

- **Frontend framework:** Went with React + Vite because it's fast and easy to iterate with. 
- **UI library:** Used a combination of Material UI (MUI), Ant Design (antd), and ApexCharts. This gave us solid components and flexible data visualization out of the box without reinventing the wheel.
- **Database:** PostgreSQL. Since we're dealing with a decent chunk of data (50k+ rows), Postgres is great for performance and handles complex queries well.
- **API:** Django REST Framework + `django-filter`. This handles the heavy lifting for pagination, sorting, and filtering right at the database level instead of loading everything into memory.

## State Management Approach

I broke the state down into two main parts:
1. **Server State:** Used `@tanstack/react-query` to handle fetching, caching, and updating all the data from the backend. 
2. **Client State:** Just standard React `useState` and localstorage for UI toggles, debouncing search inputs, and dynamic column visibility. We didn't need heavy global state management like Redux for this.

## Caching Implementation

Caching is mostly handled on the frontend via React Query to reduce backend load. 
- Every API call has a unique query key based on its active filters, pagination, and sorting (e.g., `['analytics', { page: 1, limit: 50 }]`).
- If you go from page 1 to page 2 and then back to page 1, React Query immediately pulls page 1 from the cache instead of hitting the server again.
- I set a `staleTime` of 5 minutes so it doesn't over-fetch in the background while the user is just looking at the data.

## Assumptions Made

1. **Metrics:** The prompt had generic metrics like "Total Clicks", so I mocked the data around a typical web analytics/SEO dashboard domain.

2. **Auth:** Skipped authentication since it wasn't explicitly requested. In a real production app, these endpoints would be locked down behind auth.

