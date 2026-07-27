const asyncHandler = require("../utils/asyncHandler");
const dashboardService = require("../services/dashboard.service");

exports.getDashboard = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getDashboardStats();

  res.json({
    success: true,
    stats,
  });
});