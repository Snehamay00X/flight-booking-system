# Flight Search & Booking System

A full-stack flight search and booking app with the flow:
**search → selection → traveller details → booking creation**.

## Features

### Flight Search
- Filter by source & destination
- One-way & round-trip support
- Passenger count validation
- Price range validation
- Unique `searchId` generated per search

### Flight Selection
- Select fare for one-way or round-trip
- Validates `flightKey` & `fareId`
- Stores:
  - Full flight JSON
  - Selected fare
  - `searchId`

### Traveller Details
- Dynamic passenger form based on passenger count
- Collects:
  - First name, last name
  - Email, phone
  - DOB, gender
  - Passport (optional)
- Resume booking:
  - If the user leaves after selection, they can return and continue
  - Uses `searchId` stored in localStorage

### Booking Creation
- Attaches traveller details
- Locks selected price
- Generates `bookingId`
- Saves final booking in MongoDB

## Tech Stack
- Frontend: Next.js (React)
- Backend: Node.js + Express
- Database: MongoDB
- ODM: Mongoose
- Language: TypeScript

## Project Structure
- `frontend/` — Next.js app
- `backend/` — Express API

## Prerequisites
- Node.js (LTS recommended)
- npm
- MongoDB (local or Atlas)

## Setup & Run (Development)

### 1) Clone
```bash
git clone <your-repo-url>
cd flight-booking-system
```

### 2) Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGODB_URI=your_mongodb_connection_string_here
PORT=8000
```

Run:
```bash
npm run dev
```

Backend runs at `http://localhost:8000`.

### 3) Frontend
```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

## Usage
1. Open `http://localhost:3000`
2. Search for flights
3. Select a flight/fare
4. Enter traveller details
5. Confirm booking

## API Endpoints
- `GET /api/flight/filters` — Get flight filters
- `POST /api/flight/search` — Search for flights
- `POST /api/flight/select` — Select a flight
- `POST /api/flight/book` — Book a flight

## Database Schema (High Level)
- Flight — stores flight info
- Booking — stores booking info

## Improvements / TODO
- Improve UI/UX
- Better error handling
- System design / scalability

## Author
- Snehamay Hembram
