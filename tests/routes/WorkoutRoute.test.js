// tests/routes/workoutRoutes.test.js
const request = require('supertest');
const express = require('express');
const workoutRoutes = require('./../../routes/WorkoutRoute');
const { addWorkout, getAllWorkouts } = require('./../../controllers/WorkoutController');

// Mock controller functions
jest.mock('../../controllers/WorkoutController', () => ({
    addWorkout: jest.fn(),
    getAllWorkouts: jest.fn(),
    updateWorkout: jest.fn(),
    deleteWorkout: jest.fn(),
    toggleCompletion: jest.fn(),
    getTodayWorkouts: jest.fn(),
    getLifeTimeWorkouts: jest.fn(),
    getWeeklyStats: jest.fn(),
}));

// Mock auth middleware
jest.mock('../../middleware/AuthGuard', () => ({
    authGuard: jest.fn((req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use('/workouts', workoutRoutes);

describe('Workout Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /workouts/add_workout', () => {
        it('should create a new workout', async () => {
            const mockWorkout = { id: 1, category: 'Strength' };
            addWorkout.mockImplementation((req, res) =>
                res.status(201).json({ message: 'Created', workout: mockWorkout })
            );

            const response = await request(app)
                .post('/workouts/add_workout')
                .send({
                    category: 'Strength',
                    workoutName: 'Bench Press',
                    sets: 3,
                    reps: 10,
                    weight: 100,
                    duration: 30
                });

            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual({
                message: 'Created',
                workout: mockWorkout
            });
        });

        it('should return 401 for unauthorized access', async () => {
            require('../../middleware/AuthGuard').authGuard.mockImplementationOnce(
                (req, res, next) => res.status(401).json({ error: 'Unauthorized' })
            );

            const response = await request(app)
                .post('/workouts/add_workout')
                .send({});

            expect(response.statusCode).toBe(401);
        });
    });

    describe('GET /workouts/get_all_workouts', () => {
        it('should fetch all workouts', async () => {
            const mockWorkouts = [{ id: 1 }, { id: 2 }];
            getAllWorkouts.mockImplementation((req, res) =>
                res.status(200).json({ workouts: mockWorkouts })
            );

            const response = await request(app)
                .get('/workouts/get_all_workouts');

            expect(response.statusCode).toBe(200);
            expect(response.body.workouts).toHaveLength(2);
        });
    });

    describe('PUT /workouts/update_workout/:id', () => {
        it('should update a workout', async () => {
            const mockWorkout = { id: 1, category: 'Updated' };
            updateWorkout.mockImplementation((req, res) =>
                res.status(200).json({ message: 'Updated', workout: mockWorkout })
            );

            const response = await request(app)
                .put('/workouts/update_workout/1')
                .send({ category: 'Updated' });

            expect(response.statusCode).toBe(200);
            expect(response.body.workout.category).toBe('Updated');
        });
    });

    describe('DELETE /workouts/delete_workout/:id', () => {
        it('should delete a workout', async () => {
            deleteWorkout.mockImplementation((req, res) =>
                res.status(200).json({ message: 'Deleted' })
            );

            const response = await request(app)
                .delete('/workouts/delete_workout/1');

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Deleted');
        });
    });

    describe('GET /workouts/todays_workouts', () => {
        it('should fetch today\'s workouts', async () => {
            getTodayWorkouts.mockImplementation((req, res) =>
                res.status(200).json({ workouts: [] })
            );

            const response = await request(app)
                .get('/workouts/todays_workouts?date=2024-03-20');

            expect(response.statusCode).toBe(200);
            expect(response.body.workouts).toBeInstanceOf(Array);
        });
    });

    describe('GET /workouts/weekly_stats', () => {
        it('should return weekly stats', async () => {
            const mockStats = { weeks: [], calories: [] };
            getWeeklyStats.mockImplementation((req, res) =>
                res.status(200).json(mockStats)
            );

            const response = await request(app)
                .get('/workouts/weekly_stats?startDate=2024-03-18&endDate=2024-03-24');

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('weeks');
        });
    });

    // Add tests for other routes following the same pattern
});