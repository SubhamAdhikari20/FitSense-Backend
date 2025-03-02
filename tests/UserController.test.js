// tests/userController.test.js
const { registerUser, loginUser, forgotPassword, deleteUserByEmail, getUserByEmail } = require("../controllers/UserController");
const User = require("../models/UserModel");
const { generateToken } = require("../utils/jwtUtils");
const bcrypt = require("bcrypt");

// Mock dependencies
jest.mock("../models/UserModel", () => ({
    findOne: jest.fn(),
    create: jest.fn(),
}));
jest.mock("../utils/jwtUtils", () => ({
    generateToken: jest.fn(),
}));
jest.mock("bcrypt", () => ({
    hash: jest.fn().mockResolvedValue("hashedPassword123"),
    compare: jest.fn(),
}));

// A helper function to create a mock response object
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("User Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("registerUser", () => {
        it("should register a new user and return 201 status", async () => {
            const req = {
                body: {
                    fullName: "Jane Doe",
                    email: "jane@example.com",
                    phoneNumber: "9876543210",
                    password: "password123",
                },
            };
            const res = mockResponse();

            // Simulate no existing user
            User.findOne.mockResolvedValue(null);

            // Simulate user creation returns an object (simulate Sequelize instance with get method)
            const createdUser = {
                id: 1,
                fullName: "Jane Doe",
                email: "jane@example.com",
                phoneNumber: "9876543210",
                password: "hashedPassword123",
                role: "user",
                get: function (options) {
                    return this;
                },
            };
            User.create.mockResolvedValue(createdUser);
            generateToken.mockReturnValue("mocked_token");

            await registerUser(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: "jane@example.com" } });
            expect(User.create).toHaveBeenCalled();
            expect(generateToken).toHaveBeenCalledWith(createdUser.id);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: "User registered successfully!",
                    token: "mocked_token",
                    user: createdUser,
                })
            );
        });
    });

    describe("loginUser", () => {
        it("should log in an existing user and return 200 status", async () => {
            const req = {
                body: {
                    email: "jane@example.com",
                    password: "password123",
                },
            };
            const res = mockResponse();

            const foundUser = {
                id: 1,
                fullName: "Jane Doe",
                email: "jane@example.com",
                phoneNumber: "9876543210",
                password: "hashedPassword123",
                role: "user",
                dataValues: {
                    id: 1,
                    fullName: "Jane Doe",
                    email: "jane@example.com",
                    phoneNumber: "9876543210",
                    password: "hashedPassword123",
                    role: "user",
                },
            };

            User.findOne.mockResolvedValue(foundUser);
            bcrypt.compare.mockResolvedValue(true);
            generateToken.mockReturnValue("mocked_token");

            await loginUser(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: "jane@example.com" } });
            expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword123");
            expect(generateToken).toHaveBeenCalledWith(foundUser.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: "Successfully logged as User",
                    token: "mocked_token",
                    user: expect.objectContaining({ email: "jane@example.com", role: "user" }),
                })
            );
        });
    });

    describe("forgotPassword", () => {
        it("should reset password and return 200 status", async () => {
            const req = {
                body: {
                    email: "jane@example.com",
                    newPassword: "newPassword123",
                },
            };
            const res = mockResponse();

            const foundUser = {
                id: 1,
                fullName: "Jane Doe",
                email: "jane@example.com",
                password: "oldHashedPassword",
                update: jest.fn().mockResolvedValue(true),
            };

            User.findOne.mockResolvedValue(foundUser);
            // Simulate bcrypt.hash resolving to a new hashed password
            bcrypt.hash.mockResolvedValue("newHashedPassword");

            await forgotPassword(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: "jane@example.com" } });
            expect(foundUser.update).toHaveBeenCalledWith({ password: "newHashedPassword" });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: "Password reset successfully",
                    user: foundUser,
                })
            );
        });
    });

    describe("deleteUserByEmail", () => {
        it("should delete an existing user and return 200 status", async () => {
            // In this controller, req.user is expected to have email.
            const req = { user: { email: "jane@example.com" } };
            const res = mockResponse();

            const foundUser = {
                id: 1,
                email: "jane@example.com",
                destroy: jest.fn().mockResolvedValue(true),
            };

            User.findOne.mockResolvedValue(foundUser);

            await deleteUserByEmail(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: "jane@example.com" } });
            expect(foundUser.destroy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Account deleted successfully!" });
        });
    });

    describe("getUserByEmail", () => {
        it("should return a user by email", async () => {
            const req = { query: { email: "jane@example.com" } };
            const res = mockResponse();

            const foundUser = {
                id: 1,
                fullName: "Jane Doe",
                email: "jane@example.com",
                phoneNumber: "9876543210",
                role: "user",
            };

            User.findOne.mockResolvedValue(foundUser);

            await getUserByEmail(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: "jane@example.com" } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ user: foundUser });
        });
    });
});
