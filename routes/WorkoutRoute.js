const express = require("express");
const router = express.Router();
const { authGuard } = require("./../middleware/AuthGuard");

const { addWorkout, getAllWorkouts, updateWorkout, deleteWorkout, toggleCompletion, getLifeTimeWorkouts, getWeeklyStats, getTodayWorkouts, getTraineeTodaysWorkoutsByTrainer } = require("../controllers/WorkoutController");


router.post("/add_workout", authGuard, addWorkout);
router.get("/get_all_workouts", authGuard, getAllWorkouts);
router.put("/update_workout/:id", authGuard, updateWorkout);
router.delete("/delete_workout/:id", authGuard, deleteWorkout);
router.patch("/toggle_completion/:id", authGuard, toggleCompletion);

router.get("/todays_workouts", authGuard, getTodayWorkouts);
router.get("/lifetime_workouts", authGuard, getLifeTimeWorkouts);
router.get("/weekly_stats", authGuard, getWeeklyStats);

router.get("/get_all_workouts_by_trainer", authGuard, getTraineeTodaysWorkoutsByTrainer);

// Export the route
module.exports = router;