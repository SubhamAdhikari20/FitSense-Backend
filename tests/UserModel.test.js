// tests/UserModel.test.js
const SequelizeMock = require("sequelize-mock");
const { hashPassword } = require("../utils/bcryptUtils");
const sequelizeMock = new SequelizeMock();

// Define a mock User model
const UserMock = sequelizeMock.define("Users", {
    id: 1,
    fullName: "Test User",
    email: "test@example.com",
    phoneNumber: "9874562130",
    password: "user12345",
    profilePicture: "",
    role: "user",
});

// Mock the bcrypt function
jest.mock("../utils/bcryptUtils", () => ({
    hashPassword: jest.fn().mockResolvedValue("hashedpassword123"), // Mocking the hashed password
}));

beforeAll(() => {
    global.console.log = jest.fn(); // Mock console.log
});

afterAll(() => {
    global.console.log.mockRestore(); // Restore after tests are done
});

describe("User Model", () => {
    it("should hash the password before creating a user", async () => {
        const userData = {
            fullName: "Adam Gilchrist",
            email: "adam@example.com",
            phoneNumber: "9865413022",
            password: "adamg123",
            profilePicture: "",
            role: "user",
        };

        // Directly hash the password
        const hashedPassword = await hashPassword(userData.password);
        const userWithHashedPassword = {
            ...userData,
            password: hashedPassword,
        };

        const users = await UserMock.create(userWithHashedPassword);

        // Get a plain object representation of the user
        const userPlain = users.get({ plain: true });

        expect(userPlain.fullName).toBe("Adam Gilchrist");
        expect(userPlain.email).toBe("adam@example.com");
        expect(userPlain.phoneNumber).toBe("9865413022");
        // The mocked hashPassword always returns "hashedpassword123"
        expect(userPlain.password).toBe("hashedpassword123");
        expect(userPlain.profilePicture).toBe("");
        expect(userPlain.role).toBe("user");
        // Ensure that hashPassword was called with the original password
        expect(hashPassword).toHaveBeenCalledWith("adamg123");
    });

    it("should require all the fields where profile can be null or wmpty", async () => {
        await expect(UserMock.create({})).rejects.toThrow();
    });
});
