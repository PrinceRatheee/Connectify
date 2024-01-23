const mongoose = require('mongoose');

async function connect() {
    try {
        mongoose.connect(process.env.MONGODB_URI);
        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("Database connected");
        });

        connection.on("error", () => {
            console.log("Error connecting to database");
            process.exit();
        });
    } catch (error) {
        console.log("Error connecting to database");
    }
}

module.exports = { connect };
