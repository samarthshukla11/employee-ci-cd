const request = require("supertest");
const { app, setEmployeesCollection } = require("./app");

describe("Employee API", () => {
    beforeEach(() => {
        const mockCollection = {
            find: jest.fn(() => ({
                toArray: jest.fn().mockResolvedValue([
                    { name: "Samarth", department: "IT" }
                ])
            }))
        };

        setEmployeesCollection(mockCollection);
    });

    test("GET / should return API status", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(
            "Employee Management API is running!"
        );
    });

    test("GET /api/employees should return employees", async () => {
        const response = await request(app).get("/api/employees");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].name).toBe("Samarth");
    });
});