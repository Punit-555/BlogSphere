const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const multer = require('multer');



exports.signup = async (req, res) => {
    const { name, email, password, phoneNumber, } = req.body;

    try {
        const generateRandomId = () => Math.floor(Math.random() * 90) + 10;

        const checkUserQuery = 'SELECT email FROM users WHERE email = ?';
        db.query(checkUserQuery, [email], async (err, results) => {
            if (err) {
                console.error('Error checking user existence:', err);
                return res.status(500).json({ error: 'Failed to check user existence' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'User already exists.' });
            }

            let userId;
            let userExists = true;
            const checkUserIdQuery = 'SELECT id FROM users WHERE id = ?';

            while (userExists) {
                userId = generateRandomId();
                const [userIdResults] = await db.promise().query(checkUserIdQuery, [userId]);
                userExists = userIdResults.length > 0;
            }
            // Hash the user's password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a JWT token
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

            // Send email to user
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const filePath = path.join(__dirname, '../views/signup-success.html');
            let htmlContent = fs.readFileSync(filePath, 'utf8');
            htmlContent = htmlContent.replace('{{name}}', name);

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Signup Successful!',
                html: htmlContent
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log('Error sending email:', error);
                } else {
                    console.log('Email sent successfully: ' + info.response);
                }
            });



            // Insert the new user into the database with the unique two-digit user ID
            const query = 'INSERT INTO users (id, name, email, password, phoneNumber, token) VALUES (?, ?, ?, ?, ?, ?)';


            db.query(query, [userId, name, email, hashedPassword, phoneNumber, token], (err, result) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).json({ error: 'Failed to register user', details: err.message });
                }
                res.status(201).json({ message: 'User registered successfully', userId, token, result });
            });


        });

    } catch (error) {
        console.error('Error in signup process:', error);
        res.status(500).json({ error: 'Failed to process signup' });
    }
};


exports.login = (req, res) => {
    const { email, password } = req.body;

    try {
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], async (err, results) => {
            if (err) {
                console.error('Error querying user:', err);
                return res.status(500).json({ error: 'Failed to query user' });
            }

            if (results.length === 0) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            const user = results[0];

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            delete user.password;

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

            const tokenQuery = 'UPDATE users SET token = ? WHERE id = ?';
            db.query(tokenQuery, [token, user.id], (err) => {
                if (err) {
                    console.error('Error storing token:', err);
                }
            });

            res.status(200).json({
                message: 'Login successful',
                token,
                user
            });
        });

    } catch (error) {
        console.error('Error in login process:', error);
        res.status(500).json({ error: 'Failed to process login' });
    }
};



exports.logout = (req, res) => {
    const userId = req.user.userId;

    const clearTokenQuery = 'UPDATE users SET token = NULL WHERE id = ?';
    const getUserDetailsQuery = 'SELECT id, name, email, phoneNumber FROM users WHERE id = ?';

    // First, clear the token
    db.query(clearTokenQuery, [userId], (err, result) => {
        if (err) {
            console.error('Error clearing token:', err);
            return res.status(500).json({ error: 'Failed to logout user' });
        }

        db.query(getUserDetailsQuery, [userId], (err, userResults) => {
            if (err) {
                console.error('Error fetching user details:', err);
                return res.status(500).json({ error: 'Failed to fetch user details after logout' });
            }

            if (userResults.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const user = userResults[0];

            // Send response with user details
            res.status(200).json({
                message: 'Logout successful',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phoneNumber: user.phoneNumber
                }
            });
        });
    });
};

// Deleting the user with associated Posts also .
exports.deleteUser = (req, res) => {
    const { id } = req.params;

    const deletePostsQuery = 'DELETE FROM posts WHERE user_id = ?';
    db.query(deletePostsQuery, [id], (err) => {
        if (err) {
            console.error('Error deleting posts:', err);
            return res.status(500).json({ error: 'Failed to delete posts' });
        }


        const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
        db.query(deleteUserQuery, [id], (err, results) => {
            if (err) {
                console.error('Error deleting user:', err);
                return res.status(500).json({ error: 'Failed to delete user' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found !' });
            }

            res.status(200).json({ message: 'User and related posts is deleted successfully!' });
        });
    });
};




exports.updateUser = async (req, res) => {
    const { name, email } = req.body;
    const { id } = req.params;
    console.log("ID", id, name, email);
    // Validate user ID
    if (!id) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    // Validate request body
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }

    // Use parameterized query to prevent SQL injection
    const updateQuery = `UPDATE users SET name = ?, email = ? WHERE id = ?`;

    try {
        db.query(updateQuery, [name, email, id], (err, results) => {
            if (err) {
                console.error('Error querying user:', err);
                return res.status(500).json({ error: 'Failed to update user.' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // Respond with success message and updated user details
            res.status(200).json({ message: 'User updated successfully.', user: { id, name, email } });
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'An error occurred while updating the user.' });
    }
};


exports.getUpdatedUser = (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM  users WHERE  id = ${id}  `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No user Found!' });
        }

        res.json(results);
    });
};


