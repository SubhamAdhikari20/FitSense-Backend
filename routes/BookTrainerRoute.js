const express = require("express");
const router = express.Router();
const { authGuard } = require("./../middleware/AuthGuard");
const { getAllBookedTrainers, getAllTrainees, bookTrainer, cancelBooking } = require("../controllers/BookTrainerController");

router.post("/user/book_trainer", authGuard, bookTrainer);
router.delete("/user/cancel_trainer_booking/:trainerId", authGuard, cancelBooking);
router.get("/user/get_all_booked_trainers", authGuard, getAllBookedTrainers);
router.get("/trainer/get_all_trainees", authGuard, getAllTrainees);

module.exports = router;