// tests/models/WorkoutModel.test.js
const { sequelize, Workout, User, Trainer } = require('../../models');
const { DataTypes } = require('sequelize');

describe('Workout Model', () => {
    beforeAll(async () => {
        // Setup test database connection
        await sequelize.authenticate();

        // Define associated models
        User.init({
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            fullName: DataTypes.STRING,
            email: DataTypes.STRING
        }, { sequelize, modelName: 'user' });

        Trainer.init({
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            fullName: DataTypes.STRING,
            email: DataTypes.STRING
        }, { sequelize, modelName: 'trainer' });

        Workout.init({}, { sequelize, modelName: 'workout' });

        // Setup associations
        Workout.belongsTo(User, { foreignKey: 'userId' });
        Workout.belongsTo(Trainer, { foreignKey: 'trainerId' });
        User.hasMany(Workout, { foreignKey: 'userId' });
        Trainer.hasMany(Workout, { foreignKey: 'trainerId' });

        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    beforeEach(async () => {
        // Clear data between tests
        await Workout.destroy({ where: {} });
        await User.destroy({ where: {} });
        await Trainer.destroy({ where: {} });
    });

    describe('Model Definition', () => {
        it('should have correct model fields', () => {
            const attributes = Workout.getAttributes();

            expect(attributes.userId.type).toEqual(DataTypes.INTEGER());
            expect(attributes.trainerId.type).toEqual(DataTypes.INTEGER());
            expect(attributes.category.type).toEqual(DataTypes.STRING());
            expect(attributes.workoutName.type).toEqual(DataTypes.STRING());
            expect(attributes.sets.type).toEqual(DataTypes.INTEGER());
            expect(attributes.reps.type).toEqual(DataTypes.INTEGER());
            expect(attributes.weight.type).toEqual(DataTypes.DECIMAL(10, 2)());
            expect(attributes.duration.type).toEqual(DataTypes.INTEGER());
            expect(attributes.caloriesBurned.type).toEqual(DataTypes.DECIMAL(10, 2)());
            expect(attributes.completed.type).toEqual(DataTypes.BOOLEAN());
        });
    });

    describe('Validations', () => {
        it('should require category and workoutName', async () => {
            const workout = Workout.build({
                sets: 3,
                reps: 10,
                weight: 50.5,
                duration: 30
            });

            await expect(workout.validate()).rejects.toThrow();
        });

        it('should validate minimum values', async () => {
            const workout = Workout.build({
                category: 'Strength',
                workoutName: 'Bench Press',
                sets: 0,  // Invalid
                reps: -5, // Invalid
                weight: -10,
                duration: 0
            });

            await expect(workout.validate()).rejects.toThrow();
        });
    });

    describe('Associations', () => {
        it('should belong to a User', async () => {
            const user = await User.create({
                fullName: 'John Doe',
                email: 'john@example.com'
            });

            const workout = await Workout.create({
                category: 'Cardio',
                workoutName: 'Running',
                sets: 1,
                reps: 1,
                weight: 0,
                duration: 30,
                userId: user.id
            });

            const foundWorkout = await Workout.findByPk(workout.id, {
                include: 'user'
            });

            expect(foundWorkout.user.id).toBe(user.id);
        });

        it('should belong to a Trainer', async () => {
            const trainer = await Trainer.create({
                fullName: 'Jane Trainer',
                email: 'jane@trainer.com'
            });

            const workout = await Workout.create({
                category: 'Strength',
                workoutName: 'Deadlift',
                sets: 5,
                reps: 5,
                weight: 100,
                duration: 45,
                trainerId: trainer.id
            });

            const foundWorkout = await Workout.findByPk(workout.id, {
                include: 'trainer'
            });

            expect(foundWorkout.trainer.id).toBe(trainer.id);
        });
    });

    describe('CRUD Operations', () => {
        it('should create a new workout', async () => {
            const workout = await Workout.create({
                category: 'Flexibility',
                workoutName: 'Yoga',
                sets: 3,
                reps: 10,
                weight: 0,
                duration: 60
            });

            expect(workout.id).toBeDefined();
            expect(workout.completed).toBe(false);
        });

        it('should update a workout', async () => {
            const workout = await Workout.create({
                category: 'Cardio',
                workoutName: 'Cycling',
                sets: 3,
                reps: 1,
                weight: 0,
                duration: 45
            });

            const updated = await workout.update({
                duration: 60,
                completed: true
            });

            expect(updated.duration).toBe(60);
            expect(updated.completed).toBe(true);
        });

        it('should delete a workout', async () => {
            const workout = await Workout.create({
                category: 'Strength',
                workoutName: 'Squat',
                sets: 5,
                reps: 5,
                weight: 100,
                duration: 30
            });

            await workout.destroy();
            const found = await Workout.findByPk(workout.id);
            expect(found).toBeNull();
        });
    });

    describe('Default Values', () => {
        it('should default completed to false', async () => {
            const workout = await Workout.create({
                category: 'Balance',
                workoutName: 'Single-leg Stance',
                sets: 3,
                reps: 10,
                duration: 10
            });

            expect(workout.completed).toBe(false);
        });

        it('should default weight to 0', async () => {
            const workout = await Workout.create({
                category: 'Cardio',
                workoutName: 'Jump Rope',
                sets: 3,
                reps: 100,
                duration: 15
            });

            expect(parseFloat(workout.weight)).toBe(0);
        });
    });
});