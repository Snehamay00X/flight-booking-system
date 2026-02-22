### ** Flight Search & Booking System (MERN Stack)** ###

#### Features ####

 Flight Search
	•	Filter by source & destination
	•	One-way & round-trip support
	•	Passenger count validation
	•	Price range validation
	•	Unique searchId generated per search

 Flight Selection
	•	Select fare for one-way or round-trip
	•	Validates flightKey & fareId
	•	Stores:
	•	Full flight JSON
	•	Selected fare
	•	Search ID

 Traveller Details
	•	Dynamic passenger form based on passenger count
	•	Collects:
                1. First Name
                2. Last Name
                3. Email
                4. Phone
                5. DOB
                6. Gender
                7. Passport (optional)

 Booking Creation
	•	Attaches traveller details
	•	Locks selected price
	•	Generates bookingId
	•	Saves final booking in MongoDB


#### Tech Stack ####
- Frontend: React
- Backend: Node.js (express.js)
- Database: MongoDB
- ORM: Mongoose
- Language: TypeScript

#### Setup ####
1. Clone the repository
2. ##Backend##
    - Run `npm install or npm i` in backend directory
    - Create a .env file in backend directory
    - Add the following variables to the .env file:
        - MONGODB_URI = your_mongodb_connection_string_here ####
        - PORT = 8000
    - Run `npm run dev` in backend directory
	- it will start the server at `http://localhost:8000`
	
3. ##Frontend##
    - Run `npm install or npm i` in frontend directory
    - Run `npm run dev` in frontend directory
	- it will start the server at `http://localhost:3000`

### Usage ###
- Open `http://localhost:3000` in your browser
- Search for flights using the dropdown menu
- Select a flight from the list of flights
- Enter passenger details
- Click on "Book" button
- Booking will be created and saved in the database

### API Endpoints ###
- GET /api/flight/filters - Get flight filters
- POST /api/flight/search - Search for flights
- POST /api/flight/select - Select a flight
- POST /api/flight/book - Book a flight

### DB Schema ###
- Flight - Stores flight information
- Booking - Stores booking information

### Improvements ###
- Improve UI/UX
- Better error handling && System Design

### Author ###
- SnehaMay Hembram

