// This script handles both frontend interaction and backend route integration

// Frontend interaction: Handling form submission
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("delete-user-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const username = document.getElementById("other-username").value;

        try {
            const response = await fetch(`http://localhost:4001/auth/delete/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username })
            });

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("An error occurred while deleting the user.");
        }
    });
});

// Backend route handler (for demonstration, assume this script is run on the server)
// The following code is just an illustration and won't work directly in a client-side JS file
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const UserModel = require('./models/UserModel'); // Adjust path as necessary

app.use(bodyParser.json());

// Authentication and authorization middlewares
const authentication = (req, res, next) => {
    // Authentication logic
    next();
};

const authorization = (options) => (req, res, next) => {
    // Authorization logic based on options
    next();
};

// Route to handle user deletion
app.post('/auth/delete/user', authentication, authorization({ isAdmin: false }), async (req, res) => {
    const { username } = req.body;

    try {
        // Check if the user exists
        const user = await UserModel.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete the user
        await UserModel.destroy({
            where: { username }
        });

        return res.status(200).json({ message: `User ${username} deleted successfully` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while deleting the user" });
    }
});

// Start the server (for demonstration purposes)
const port = 4001;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
