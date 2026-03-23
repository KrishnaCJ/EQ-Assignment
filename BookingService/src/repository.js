const db = { rooms: [], bookings: [], idempotency: new Map() };

export const saveRoom = async (room) => {
  const newRoom = { ...room, id: `rm_${Date.now()}` };
  db.rooms.push(newRoom);
  return newRoom;
};

export const findRoomByName = async (name) => db.rooms.find(r => r.name.toLowerCase() === name.toLowerCase());
export const getRoomById = async (id) => db.rooms.find(r => r.id === id);
export const getRooms = async ({ minCapacity, amenity }) => db.rooms.filter(r => 
  (!minCapacity || r.capacity >= parseInt(minCapacity)) && (!amenity || r.amenities.includes(amenity))
);

export const saveBooking = async (booking) => {
  const newBooking = { ...booking, id: `bk_${Date.now()}` };
  db.bookings.push(newBooking);
  return newBooking;
};

export const getBookings = async ({ roomId, from, to, limit = 10, offset = 0 }) => {
  let items = db.bookings.filter(b => 
    (!roomId || b.roomId === roomId) &&
    (!from || new Date(b.startTime) >= new Date(from)) &&
    (!to || new Date(b.endTime) <= new Date(to))
  );
  const total = items.length;
  items = items.slice(offset, offset + limit);
  return { items, total, limit: parseInt(limit), offset: parseInt(offset) };
};

export const findOverlap = async (roomId, start, end) => db.bookings.find(b => 
  b.roomId === roomId && b.status === "confirmed" &&
  new Date(b.startTime) < new Date(end) && new Date(b.endTime) > new Date(start)
);

export const getIdempotency = async (key, email) => db.idempotency.get(`${key}:${email}`);
export const saveIdempotency = async (key, email, res) => db.idempotency.set(`${key}:${email}`, res);
export const getBookingById = async (id) => db.bookings.find(b => b.id === id);
export const updateBookingStatus = async (id, status) => {
  const b = db.bookings.find(x => x.id === id);
  if (b) b.status = status;
  return b;
};
export const getAllBookings = async () => db.bookings;