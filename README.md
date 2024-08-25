
---

## Challenge Overview

### Step 1: Implement the Delete User Functionality

**Backend Implementation**

1. **Create `delete_user_by_username` Function in `authController.js`:**

   ```javascript
   const UserModel = require('../models/UserModel');

   const delete_user_by_username = async (req, res) => {
       try {
           const { username } = req.body;
           const result = await UserModel.destroy({
               where: { username: username }
           });
           if (result) {
               res.status(200).send(`User ${username} deleted successfully.`);
           } else {
               res.status(404).send(`User ${username} not found.`);
           }
       } catch (error) {
           res.status(500).send('An error occurred while deleting the user.');
       }
   };

   module.exports = {
       delete_user_by_username,
   };
   ```

2. **Set Up the Route in `authHandling.js`:**

   ```javascript
   const express = require('express');
   const router = express.Router();
   const authController = require('../controllers/authController');
   const authentication = require('../middleware/authentication');
   const authorisation = require('../middleware/authorisation');

   router.post(
       "/delete/user",
       authentication,
       authorisation({ isAdmin: false }),
       (req, res) => authController.delete_user_by_username(req, res),
   );

   module.exports = router;
   ```

**Frontend Implementation**

1. **Add Interaction Code in `delete.js`:**

   ```javascript
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
   ```

2. **Backend Route Handler (for demonstration, assume this script is run on the server):**

   ```javascript
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
   ```

### Step 2: Analysis of the Requirement

**Requirement:** “This delete user functionality can be done after authentication.”

**Explanation:**

Requiring authentication for user deletion is generally a good practice. Authentication ensures that only users who have logged in can access certain functionalities, which helps prevent unauthorized access. However, it's essential to combine authentication with authorization to ensure that the authenticated user has the appropriate permissions to perform the delete operation. For example, a regular user should not be able to delete other users' accounts, while an admin might.

**Authentication vs. Authorization:**

- **Authentication** verifies who the user is (e.g., through login credentials). It confirms that the user is who they claim to be.

- **Authorization** determines what an authenticated user is allowed to do (e.g., whether they can delete a user or not). It checks the user's permissions and roles.

**Key Points:**

- **Clarity (20%)**: The concepts of authentication and authorization should be clearly defined and differentiated.
- **Relevance (30%)**: The explanation should focus on the implications of requiring authentication for user deletion and why it's important.
- **Structure (10%)**: The explanation should be well-organized with a clear introduction, body, and conclusion.
- **Depth of Analysis (40%)**: The analysis should be thorough, covering the necessity of both authentication and authorization and their roles in securing functionalities.

**Adding to README:**

Include a section in your project's README that explains why requiring authentication is crucial for the delete user functionality and differentiates between authentication and authorization. This will help increase visibility and provide context for future developers or users.

--- 
