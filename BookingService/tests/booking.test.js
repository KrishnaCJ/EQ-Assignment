import { validateBookingTime, calculateRoomStats } from '../src/utils.js';

describe('Meeting Room Booking Service - Unit Tests', () => {

  // 1. Validation Rules [cite: 34-36, 40]
  describe('Booking Rule Validation', () => {
    test('should throw error if startTime is after endTime', () => {
      expect(() => {
        validateBookingTime("2026-03-25T14:00:00Z", "2026-03-25T13:00:00Z");
      }).toThrow(/startTime must be before endTime/);
    });

    test('should throw error for duration less than 15 minutes', () => {
      expect(() => {
        validateBookingTime("2026-03-25T10:00:00Z", "2026-03-25T10:10:00Z");
      }).toThrow(/Duration 15m-4h/);
    });

    test('should throw error for duration more than 4 hours', () => {
      expect(() => {
        validateBookingTime("2026-03-25T10:00:00Z", "2026-03-25T15:00:00Z");
      }).toThrow(/Duration 15m-4h/);
    });

    test('should throw error for weekend bookings (Saturday)', () => {
      expect(() => {
        validateBookingTime("2026-03-28T10:00:00Z", "2026-03-28T11:00:00Z");
      }).toThrow(/Allowed Mon-Fri/);
    });

    test('should throw error for bookings outside 08:00-20:00', () => {
      expect(() => {
        validateBookingTime("2026-03-25T07:00:00Z", "2026-03-25T09:00:00Z");
      }).toThrow(/Allowed Mon-Fri/);
    });
  });

  describe('Room Utilization Calculations', () => {
    const mockRoom = { id: "rm_123", name: "Test Room" };
    const from = "2026-03-25T08:00:00Z";
    const to = "2026-03-25T20:00:00Z"; // 12 hour business day

    test('should handle partial overlaps (starts before range)', () => {
      const bookings = [{
        roomId: "rm_123",
        status: "confirmed",
        startTime: "2026-03-25T07:00:00Z", // Starts 1hr before
        endTime: "2026-03-25T09:00:00Z"    // Ends 1hr after range start
      }];

      const result = calculateRoomStats(mockRoom, from, to, bookings);
      // Only 1 hour should be counted (08:00 to 09:00)
      expect(result.totalBookingHours).toBe(1);
      expect(result.utilizationPercent).toBe(1/12);
    });

    test('should return zero if there are no bookings', () => {
      const result = calculateRoomStats(mockRoom, from, to, []);
      expect(result.totalBookingHours).toBe(0);
      expect(result.utilizationPercent).toBe(0);
    });
  });
});