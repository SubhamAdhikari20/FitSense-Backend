// tests/workoutController.test.js
const { 
    addWorkout, 
    getAllWorkouts,
    getTodayWorkouts,
    getLifeTimeWorkouts,
    getWeeklyStats,
    updateWorkout,
    deleteWorkout,
    toggleCompletion
  } = require("../../controllers/WorkoutController");
  const workoutModel = require("../../models/WorkoutModel");
  const userModel = require("../../models/UserModel");
  const { Op } = require("sequelize");
  
  // Mock dependencies
  jest.mock("../models/WorkoutModel", () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  }));
  
  jest.mock("../models/UserModel", () => ({
    findOne: jest.fn(),
  }));
  
  // Mock Date-fns if needed
  jest.mock('date-fns', () => ({
    getISOWeek: jest.fn(),
  }));
  
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };
  
  describe("Workout Controller", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    describe("addWorkout", () => {
      it("should create a new workout for user", async () => {
        const req = {
          body: {
            category: "Strength",
            workoutName: "Bench Press",
            sets: 3,
            reps: 10,
            weight: 100,
            duration: 30
          },
          user: { id: 1 }
        };
        const res = mockResponse();
  
        const mockWorkout = { id: 1, ...req.body, userId: 1 };
        workoutModel.create.mockResolvedValue(mockWorkout);
  
        await addWorkout(req, res);
  
        expect(workoutModel.create).toHaveBeenCalledWith({
          userId: 1,
          category: "Strength",
          workoutName: "Bench Press",
          sets: 3,
          reps: 10,
          weight: 100,
          duration: 30
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          message: "Workout added successfully!",
          workout: mockWorkout
        });
      });
    });
  
    describe("getAllWorkouts", () => {
      it("should fetch all workouts for authenticated user", async () => {
        const req = {
          user: { id: 1 },
          query: {}
        };
        const res = mockResponse();
        
        const mockWorkouts = [{ id: 1, userId: 1 }];
        workoutModel.findAll.mockResolvedValue(mockWorkouts);
  
        await getAllWorkouts(req, res);
  
        expect(workoutModel.findAll).toHaveBeenCalledWith({
          where: { userId: 1 },
          order: [['createdAt', 'DESC']]
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ workouts: mockWorkouts });
      });
    });
  
    describe("getTodayWorkouts", () => {
      it("should fetch today's workouts", async () => {
        const req = {
          user: { id: 1 },
          query: { date: "2024-03-20" }
        };
        const res = mockResponse();
        
        const mockWorkouts = [{ id: 1 }];
        workoutModel.findAll.mockResolvedValue(mockWorkouts);
  
        await getTodayWorkouts(req, res);
  
        expect(workoutModel.findAll).toHaveBeenCalledWith({
          where: {
            userId: 1,
            createdAt: {
              [Op.between]: [
                new Date("2024-03-20T00:00:00.000Z"),
                new Date("2024-03-20T23:59:59.999Z")
              ]
            }
          },
          order: [['createdAt', 'DESC']]
        });
        expect(res.status).toHaveBeenCalledWith(200);
      });
    });
  
    describe("updateWorkout", () => {
      it("should update a workout", async () => {
        const req = {
          params: { id: 1 },
          body: {
            category: "Updated Category",
            workoutName: "Updated Name"
          },
          user: { id: 1 }
        };
        const res = mockResponse();
  
        const mockWorkout = { 
          id: 1, 
          userId: 1,
          update: jest.fn().mockResolvedValue(true)
        };
        
        workoutModel.findOne.mockResolvedValue(mockWorkout);
  
        await updateWorkout(req, res);
  
        expect(workoutModel.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(mockWorkout.update).toHaveBeenCalledWith({
          category: "Updated Category",
          workoutName: "Updated Name"
        });
        expect(res.status).toHaveBeenCalledWith(200);
      });
    });
  
    describe("deleteWorkout", () => {
      it("should delete a workout", async () => {
        const req = {
          params: { id: 1 },
          user: { id: 1 }
        };
        const res = mockResponse();
  
        const mockWorkout = { 
          id: 1, 
          userId: 1,
          destroy: jest.fn().mockResolvedValue(true)
        };
        
        workoutModel.findOne.mockResolvedValue(mockWorkout);
  
        await deleteWorkout(req, res);
  
        expect(workoutModel.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(mockWorkout.destroy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
      });
    });
  
    describe("toggleCompletion", () => {
      it("should toggle workout completion status", async () => {
        const req = {
          params: { id: 1 },
          user: { id: 1 }
        };
        const res = mockResponse();
  
        const mockWorkout = { 
          id: 1, 
          completed: false,
          update: jest.fn().mockResolvedValue(true),
          reload: jest.fn().mockResolvedValue({ completed: true })
        };
        
        workoutModel.findOne.mockResolvedValue(mockWorkout);
  
        await toggleCompletion(req, res);
  
        expect(mockWorkout.update).toHaveBeenCalledWith({ completed: true });
        expect(res.status).toHaveBeenCalledWith(200);
      });
    });
  
    // Similar tests for getLifeTimeWorkouts and getWeeklyStats
  });