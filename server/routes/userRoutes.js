const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// const { authenticateToken } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = user;
        next();
    });
};

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', authenticateToken, userController.logout);
router.delete('/user-delete/:id', authMiddleware, userController.deleteUser);
// router.post('/password-reset', userController.resetPassword);

module.exports = router;
