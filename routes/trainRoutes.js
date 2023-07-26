const express = require("express");
const {
  liveStatus,
  coachDetails,
  fetchStations,
} = require("../controller/Train.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get(`/live`, liveStatus);
router.get(`/fetchStations`, fetchStations);
module.exports = router;
