export const validateBookingTime = (startStr, endStr) => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (start >= end) throw { name: "ValidationError", message: "startTime must be before endTime", statusCode: 400 };

  const diffMs = end - start;
  if (diffMs < 900000 || diffMs > 14400000) throw { name: "ValidationError", message: "Duration 15m-4h", statusCode: 400 };

  const day = start.getUTCDay(); // 1-5 is Mon-Fri
  const startH = start.getUTCHours();
  const endH = end.getUTCHours();
  if (day === 0 || day === 6 || startH < 8 || endH > 20) {
    throw { name: "ValidationError", message: "Allowed Mon-Fri, 08:00-20:00", statusCode: 400 };
  }
};

export const calculateRoomStats = (room, from, to, bookings) => {
  const rangeStart = new Date(from);
  const rangeEnd = new Date(to);
  const filtered = bookings.filter(b => b.roomId === room.id && b.status === "confirmed");

  let bookedHours = 0;
  filtered.forEach(b => {
    const s = Math.max(new Date(b.startTime), rangeStart);
    const e = Math.min(new Date(b.endTime), rangeEnd);
    if (s < e) bookedHours += (e - s) / 3600000;
  });

  const totalBusinessHours = 12;
  return {
    roomId: room.id,
    roomName: room.name,
    totalBookingHours: bookedHours,
    utilizationPercent: bookedHours / totalBusinessHours
  };
};