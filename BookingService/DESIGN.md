Technical Design Document: Meeting Room Booking Service
1. Architectural Overview
The system implements a Layered Architecture to ensure high testability, maintainability, and clear separation of concerns.

Controller Layer (handlers.js): Manages HTTP semantics (status codes, headers, and request parsing). It contains no business logic.
Service Layer (services.js): The "Domain Logic" hub. It enforces booking rules, validates time windows, and coordinates between the repository and utility functions.
Persistence Layer (repository.js): Abstracts data access. Currently implemented as an in-memory store, it is designed to be swapped for a relational database (e.g., PostgreSQL) without modifying the service layer.
Utility Layer (utils.js): Pure, stateless functions used for complex calculations like room utilization and time-range validation.

2. Data Model
Field	Type	Description
id	String	Unique UUID / Internal ID
roomId	String	Foreign key reference to a Room
startTime	DateTime	ISO 8601 UTC timestamp
endTime	DateTime	ISO 8601 UTC timestamp
status	Enum	confirmed | cancelled

3. Key Technical Challenges & Solutions
A. Overlap Prevention (Concurrency)
To prevent double-booking a room, the service performs a collision check before insertion.

Logic: Two bookings overlap if:

(Start_A < End_B) AND (End_A > Start_B)

Scale Strategy: In a production environment, this check would be wrapped in a Database Transaction with a SERIALIZABLE isolation level or a PostgreSQL EXCLUSION CONSTRAINT to prevent race conditions during concurrent requests.

B. Idempotency Implementation
To ensure safety under network retries or concurrent requests, an Idempotency Key mechanism is implemented.

Approach: The client provides a unique Idempotency-Key in the request header.

Storage: The server stores a composite hash of the key and organizerEmail.

Behavior:

If the key exists, return the cached response immediately.
If not, process the request and atomically save the result.
Constraint: In a distributed system, this would be stored in a high-speed KV-store like Redis with a TTL (Time-to-Live).

C. Room Utilization Logic
The utilization report calculates efficiency based on a 12-hour business day (08:00 - 20:00).

Edge Case Handling: If a booking starts at 07:30 and ends at 09:00, the algorithm clips the duration to only count the 1 hour (08:00–09:00) falling within the reportable business window.

4. Error Handling Strategy
The API utilizes centralized middleware to ensure all responses follow a predictable contract:

400 Bad Request: Validation failures (e.g., booking on a Sunday, duration $< 15$m).
404 Not Found: Resource missing (e.g., invalid Room ID).
409 Conflict: Overlapping booking detected.
500 Internal Error: Unexpected server failures.



Instructions to Run the Test Suite
================================================================================

Prerequisites
Node.js: v18.0.0 or higher.

npm: Included with Node.js.

1. Installation
Navigate to the project root and install the dependencies (Jest and Express):

Bash
npm install
2. Running Functional Tests
To execute the automated test suite provided above:

Bash
npm test
Note: This runs Jest with the --experimental-vm-modules flag to support ES Modules.

3. Running Manual Integration Tests
To verify the API endpoints manually via Postman or cURL:

Start the Server:

Bash
npm start
Test Idempotency:
Send a POST to /bookings with the header Idempotency-Key: unique-1. Send it twice; the second response should be identical to the first without creating a new record.

Test Cancellation Rule:

Create a booking for a time 2 hours from now. Cancel it (Success).

Create a booking for a time 30 minutes from now. Cancel it (Should return 400 ValidationError).

Check Utilization:
Visit: http://localhost:3000/reports/room-utilization?from=2026-01-01T08:00:00Z&to=2026-12-31T20:00:00Z

Expected Output
When running npm test, you should see:
PASS  tests/booking.test.js
Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total