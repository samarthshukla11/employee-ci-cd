const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
//process.env.PORT: Reads the port number from an environment variable.
// process.env.MONGO_URL: Reads the MongoDB connection URL from an environment variable.
// || 3000: Uses port 3000 if no port is provided.
// || "mongodb://localhost:27017": Uses this default MongoDB URL if no connection URL is provided.

// MongoDB connection settings
const MONGO_URL =
    process.env.MONGO_URL || "mongodb://localhost:27017";

const client = new MongoClient(MONGO_URL);

let employeesCollection;

// Connect to MongoDB before starting the server
async function startServer() {
    try {
        await client.connect();

        console.log("MongoDB connected successfully");

        const database = client.db("employeeDB");
        employeesCollection = database.collection("employees");


// // Temporary employee data
// const employees = [
//     { id: 1, name: "Rahul", department: "IT" },
//     { id: 2, name: "Priya", department: "HR" }
// ];

app.get("/", (req, res) => {
            res.json({
                message: "Employee Management API is running!"
            });
        });

        // Get all employees
        app.get("/api/employees", async (req, res) => {
            try {
                const employees = await employeesCollection
                    .find({})
                    .toArray();

                res.json(employees);
            } catch (error) {
                res.status(500).json({
                    message: "Failed to fetch employees"
                });
            }
        });

        // Add a new employee
        app.post("/api/employees", async (req, res) => {
            try {
                const { name, department } = req.body;

                if (!name || !department) {
                    return res.status(400).json({
                        message: "Name and department are required"
                    });
                }

                const result = await employeesCollection.insertOne({
                    name,
                    department
                });

                res.status(201).json({
                    message: "Employee added successfully",
                    id: result.insertedId,
                    name,
                    department
                });
            } catch (error) {
                res.status(500).json({
                    message: "Failed to add employee"
                });
            }
        });


//update a new employee
app.put("/api/employees/:id", async (req, res) => {
    try {
        const { ObjectId } = require("mongodb");
        const { name, department } = req.body;

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid employee ID"
            });
        }

        if (!name || !department) {
            return res.status(400).json({
                message: "Name and department are required"
            });
        }

        const result = await employeesCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { name, department } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json({
            message: "Employee updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update employee"
        });
    }
});

// Delete an employee
app.delete("/api/employees/:id", async (req, res) => {
    try {
        const { ObjectId } = require("mongodb");

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid employee ID"
            });
        }

        const result = await employeesCollection.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json({
            message: "Employee deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete employee"
        });
    }
});



        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exitCode = 1;
    }
}

startServer();