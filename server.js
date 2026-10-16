
const { MongoClient } = require("mongodb");
const { app, setEmployeesCollection } = require("./app");

const PORT = process.env.PORT || 3000;
//process.env.PORT: Reads the port number from an environment variable.
// process.env.MONGO_URL: Reads the MongoDB connection URL from an environment variable.
// || 3000: Uses port 3000 if no port is provided.
// || "mongodb://localhost:27017": Uses this default MongoDB URL if no connection URL is provided.

// MongoDB connection settings
const MONGO_URL =
    process.env.MONGO_URL || "mongodb://localhost:27017";

const client = new MongoClient(MONGO_URL);

async function startServer() {
    try {
        await client.connect();

        console.log("MongoDB connected successfully");

        const database = client.db("employeeDB");
        const employeesCollection = database.collection("employees");

        setEmployeesCollection(employeesCollection);

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        await client.close().catch(() => {});
        process.exitCode = 1;
    }
}

startServer();