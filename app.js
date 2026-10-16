const express = require("express");
const { ObjectId } = require("mongodb");

const app = express();

app.use(express.json());

let employeesCollection;

// Allow server.js to provide the connected MongoDB collection
function setEmployeesCollection(collection) {
    employeesCollection = collection;
}

// Health check
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

// Add an employee
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

// Update an employee
app.put("/api/employees/:id", async (req, res) => {
    try {
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

module.exports = {
    app,
    setEmployeesCollection
};