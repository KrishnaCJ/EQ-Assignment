import express from 'express';
import { 
  createRoomHandler, 
  listRoomsHandler, 
  createBookingHandler, 
  listBookingsHandler, 
  cancelBookingHandler, 
  utilizationReportHandler 
} from './src/handlers.js';

const app = express();
app.use(express.json());

/**
 * Root Route: Default Landing Page
 * This fulfills the request for clickable links on port 3000.
 */
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Meeting Room API</title></head>
      <body style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
        <h1>Meeting Room Booking Service API</h1>
        <p>The server is running. Use the links below to access the GET endpoints:</p>
        <ul>
          <li><a href="/rooms">View All Rooms (GET /rooms)</a></li>
          <li><a href="/bookings">View All Bookings (GET /bookings)</a></li>
          <li><a href="/reports/room-utilization?from=2026-01-01T08:00:00Z&to=2026-12-31T20:00:00Z">
            Room Utilization Report (Example Range)
          </a></li>
        </ul>
        <hr>
        <h3>API Instructions</h3>
        <p>To <b>Create</b> data (POST), use the provided Postman collection or <code>curl</code>.</p>
        <p><b>Business Rules Implemented:</b></p>
        <ul>
          <li>Mon-Fri, 08:00-20:00 bookings only [cite: 40, 97]</li>
          <li>15m to 4h duration limits [cite: 36]</li>
          <li>1h cancellation grace period [cite: 75]</li>
          <li>Idempotency safety via headers [cite: 65, 106]</li>
        </ul>
      </body>
    </html>
  `);
});

// Rooms Endpoints [cite: 7, 20]
app.post('/rooms', createRoomHandler);
app.get('/rooms', listRoomsHandler);

// Bookings Endpoints [cite: 25, 48]
app.post('/bookings', createBookingHandler);
app.get('/bookings', listBookingsHandler);
app.post('/bookings/:id/cancel', cancelBookingHandler); // [cite: 73]

// Reports Endpoint [cite: 82]
app.get('/reports/room-utilization', utilizationReportHandler);

// Global Error Handler [cite: 42, 125]
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.name || "InternalError",
    message: err.message
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running!`);
  console.log(`🔗 Access the links at: http://localhost:${PORT}\n`);
});

export default app;