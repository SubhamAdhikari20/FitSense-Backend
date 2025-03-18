const express = require("express");
const router = express.Router();
const { authGuard } = require("./../middleware/AuthGuard");
const { getAllBookedTrainers, bookTrainer, cancelBooking } = require("../controllers/BookTrainerController");

router.post("/book_trainer", authGuard, bookTrainer);
router.delete("/cancel_trainer_booking/:trainerId", authGuard, cancelBooking);
router.get("/get_all_booked_trainers", authGuard, getAllBookedTrainers);

module.exports = router;