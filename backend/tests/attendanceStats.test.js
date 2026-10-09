// Unit tests: one function, no database, no HTTP
const { calculateStatistics } = require('../utils/attendanceStats');

describe('calculateStatistics', () => {
  test('calculates absent days and percentage', () => {
    expect(calculateStatistics(4, 3)).toEqual({
      totalDays: 4,
      presentDays: 3,
      absentDays: 1,
      attendancePercentage: 75
    });
  });

  test('rounds the percentage to two decimal places', () => {
    expect(calculateStatistics(3, 2).attendancePercentage).toBe(66.67);
  });

  test('returns 0% instead of dividing by zero when there are no records', () => {
    expect(calculateStatistics(0, 0).attendancePercentage).toBe(0);
  });
});
