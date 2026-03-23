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