# StayNest - Hotel Listing & Booking (React + Redux + Node/Express + PostgreSQL)

## Requirements
Node.js 18+, PostgreSQL 13+

## 1. Database
Create an empty database once:
    psql -U postgres -c "CREATE DATABASE staynest;"

## 2. Backend (Terminal 1)
    cd backend
    npm install
    cp .env.example .env        (Windows: copy .env.example .env)
    # edit .env -> put your PostgreSQL password in DATABASE_URL
    npm run seed                # creates tables + 9 demo hotels
    npm run dev                 # API on http://localhost:5000

## 3. Frontend (Terminal 2)
    cd frontend
    npm install
    cp .env.example .env        (optional)
    npm run dev                 # App on http://localhost:5173

## API
GET/POST /api/hotels, GET/PUT/DELETE /api/hotels/:id, GET /api/hotels/locations
GET/POST /api/bookings, PATCH /api/bookings/:id/cancel

## Change colours
frontend/src/styles.css -> the :root block at the top.
