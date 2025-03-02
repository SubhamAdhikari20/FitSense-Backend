const workoutModel = require("../models/WorkoutModel");
const userModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createError } = require("./../error");
const { Op } = require("sequelize");
const { getISOWeek } = require('date-fns');
const dotenv = require("dotenv");
dotenv.config();


const addWorkout = async (req, res) => {
    const { userId, category, workoutName, sets, reps, weight, duration, caloriesBurned } = req.body;
    // const userId = req.user?.id;
    // const trainerId = req.trainer?.id;

    if (!category || !workoutName || !sets || !reps || !weight || !duration) {
        return res.status(400).json({ error: "Please, insert all details!!!" });
    }

    try {
        if (req.user?.id) {
            // Add new Workout
            const newWorkout = await workoutModel.create({
                userId: req.user?.id,
                category,
                workoutName,
                sets,
                reps,
                weight,
                duration,
                caloriesBurned
            });

            return res.status(201).json({ message: "Workout added successfully!", workout: newWorkout });
        }
        else if (req.trainer?.id) {
            // Add new Workout
            const newWorkout = await workoutModel.create({
                trainerId: req.trainer?.id,
                category,
                workoutName,
                sets,
                reps,
                weight,
                duration
            });

            return res.status(201).json({ message: "Workout added successfully!", workout: newWorkout });
        }
        else {
            return
        }

    }
    catch (error) {
        console.log("Error registering user:", error);
        return res.status(500).json({ error: "Internal server error!" });
    }
};


// Get all workouts for the authenticated user
const getAllWorkouts = async (req, res) => {
    try {
        // Get user ID from JWT token (secure approach)
        const userId = req.user.id;
        const { date } = req.query;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized user" });
        }

        // Build where clause with userId
        let whereClause = { userId };

        // if (date) {
        //     const [year, month, day] = date.split('-');
        //     const startDate = new Date(year, month - 1, day);
        //     startDate.setUTCHours(0, 0, 0, 0);

        //     const endDate = new Date(year, month - 1, day);
        //     endDate.setUTCHours(23, 59, 59, 999);

        //     whereClause.createdAt = {
        //         [Op.between]: [startDate.toISOString(), endDate.toISOString()]
        //     };
        // }

        // If a date is provided, filter workouts for that day
        if (date) {
            // Parse the date (ensure your frontend sends a valid date string)
            const selectedDate = new Date(date);
            // Calculate start and end of the day
            const startOfDay = new Date(selectedDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(selectedDate);
            endOfDay.setHours(23, 59, 59, 999);

            // Add createdAt filter
            whereClause.createdAt = {
                [Op.between]: [startOfDay, endOfDay],
            };
        }

        // const workouts = await workoutModel.findAll({ where: { userId } });
        const workouts = await workoutModel.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({ workouts });
    }
    catch (error) {
        console.error("Error fetching workouts:", error);
        return res.status(500).json({ error: "Internal server error!" });
    }
};


const getTodayWorkouts = async (req, res) => {
    try {
        const { date } = req.query;
        const userId = req?.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        // Create date range in UTC
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const workouts = await workoutModel.findAll({
            where: {
                userId: userId,
                createdAt: {
                    [Op.between]: [
                        startOfDay.toISOString(),
                        endOfDay.toISOString()
                    ]
                }
            },
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({ workouts });
    }
    catch (error) {
        console.error("Error fetching todays workouts:", error);
        return res.status(500).json({ error: "Internal server error!", details: error.message });
    }
}


const getLifeTimeWorkouts = async (req, res) => {
    try {
        const workouts = await workoutModel.findAll({
            where: {
                userId: req?.user?.id,
                completed: true
            },
            order: [['createdAt', 'DESC']]
        });
        return res.status(200).json({ workouts });
    } catch (error) {
        console.error("Error fetching completed workouts:", error);
        return res.status(500).json({ error: "Internal server error!" });
    }
};


const getWeeklyStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const workouts = await workoutModel.findAll({
            where: {
                userId: req.user.id,
                completed: true,
                createdAt: {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                }
            }
        });

        // Process data for weekly stats
        const weeklyData = processWeeklyData(workouts, new Date(startDate));

        return res.status(200).json(weeklyData);
    } catch (error) {
        console.error("Error fetching weekly stats:", error);
        return res.status(500).json({ error: "Internal server error!" });
    }
};

// New processWeeklyData that guarantees an array for Sunday–Saturday
const processWeeklyData = (workouts, weekStart) => {
    // Define fixed day labels (Sunday to Saturday)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // Initialize arrays with zeros
    const stats = {
        weeks: days,
        calories: Array(7).fill(0),
        minutes: Array(7).fill(0),
        workouts: Array(7).fill(0),
    };

    // Define weekEnd as weekStart + 7 days
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

    workouts.forEach(workout => {
        const date = new Date(workout.createdAt);
        // Only include workouts within the week
        if (date >= weekStart && date < weekEnd) {
            const dayIndex = date.getDay(); // 0 = Sunday, 6 = Saturday
            const cal = Number(workout.caloriesBurned) || 0;
            const dur = Number(workout.duration) || 0;
            stats.calories[dayIndex] += cal;
            stats.minutes[dayIndex] += dur;
            stats.workouts[dayIndex] += 1;
        }
    });
    return stats;
};



/*
// Utility function to process weekly workout data
const processWeeklyData = (workouts) => {
    const dailyStats = {};
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'short', day: 'numeric'
    });

    workouts.forEach(workout => {
        // Convert to numbers with fallback to 0
        const calories = Number(workout.caloriesBurned) || 0;
        const duration = Number(workout.duration) || 0;
        const date = new Date(workout.createdAt);

        // Validate date
        if (isNaN(date)) return; // Skip invalid dates

        // Example: "2025-03-01"
        const dateKey = date.toISOString().split('T')[0];
        // Example: "Mar 1"
        const formattedDate = dateFormatter.format(date);


        if (!dailyStats[dateKey]) {
            dailyStats[dateKey] = {
                calories: 0,
                minutes: 0,
                workouts: 0,
                formattedDate: formattedDate
            };
        }

        // Add numeric values
        dailyStats[dateKey].calories += calories;
        dailyStats[dateKey].minutes += duration;
        dailyStats[dateKey].workouts += 1;
    });

    // Sort dates chronologically and convert to display format
    const sortedDates = Object.keys(dailyStats).sort();

    return {
        weeks: sortedDates.map(date => dailyStats[date].formattedDate),
        calories: sortedDates.map(date => dailyStats[date].calories),
        minutes: sortedDates.map(date => dailyStats[date].minutes),
        workouts: sortedDates.map(date => dailyStats[date].workouts)
    };
};
*/



// Function to calculate calories burnt for a workout
const calculateCaloriesBurnt = (workoutDetails) => {
    const durationInMinutes = parseInt(workoutDetails.duration);
    const weightInKg = parseInt(workoutDetails.weight);
    const caloriesBurntPerMinute = 5; // Sample value, actual calculation may vary
    return durationInMinutes * caloriesBurntPerMinute * weightInKg;
};


// Update a workout by ID
const updateWorkout = async (req, res) => {
    const { id } = req.params;
    const { category, workoutName, sets, reps, weight, duration, caloriesBurned } = req.body;

    try {

        if (req.user?.id) {
            const userId = req.user?.id;
            const workout = await workoutModel.findOne({ where: { id } });

            if (!workout) {
                return res.status(404).json({ error: "Workout not found" });
            }
            // Update the workout instance
            await workout.update({ category, workoutName, sets, reps, weight, duration, caloriesBurned });

            return res.status(200).json({ message: "Workout updated successfully", workout });
        }
        else if (req.trainer?.id) {
            const trainerId = req.trainer?.id;
            const workout = await workoutModel.findOne({ where: { id } });

            if (!workout) {
                return res.status(404).json({ error: "Workout not found" });
            }
            // Update the workout instance
            await workout.update({ category, workoutName, sets, reps, weight, duration, caloriesBurned });

            return res.status(200).json({ message: "Workout updated successfully", workout });
        }
        else {
            return res.status(200).json({ message: "Something went wrong", workout });
        }


        /*
        // Combine conditions: Check if workout belongs to the authenticated user or trainer
        const workout = await workoutModel.findOne({
            where: {
                id,
                [Op.or]: [
                    { userId: req.user?.id },
                    { trainerId: req.trainer?.id }
                ]
            }
        });

        if (!workout) {
            return res.status(404).json({ error: "Workout not found or unauthorized" });
        }
        // Update the workout instance
        await workout.update({ category, workoutName, sets, reps, weight, duration });

        return res.status(200).json({ message: "Workout updated successfully", workout });
        */

    }
    catch (error) {
        console.error("Error updating workout:", error);
        return res.status(500).json({ error: "Internal server error!" });
    }
};

// Delete a workout by ID
const deleteWorkout = async (req, res) => {
    const { id } = req.params;
    try {
        if (req.user?.id) {
            const userId = req.user?.id;
            const workout = await workoutModel.findOne({ where: { id } });

            if (!workout) {
                return res.status(404).json({ error: "Workout not found" });
            }
            await workout.destroy();
            return res.status(200).json({ message: "Workout deleted successfully" });
        }
        else if (req.trainer?.id) {
            const trainerId = req.trainer?.id;
            const workout = await workoutModel.findOne({ where: { id } });

            if (!workout) {
                return res.status(404).json({ error: "Workout not found" });
            }
            await workout.destroy();
            return res.status(200).json({ message: "Workout deleted successfully" });
        }
        else {
            return
        }


        // const workout = await workoutModel.findOne({
        //     where: {
        //         id, [Op.or]: [
        //             { userId: req.user?.id },
        //             { trainerId: req.trainer?.id }
        //         ]
        //     }
        // });

        // if (!workout) {
        //     return res.status(404).json({ error: "Workout not found" });
        // }
        // await workout.destroy();
        // return res.status(200).json({ message: "Workout deleted successfully" });

    }
    catch (error) {
        console.error("Error deleting workout:", error);
        return res.status(500).json({ error: "Internal server error!" });
    }
};


const toggleCompletion = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    try {
        if (userId) {
            const workout = await workoutModel.findOne({ where: { id } });

            if (!workout) {
                return res.status(404).json({ error: "Workout not found" });
            }

            await workout.update({ completed: !workout.completed });
            return res.status(200).json({ message: "Completion status updated", workout: await workout.reload() });
        }

    }
    catch (error) {
        console.error("Error toggling completion:", error);
        return res.status(500).json({ error: "Internal server error!" });
    }
};

module.exports = { addWorkout, getAllWorkouts, updateWorkout, deleteWorkout, toggleCompletion, getLifeTimeWorkouts, getWeeklyStats, getTodayWorkouts };