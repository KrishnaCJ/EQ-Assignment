import * as service from './services.js';

export const createRoomHandler = async (req, res, next) => {
  try {
    console.log('--- Incoming Room Creation ---', req.body);
    const room = await service.createRoom(req.body);
    res.status(201).json(room);
  } catch (err) { next(err); }
};

export const listRoomsHandler = async (req, res, next) => {
  try {
    const rooms = await service.listRooms(req.query);
    res.json(rooms);
  } catch (err) { next(err); }
};

export const createBookingHandler = async (req, res, next) => {
  try {
    console.log('--- Incoming Booking Request ---');
    console.log('Body:', req.body);
    console.log('Idempotency-Key:', req.headers['idempotency-key']);

    const key = req.headers['idempotency-key'];
    const booking = await service.processBooking(req.body, key);
    
    console.log('Result: Success');
    res.status(201).json(booking);
  } catch (err) { 
    console.error('Result: Failed ->', err.message);
    next(err); 
  }
};

export const listBookingsHandler = async (req, res, next) => {
  try {
    const result = await service.listBookings(req.query);
    res.json(result);
  } catch (err) { next(err); }
};

export const cancelBookingHandler = async (req, res, next) => {
  try {
    const booking = await service.cancelBooking(req.params.id);
    res.json(booking);
  } catch (err) { next(err); }
};

export const utilizationReportHandler = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const report = await service.generateReport(from, to);
    res.json(report);
  } catch (err) { next(err); }
};