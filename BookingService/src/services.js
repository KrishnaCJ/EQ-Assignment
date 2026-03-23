import * as repo from './repository.js';
import * as utils from './utils.js';

export const createRoom = async (data) => {
  if (!data.name || data.capacity < 1) throw { name: "ValidationError", message: "Capacity must be >= 1", statusCode: 400 };
  const existing = await repo.findRoomByName(data.name);
  if (existing) throw { name: "ConflictError", message: "Room name must be unique", statusCode: 400 };
  return await repo.saveRoom(data);
};

export const listRooms = async (filters) => await repo.getRooms(filters);

export const processBooking = async (data, key) => {
  if (!key) throw { name: "ValidationError", message: "Idempotency-Key header is required", statusCode: 400 };
  
  const cached = await repo.getIdempotency(key, data.organizerEmail);
  if (cached) return cached;

  utils.validateBookingTime(data.startTime, data.endTime);
  
  const room = await repo.getRoomById(data.roomId);
  if (!room) throw { name: "NotFoundError", message: "Room not found", statusCode: 404 };

  const overlap = await repo.findOverlap(data.roomId, data.startTime, data.endTime);
  if (overlap) throw { name: "ConflictError", message: "Room is already booked for this time", statusCode: 409 };

  const booking = await repo.saveBooking({ ...data, status: "confirmed" });
  await repo.saveIdempotency(key, data.organizerEmail, booking);
  return booking;
};

export const listBookings = async (query) => await repo.getBookings(query);

export const cancelBooking = async (id) => {
  const booking = await repo.getBookingById(id);
  if (!booking) throw { name: "NotFoundError", message: "Unknown booking", statusCode: 404 };
  if (booking.status === "cancelled") return booking;

  if ((new Date(booking.startTime) - new Date()) / 3600000 < 1) {
    throw { name: "ValidationError", message: "Cannot cancel within 1 hour of start", statusCode: 400 };
  }
  return await repo.updateBookingStatus(id, "cancelled");
};

export const generateReport = async (from, to) => {
  if (!from || !to) throw { name: "ValidationError", message: "From and To are required", statusCode: 400 };
  const rooms = await repo.getRooms({});
  const bookings = await repo.getAllBookings();
  return rooms.map(room => utils.calculateRoomStats(room, from, to, bookings));
};