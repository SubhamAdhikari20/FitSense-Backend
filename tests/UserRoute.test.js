// tests/userRoutes.test.js
const request = require("supertest");
const app = require("../index"); // Ensure your Express app is exported from this file
const User = require("../models/UserModel");

// Mock the User model methods (if desired)
jest.mock("../models/UserModel", () => ({
    findOne: jest.fn(),
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByEmail: jest.fn(),
    destroy: jest.fn(),
}));

describe("User Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/user/register_user", () => {
        it("should create a new user and return 201", async () => {
            // Simulate no existing user
            User.findOne.mockResolvedValue(null);
            const newUser = {
                id: 1,
                fullName: "Jane Doe",
                email: "jane@example.com",
                phoneNumber: "9876543210",
                password: "hashedPassword123",
                role: "user",
                createdAt: new Date(),
                updatedAt: new Date(),
                get: function (options) {
                    return this;
                },
            };
            User.create.mockResolvedValue(newUser);

            const res = await request(app)
                .post("/api/user/register_user")
                .send({
                    fullName: "Jane Doe",
                    email: "jane@example.com",
                    phoneNumber: "9876543210",
                    password: "password123",
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("token");
            expect(res.body).toHaveProperty("user");
            expect(res.body.user.email).toBe("jane@example.com");
        });
    });

    describe("POST /api/user/login_user", () => {
        it("should log in an existing user and return 200", async () => {
            const user = {
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

            User.findOne.mockResolvedValue(user);

            const res = await request(app)
                .post("/api/user/login_user")
                .send({
                    email: "jane@example.com",
                    password: "password123",
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("token");
            expect(res.body.user.email).toBe("jane@example.com");
        });
    });

    describe("DELETE /api/user/delete_user", () => {
        it("should delete an existing user and return 200", async () => {
            const user = {
                id: 1,
                email: "jane@example.com",
                destroy: jest.fn().mockResolvedValue(true),
            };

            User.findOne.mockResolvedValue(user);

            // Here you need to provide a valid JWT token in the Authorization header.
            // For testing, you can generate a token (or bypass auth middleware if needed).
            const token = "valid_jwt_token_for_test";

            const res = await request(app)
                .delete("/api/user/delete_user")
                .set("Authorization", `Bearer ${token}`)
                .send();

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: "jane@example.com" } });
            expect(user.destroy).toHaveBeenCalled();
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Account deleted successfully!");
        });
    });

    describe("GET /api/user/view_user_by_email", () => {
        it("should return a user by email", async () => {
            const user = {
                id: 1,
                fullName: "Jane Doe",
                email: "jane@example.com",
                phoneNumber: "9876543210",
                role: "user",
            };

            User.findOne.mockResolvedValue(user);

            const res = await request(app)
                .get("/api/user/view_user_by_email")
                .query({ email: "jane@example.com" });

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: "jane@example.com" } });
            expect(res.status).toBe(200);
            expect(res.body.user.email).toBe("jane@example.com");
        });
    });
});
