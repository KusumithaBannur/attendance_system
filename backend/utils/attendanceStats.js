// Turn raw counts into the numbers shown in a report.
// Kept as a plain function so it can be unit tested without a database.
const calculateStatistics = (totalDays, presentDays) => {
  const attendancePercentage = totalDays > 0
    ? Number(((presentDays / totalDays) * 100).toFixed(2))
    : 0;

  return {
    totalDays,
    presentDays,
    absentDays: totalDays - presentDays,
    attendancePercentage
  };
};

module.exports = { calculateStatistics };
