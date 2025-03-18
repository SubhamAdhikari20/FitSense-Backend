const bookTrainerModel = require("./../models/BookTrianerModel");


// Create a new booking for the current user
const bookTrainer = async (req, res) => {
    try {
        const { trainerId } = req.body;
        const currentUserId = req.user.id;

        console.log(currentUserId);
        
        // Check if the user has already booked the trainer
        const existingBooking = await bookTrainerModel.findOne({
            where: {
                userId: currentUserId,
                trainerId: trainerId
            }
        });

        if (existingBooking) {
            return res.status(400).json({ error: "You have already booked this trainer" });
        }

        // Create a new booking (booked will default to true)
        const newBooking = await bookTrainerModel.create({
            userId: currentUserId,
            trainerId: trainerId,
            booked: true,
        });

        return res.status(200).json({ message: "Trainer booked successfully", bookings: newBooking });
    } catch (error) {
        console.error("Error booking trainer:", error);
        return res.status(500).json({ error: "Failed to book trainer" });
    }
};


const cancelBooking = async (req, res) => {
    try {
        const trainerId = req.params.trainerId;
        const currentUserId = req.user.id;

        // Check if the user has already booked the trainer
        const booking = await bookTrainerModel.findOne({
            where: {
                userId: currentUserId,
                trainerId: trainerId
            }
        });

        if (!booking) {
            return res.status(400).json({ error: "You have not booked this trainer" });
        }

        // Cancel the booking
        await booking.destroy();

        return res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        return res.status(500).json({ error: "Failed to cancel booking" });
    }
};

const getAllBookedTrainers = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        // Retrieve bookings for the current user where 'booke' is true
        const bookings = await bookTrainerModel.findAll({
            where: {
                // booked: true,
                userId: currentUserId
            }
        });
        return res.status(200).json({ bookings });
    } catch (error) {
        console.error("Error fetching booked trainers:", error);
        return res.status(500).json({ error: "Failed to fetch booked trainers" });
    }
};


module.exports = { getAllBookedTrainers, bookTrainer, cancelBooking };